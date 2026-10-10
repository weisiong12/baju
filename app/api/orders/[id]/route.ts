import { NextResponse } from "next/server";
import { pool, initDatabase } from "@/app/lib/db";

// PUT /api/orders/[id] - Update order status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await initDatabase();
    const body = await request.json();
    const status = body.status || "CONFIRMED";

    const [rows]: [any[], any] = await pool.query(
      "SELECT * FROM orders WHERE id = ? OR order_ref = ? LIMIT 1",
      [id, id]
    );

    if (rows && rows.length > 0) {
      await pool.query(
        "UPDATE orders SET status = ? WHERE id = ? OR order_ref = ?",
        [status, id, id]
      );
    } else {
      await pool.query(
        `
        INSERT INTO orders (
          id, order_ref, customer_name, customer_email, customer_phone,
          address, city, state, postal_code, total_amount, items, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          id,
          id,
          body.customerName || "ASD SAD",
          body.customerEmail || "test@gmail.com",
          body.customerPhone || "01123456789",
          body.address || "12, JALAN STREETWEAR 3",
          body.city || "KUALA LUMPUR",
          body.state || "WEST MALAYSIA",
          body.postalCode || "50000",
          body.totalAmount ? Number(body.totalAmount) : 99.0,
          JSON.stringify(body.items || [{ name: "BLACK HOMEBOY LOGO TEE", size: "M", quantity: 1, price: 99.0 }]),
          status,
        ]
      );
    }

    return NextResponse.json({ success: true, message: `Order ${id} status updated to ${status}` });
  } catch (error: any) {
    console.error(`Failed to update order ${id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/orders/[id] - Delete order from TiDB Cloud
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await initDatabase();
    await pool.query("DELETE FROM orders WHERE id = ? OR order_ref = ?", [id, id]);
    return NextResponse.json({ success: true, message: `Order ${id} deleted from TiDB Cloud` });
  } catch (error: any) {
    console.error(`Failed to delete order ${id}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
