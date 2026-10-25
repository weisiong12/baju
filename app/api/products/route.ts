import { NextResponse } from "next/server";
import { pool, initDatabase, mapRowToProduct } from "@/app/lib/db";
import { PRODUCTS_DATABASE } from "@/app/site/data/products";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

// GET /api/products
export async function GET(request: Request) {
  try {
    // Ensure table exists & seeded
    await initDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.toUpperCase();

    let query = "SELECT * FROM products ORDER BY created_at DESC";
    let params: any[] = [];

    if (category && category !== "ALL") {
      query = "SELECT * FROM products WHERE UPPER(category) = ? ORDER BY created_at DESC";
      params = [category];
    }

    const [rows]: [any[], any] = await pool.query(query, params);

    if (!rows || rows.length === 0) {
      // Fallback to static catalog if DB is empty
      const list = Object.values(PRODUCTS_DATABASE);
      return NextResponse.json(
        category && category !== "ALL"
          ? list.filter((p) => p.category === category)
          : list,
        { headers: NO_CACHE_HEADERS }
      );
    }

    const products = rows.map(mapRowToProduct);
    return NextResponse.json(products, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    console.error("Failed to fetch products from TiDB:", error);
    // Graceful fallback to static database so store never goes down
    const list = Object.values(PRODUCTS_DATABASE);
    return NextResponse.json(list, { status: 200, headers: NO_CACHE_HEADERS });
  }
}

// POST /api/products (Admin creates new product)
export async function POST(request: Request) {
  try {
    await initDatabase();
    const body = await request.json();
    const id = body.id || `hb-${Date.now()}`;
    const name = body.name;
    const category = body.category || "TEES";
    const priceNumber = Number(body.priceNumber) || 99.0;
    const price = body.price || `${priceNumber.toFixed(2)} MYR`;
    const sku = body.sku || `HB-001-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const type = body.type || (category === "SHORTS" ? "shorts" : "tee");
    const colorName = body.colorName || "BLACK";
    const colorHex = body.colorHex || "#18181b";
    const frontBadge = body.frontBadge || "01 / FRONT";
    const sizes = body.sizes || ["S", "M", "L", "XL", "XXL"];
    let description = body.description;
    if (typeof description === "string") {
      description = description
        .split("\n")
        .map((l: string) => l.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean);
    } else if (Array.isArray(description)) {
      description = description
        .flatMap((item: string) =>
          typeof item === "string"
            ? item
                .split("\n")
                .map((l: string) => l.replace(/^[-•*]\s*/, "").trim())
                .filter(Boolean)
            : []
        );
    }
    if (!description || description.length === 0) {
      description = category === "SHORTS"
        ? [
            "RELAXED FIT DOUBLE LAYER MESH SHORT",
            "100% HIGH DENSITY POLYESTER",
            "DEEP ZIPPERED POCKETS WITH METALLIC HARDWARE",
            "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
          ]
        : [
            "HEAVYWEIGHT 260GSM 100% COMBED COTTON",
            "OVERSIZED BOXY STREETWEAR FIT",
            "HIGH DENSITY CHEST SILKSCREEN GRAPHIC",
            "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
          ];
    }
    const sizingNotes = body.sizingNotes || "TRUE TO SIZE FIT. SIZE UP FOR AN OVERSIZED BAGGY LOOK.";
    const shippingNotes = body.shippingNotes || "FREE STANDARD DELIVERY ACROSS WEST & EAST MALAYSIA.";
    const swatches = body.swatches || [{ id, name, colorHex, type }];
    const similarProductIds = body.similarProductIds || [];
    const stockAllocation = body.stockAllocation || { S: 50, M: 50, L: 50, XL: 50, XXL: 50 };
    const stock =
      body.stock !== undefined && body.stock !== null
        ? Number(body.stock)
        : Object.values(stockAllocation).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);

    const frontImage = body.frontImage || null;
    const backImage = body.backImage || null;
    const images = body.images || (frontImage ? [frontImage, ...(backImage ? [backImage] : [])] : []);

    await pool.query(
      `
      INSERT INTO products (
        id, name, category, price, price_number, sku, type, color_name, color_hex, front_badge,
        sizes, description, sizing_notes, shipping_notes, swatches, similar_product_ids, stock, stock_allocation,
        front_image, back_image, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        name,
        category,
        price,
        priceNumber,
        sku,
        type,
        colorName,
        colorHex,
        frontBadge,
        JSON.stringify(sizes),
        JSON.stringify(description),
        sizingNotes,
        shippingNotes,
        JSON.stringify(swatches),
        JSON.stringify(similarProductIds),
        stock,
        JSON.stringify(stockAllocation),
        frontImage,
        backImage,
        JSON.stringify(images),
      ]
    );

    return NextResponse.json({ success: true, id, message: "Product created in TiDB Cloud" }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to insert product into TiDB:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
