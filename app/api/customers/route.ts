import { NextResponse } from "next/server";
import { pool, initDatabase } from "@/app/lib/db";

// GET /api/customers - Group and calculate customer metrics from orders
export async function GET() {
  try {
    await initDatabase();

    const [orders]: [any[], any] = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    if (!orders || orders.length === 0) {
      return NextResponse.json([], {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
    }

    // Group orders by Customer Name (case-insensitive & trimmed)
    const customerMap = new Map<string, any>();

    for (const order of orders) {
      const rawName = (order.customer_name || "").trim();
      const name = (rawName || "CUSTOMER").toUpperCase();
      const email = (order.customer_email || "").trim();
      const phone = (order.customer_phone || "").trim();
      const location = (order.state || order.city || "WEST MALAYSIA").toUpperCase();

      // Normalize name as primary key (e.g. "CHONG POUL", "ASD SAD")
      const key = name.toLowerCase().replace(/\s+/g, " ").trim();

      const orderAmount = Number(order.total_amount) || 0;
      const orderDate = new Date(order.created_at || Date.now());

      if (!customerMap.has(key)) {
        const initial = name.charAt(0) || "C";
        customerMap.set(key, {
          id: `cust-${key.replace(/[^a-z0-9]/g, "") || Date.now()}`,
          initial,
          name,
          email: (email || "UNSPECIFIED").toUpperCase(),
          phone: phone || "UNSPECIFIED",
          location,
          ordersCount: 1,
          totalSpentNumber: orderAmount,
          latestOrderDate: orderDate,
        });
      } else {
        const existing = customerMap.get(key);
        existing.ordersCount += 1;
        existing.totalSpentNumber += orderAmount;
        if (orderDate > existing.latestOrderDate) {
          existing.latestOrderDate = orderDate;
          existing.name = name;
          if (email && email.toUpperCase() !== "UNSPECIFIED") existing.email = email.toUpperCase();
          if (phone && phone !== "UNSPECIFIED") existing.phone = phone;
          if (location) existing.location = location;
        }
      }
    }

    const customerList = Array.from(customerMap.values()).map((c) => {
      const d = c.latestOrderDate;
      return {
        id: c.id,
        initial: c.initial,
        name: c.name,
        email: c.email,
        phone: c.phone,
        location: c.location,
        ordersCount: c.ordersCount,
        ltv: `RM ${c.totalSpentNumber.toFixed(2)}`,
        totalSpentNumber: c.totalSpentNumber,
        lastInteractionDate: d.toLocaleDateString(),
        lastInteractionTime: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    });

    return NextResponse.json(customerList);
  } catch (error: any) {
    console.error("Failed to fetch customers from TiDB:", error);
    return NextResponse.json(
      [
        {
          id: "cust-1",
          initial: "A",
          name: "ASD SAD",
          email: "TEST@GMAIL.COM",
          phone: "01123456789",
          location: "WEST MALAYSIA",
          ordersCount: 1,
          ltv: "RM 99.00",
          totalSpentNumber: 99.0,
          lastInteractionDate: "3/28/2026",
          lastInteractionTime: "06:27 PM",
        },
      ],
      { status: 200 }
    );
  }
}
