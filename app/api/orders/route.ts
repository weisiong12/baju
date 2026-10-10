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
    const status = "PENDING";

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

    return NextResponse.json({ success: true, orderId: orderRef, message: "Order logged into TiDB Cloud" });
  } catch (error: any) {
    console.error("Failed to insert order into TiDB:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
