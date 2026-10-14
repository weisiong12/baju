import { NextResponse } from "next/server";
import { pool, initDatabase } from "@/app/lib/db";

// GET /api/orders
export async function GET() {
  try {
    await initDatabase();
    const [rows]: [any[], any] = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    return NextResponse.json(rows || [], {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch orders from TiDB:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST /api/orders
export async function POST(request: Request) {
  try {
    await initDatabase();
    const body = await request.json();

    const id = `ord-${Date.now()}`;
    const orderRef = body.orderRef || `HB-${Math.floor(100000 + Math.random() * 900000)}-SZE`;
    const customerName = (
      body.customerName ||
      `${body.firstName || ""} ${body.lastName || ""}`.trim() ||
      "Customer"
    ).trim();
    const customerEmail = body.email || "test@gmail.com";
    const customerPhone = body.phone || "";
    const address = body.address || "";
    const city = body.city || "";
    const state = body.state || "";
    const postalCode = body.postalCode || "";
    const totalAmount = Number(body.totalAmount) || 0;
    const items = JSON.stringify(body.items || []);
    const parsedItems = Array.isArray(body.items) ? body.items : [];
    const status = body.status || "PAID";

    // Verify inventory before accepting payment/order
    for (const it of parsedItems) {
      const prodId = it.productId || it.id;
      const prodName = it.name || "";
      const size = it.size || "M";
      if (prodId || prodName) {
        const [pRows]: [any[], any] = await pool.query(
          "SELECT id, name, stock, stock_allocation FROM products WHERE id = ? OR LOWER(TRIM(name)) = LOWER(TRIM(?)) LIMIT 1",
          [prodId || "", prodName]
        );
        if (pRows && pRows.length > 0) {
          const p = pRows[0];
          const productStock = Number(p.stock ?? 0);
          if (productStock <= 0) {
            return NextResponse.json(
              {
                error: `Piece "${p.name}" is SOLD OUT. Checkout cannot proceed.`,
              },
              { status: 400 }
            );
          }
          let alloc = p.stock_allocation;
          if (typeof alloc === "string") {
            try {
              alloc = JSON.parse(alloc);
            } catch {
              alloc = {};
            }
          }
          if (alloc && typeof alloc === "object") {
            const avail = Number(alloc[size] ?? alloc[size?.toUpperCase()] ?? p.stock ?? 0);
            if (avail <= 0) {
              return NextResponse.json(
                {
                  error: `Piece "${p.name} (${size})" is SOLD OUT. Checkout cannot proceed.`,
                },
                { status: 400 }
              );
            }
          }
        }
      }
    }

    await pool.query(
      `
      INSERT INTO orders (
        id, order_ref, customer_name, customer_email, customer_phone, address, city, state, postal_code, total_amount, items, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        orderRef,
        customerName,
        customerEmail,
        customerPhone,
        address,
        city,
        state,
        postalCode,
        totalAmount,
        items,
        status,
      ]
    );

    // Deduct stock for ordered items in TiDB Cloud
    for (const it of parsedItems) {
      const prodId = it.productId || it.id;
      const prodName = it.name || "";
      const size = it.size || "M";
      const qty = Number(it.quantity) || 1;
      if (prodId || prodName) {
        try {
          const [pRows]: [any[], any] = await pool.query(
            "SELECT id, stock, stock_allocation FROM products WHERE id = ? OR LOWER(TRIM(name)) = LOWER(TRIM(?)) LIMIT 1",
            [prodId || "", prodName]
          );
          if (pRows && pRows.length > 0) {
            const actualId = pRows[0].id;
            let alloc = pRows[0].stock_allocation;
            if (typeof alloc === "string") {
              try {
                alloc = JSON.parse(alloc);
              } catch {
                alloc = {};
              }
            }
            if (!alloc) alloc = { S: 50, M: 50, L: 50, XL: 50, XXL: 50 };

            const currentSizeStock = Number(alloc[size] ?? alloc[size.toUpperCase()] ?? 0);
            const newSizeStock = Math.max(0, currentSizeStock - qty);
            alloc[size] = newSizeStock;

            const newTotalStock = Object.values(alloc).reduce(
              (acc: number, val: any) => acc + (Number(val) || 0),
              0
            );

            await pool.query(
              "UPDATE products SET stock = ?, stock_allocation = ? WHERE id = ?",
              [newTotalStock, JSON.stringify(alloc), actualId]
            );
          }
        } catch (stockErr) {
          console.error(`Failed to deduct stock for product ${prodId}:`, stockErr);
        }
      }
    }

    return NextResponse.json({ success: true, orderId: orderRef, message: "Order logged into TiDB Cloud" });
  } catch (error: any) {
    console.error("Failed to insert order into TiDB:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
