"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  ShoppingBag,
  Box,
  Users,
  Home,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";
  const isDashboard = pathname === "/admin";
  const isOrders = pathname.startsWith("/orders");
  const isProducts = pathname.startsWith("/products");
  const isCustomers = pathname.startsWith("/customers");

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hb_admin_authenticated");
    }
    router.push("/admin/login");
  };

  return (
    <aside className="w-[220px] bg-white border-r border-[#ededed] p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-60px)]">
      <div className="space-y-1">
        {/* DASHBOARD */}
        <Link
          href={isLoginPage ? "/admin/login" : "/admin"}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-[10.5px] font-black tracking-[0.18em] uppercase transition-all ${
            isDashboard
              ? "bg-black text-white"
              : isLoginPage
              ? "text-[#a1a1aa] hover:text-black cursor-pointer"
              : "text-[#6b7280] hover:text-black hover:bg-neutral-50"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>DASHBOARD</span>
        </Link>

        {/* ORDERS */}
        <Link
          href={isLoginPage ? "/admin/login" : "/orders"}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-[10.5px] font-black tracking-[0.18em] uppercase transition-all ${
            isOrders
              ? "bg-black text-white"
              : isLoginPage
              ? "text-[#a1a1aa] hover:text-black cursor-pointer"
              : "text-[#6b7280] hover:text-black hover:bg-neutral-50"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
          <span>ORDERS</span>
        </Link>

        {/* PRODUCTS */}
        <Link
          href={isLoginPage ? "/admin/login" : "/products"}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-[10.5px] font-black tracking-[0.18em] uppercase transition-all ${
            isProducts
              ? "bg-black text-white"
              : isLoginPage
              ? "text-[#a1a1aa] hover:text-black cursor-pointer"
              : "text-[#6b7280] hover:text-black hover:bg-neutral-50"
          }`}
        >
          <Box className="w-3.5 h-3.5 stroke-[2]" />
          <span>PRODUCTS</span>
        </Link>

        {/* CUSTOMERS */}
        <Link
          href={isLoginPage ? "/admin/login" : "/customers"}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-[10.5px] font-black tracking-[0.18em] uppercase transition-all ${
            isCustomers
              ? "bg-black text-white"
              : isLoginPage
              ? "text-[#a1a1aa] hover:text-black cursor-pointer"
              : "text-[#6b7280] hover:text-black hover:bg-neutral-50"
          }`}
        >
          <Users className="w-3.5 h-3.5 stroke-[2]" />
          <span>CUSTOMERS</span>
        </Link>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-1 pt-6">
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2 text-[10.5px] font-bold tracking-[0.18em] text-[#6b7280] hover:text-black uppercase transition-all"
        >
          <Home className="w-3.5 h-3.5 stroke-[2]" />
          <span>VIEW SITE</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-[10.5px] font-bold tracking-[0.18em] text-[#ef4444] hover:text-red-600 uppercase transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 stroke-[2]" />
          <span>LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}
