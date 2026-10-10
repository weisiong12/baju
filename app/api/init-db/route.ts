import { NextResponse } from "next/server";
import { initDatabase, pool } from "@/app/lib/db";

// GET /api/init-db - Health check and table verification
export async function GET() {
  try {
    const result = await initDatabase();
    const [products]: [any[], any] = await pool.query("SELECT COUNT(*) as count FROM products");
    const [orders]: [any[], any] = await pool.query("SELECT COUNT(*) as count FROM orders");

    return NextResponse.json({
      status: "CONNECTED",
      database: "TiDB Cloud (AWS AP-Southeast-1)",
      productsCount: products[0]?.count || 0,
      ordersCount: orders[0]?.count || 0,
      initResult: result,
    });
  } catch (error: any) {
    console.error("Database connection/init error:", error);
    return NextResponse.json(
      {
        status: "ERROR",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
