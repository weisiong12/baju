import { NextResponse } from "next/server";
import { pool, mapRowToProduct, initDatabase } from "@/app/lib/db";
import { PRODUCTS_DATABASE } from "@/app/site/data/products";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

// GET /api/products/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await initDatabase();
    const [rows]: [any[], any] = await pool.query(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows && rows.length > 0) {
      return NextResponse.json(mapRowToProduct(rows[0]), { headers: NO_CACHE_HEADERS });
    }

    // Fallback to static DB if not found
    const fallback = PRODUCTS_DATABASE[id];
    if (fallback) {
      return NextResponse.json(fallback, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404, headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    console.error(`Failed to get product ${id}:`, error);
    const fallback = PRODUCTS_DATABASE[id];
    if (fallback) return NextResponse.json(fallback, { headers: NO_CACHE_HEADERS });
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

// PUT /api/products/[id] (Admin update product in TiDB Cloud)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await initDatabase();
    const body = await request.json();

    const [rows]: [any[], any] = await pool.query(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [id]
    );

    const fallback = PRODUCTS_DATABASE[id];
    const current = (rows && rows.length > 0) ? rows[0] : null;

    const name = body.name ?? current?.name ?? fallback?.name ?? "HOMEBOY PIECE";
    const category = body.category ?? current?.category ?? fallback?.category ?? "TEES";
    const priceNumber = body.priceNumber ? Number(body.priceNumber) : (current?.price_number ?? fallback?.priceNumber ?? 99);
    const price = body.price ?? `${priceNumber.toFixed(2)} MYR`;
    const sku = body.sku ?? current?.sku ?? fallback?.sku ?? "HB-001-CUSTOM";
    const type = body.type ?? current?.type ?? fallback?.type ?? (category === "SHORTS" ? "shorts" : "tee");
    const colorName = body.colorName ?? current?.color_name ?? fallback?.colorName ?? "CUSTOM";
    const colorHex = body.colorHex ?? current?.color_hex ?? fallback?.colorHex ?? "#18181b";
    let descArr = body.description;
    if (typeof descArr === "string") {
      try {
        const parsed = JSON.parse(descArr);
        if (Array.isArray(parsed)) {
          descArr = parsed;
        } else {
          descArr = descArr.split("\n");
        }
      } catch {
        descArr = descArr.split("\n");
      }
    }
    if (Array.isArray(descArr)) {
      descArr = descArr
        .map((l: string) => (typeof l === "string" ? l.replace(/^[-•*]\s*/, "").trim() : ""))
        .filter(Boolean);
    } else {
      descArr = ["HEAVYWEIGHT 260GSM 100% COMBED COTTON", "OVERSIZED BOXY STREETWEAR FIT", "ALL SALES ARE FINAL NO RETURN NO REFUNDS"];
    }
    const description = JSON.stringify(descArr);
    const sizes = body.sizes ? (typeof body.sizes === "string" ? body.sizes : JSON.stringify(body.sizes)) : (current?.sizes ? (typeof current.sizes === "string" ? current.sizes : JSON.stringify(current.sizes)) : JSON.stringify(["S", "M", "L", "XL", "XXL"]));

    let stockAllocation = body.stockAllocation;
    if (!stockAllocation && current?.stock_allocation) {
      try {
        stockAllocation = typeof current.stock_allocation === "string" ? JSON.parse(current.stock_allocation) : current.stock_allocation;
      } catch {
        stockAllocation = { S: 50, M: 50, L: 50, XL: 50, XXL: 50 };
      }
    }
    if (!stockAllocation) {
      stockAllocation = { S: 50, M: 50, L: 50, XL: 50, XXL: 50 };
    }

    const stock =
      body.stock !== undefined && body.stock !== null
        ? Number(body.stock)
        : Object.values(stockAllocation).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);

    if (current) {
      // Update existing record
      await pool.query(
        `
        UPDATE products
        SET name = ?, category = ?, price = ?, price_number = ?, sku = ?, type = ?, color_name = ?, color_hex = ?, sizes = ?, description = ?, stock = ?, stock_allocation = ?
        WHERE id = ?
      `,
        [name, category, price, priceNumber, sku, type, colorName, colorHex, sizes, description, stock, JSON.stringify(stockAllocation), id]
      );
    } else {
      // Insert if not yet in DB
      await pool.query(
        `
        INSERT INTO products (
          id, name, category, price, price_number, sku, type, color_name, color_hex, front_badge,
          sizes, description, sizing_notes, shipping_notes, swatches, similar_product_ids, stock, stock_allocation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '01 / FRONT', ?, ?, '', '', '[]', '[]', ?, ?)
      `,
        [id, name, category, price, priceNumber, sku, type, colorName, colorHex, sizes, description, stock, JSON.stringify(stockAllocation)]
      );
    }

    return NextResponse.json({ success: true, message: `Product ${id} updated in TiDB Cloud` });
  } catch (error: any) {
    console.error(`Failed to update product ${id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/products/[id] (Admin delete product from TiDB Cloud)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await initDatabase();
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    return NextResponse.json({ success: true, message: `Product ${id} deleted from TiDB Cloud` });
  } catch (error: any) {
    console.error(`Failed to delete product ${id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
