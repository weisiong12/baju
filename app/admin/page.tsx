"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import R2MediaModal from "../components/R2MediaModal";
import { TrendingUp, Box, ShoppingBag, Info, Cloud, Upload } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState("OCT 2026");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [catalogCount, setCatalogCount] = useState(5);

  const monthMap: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
  };

  const months = [
    "OCT 2026",
    "SEP 2026",
    "AUG 2026",
    "JUL 2026",
    "JUN 2026",
    "MAY 2026",
  ];

  const getMonthTarget = (str: string) => {
    const parts = str.split(" ");
    const m = parts[0]?.toUpperCase();
    const y = Number(parts[1]) || 2026;
    return { month: monthMap[m] ?? 9, year: y };
  };

  const target = getMonthTarget(selectedMonth);

  // Filter orders strictly by selected month
  const monthOrders = allOrders.filter((o: any) => {
    const dateVal = o.created_at || o.date;
    if (!dateVal) return false;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return false;
    return d.getMonth() === target.month && d.getFullYear() === target.year;
  });

  const validMonthOrders = monthOrders.filter((o: any) => o.status !== "CANCELLED");
  const monthlyRevenue = validMonthOrders.reduce(
    (sum: number, o: any) => sum + (Number(o.total_amount) || 0),
    0
  );
  const monthlyPipeline = validMonthOrders.length;
  const recentOrders = monthOrders.slice(0, 10);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("hb_admin_authenticated");
      if (isAuth === "true") {
        setIsAuthenticated(true);
      } else {
        router.replace("/admin/login");
      }
    }
  }, [router]);

  const loadDashboardData = () => {
    // Fetch live product count from TiDB
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCatalogCount(data.length);
        }
      })
      .catch((err) => console.log("Catalog fetch err:", err));

    // Fetch live orders from TiDB
    fetch("/api/orders", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllOrders(data);
        }
      })
      .catch((err) => console.log("Orders fetch err:", err));
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 4000);
    window.addEventListener("focus", loadDashboardData);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", loadDashboardData);
    };
  }, []);



  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center font-display font-black italic text-sm tracking-widest uppercase">
        LOADING CONTROL CENTER...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body antialiased selection:bg-black selection:text-white">
      {/* Top Navigation Header */}
      <Header title="DASHBOARD CENTER" />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Dashboard Canvas */}
        <main className="flex-1 px-8 py-8 md:px-10 md:py-9 space-y-7 max-w-[1440px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-[26px] md:text-[28px] font-black italic tracking-[0.06em] text-black uppercase">
                EXECUTIVE INTELLIGENCE
              </h1>
              <p className="text-[9.5px] font-bold tracking-[0.24em] text-neutral-400 uppercase mt-0.5">
                REAL-TIME PERFORMANCE ANALYTICS & LOGISTICS
              </p>
            </div>

            <button
              onClick={() => setShowMediaModal(true)}
              className="bg-black text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Cloud className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>R2 MEDIA ASSETS</span>
            </button>
          </div>

          {/* Top 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Live Revenue */}
            <div className="bg-white border border-[#eaeaea] p-6 min-h-[195px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="metric-header">LIVE REVENUE</span>
                  <TrendingUp className="w-4 h-4 text-neutral-300 stroke-[2]" />
                </div>

                <div className="mt-6 flex items-baseline justify-between">
                  <span className="font-display text-[36px] font-black italic tracking-tight text-black">
                    RM {monthlyRevenue.toFixed(2)}
                  </span>
                  <span className="sub-label italic">MONTHLY GROSS</span>
                </div>
              </div>

              {/* Month Pills */}
              <div className="mt-8 flex flex-wrap items-center gap-1.5">
                {months.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMonth(m)}
                    className={`px-2.5 py-1 text-[9px] uppercase transition-all ${
                      selectedMonth === m
                        ? "bg-black text-white font-black tracking-wider"
                        : "text-neutral-400 hover:text-black font-bold tracking-wider"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Card 2: Active Pipeline */}
            <div className="bg-white border border-[#eaeaea] p-6 min-h-[195px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="metric-header">ACTIVE PIPELINE</span>
                  <ShoppingBag className="w-4 h-4 text-neutral-300 stroke-[2]" />
                </div>

                <div className="mt-6 flex items-baseline justify-between">
                  <span className="font-display text-[36px] font-black italic tracking-tight text-black">
                    {monthlyPipeline}
                  </span>
                  <span className="sub-label italic">PENDING/SHIPPED</span>
                </div>
              </div>
            </div>

            {/* Card 3: Global Catalog */}
            <div className="bg-white border border-[#eaeaea] p-6 min-h-[195px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="metric-header">GLOBAL CATALOG</span>
                  <Box className="w-4 h-4 text-neutral-300 stroke-[2]" />
                </div>

                <div className="mt-6 flex items-baseline justify-between">
                  <span className="font-display text-[36px] font-black italic tracking-tight text-black">
                    {catalogCount}
                  </span>
                  <span className="sub-label italic">TOTAL PIECES</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Split Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns: Live Transaction Stream */}
            <div className="lg:col-span-8 space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-bold tracking-[0.22em] text-neutral-700 uppercase">
                  LIVE TRANSACTION STREAM
                </h2>
                <button
                  onClick={() => router.push("/orders")}
                  className="text-[9.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase hover:text-black cursor-pointer"
                >
                  COMMAND CENTER
                </button>
              </div>

              {/* Transactions Container */}
              <div className="bg-white border border-[#eaeaea] divide-y divide-[#f5f5f5]">
                {recentOrders.length === 0 ? (
                  <div className="p-8 text-center text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                    NO TRANSACTIONS RECORDED YET
                  </div>
                ) : (
                  recentOrders.map((ord: any) => (
                    <div
                      key={ord.id || ord.order_ref}
                      onClick={() => router.push("/orders")}
                      className="p-5 flex items-center justify-between hover:bg-neutral-50/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Thumbnail Tag Box */}
                        <div className="w-12 h-10 border border-[#e5e5e5] bg-[#fafafa] flex items-center justify-center font-display font-black italic text-[9.5px] tracking-tighter text-neutral-700">
                          #{(ord.order_ref || ord.id || "").slice(-3) || "SZE"}
                        </div>
                        <div>
                          <div className="text-[11px] font-black tracking-wider text-black uppercase">
                            {ord.customer_name || "Customer"}
                          </div>
                          <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">
                            {ord.customer_email || "test@gmail.com"}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-[10px] font-bold italic tracking-wider uppercase ${
                            ord.status === "CONFIRMED"
                              ? "text-blue-600"
                              : ord.status === "SHIPPED"
                              ? "text-purple-600"
                              : ord.status === "DELIVERED"
                              ? "text-emerald-600"
                              : ord.status === "CANCELLED"
                              ? "text-red-600"
                              : "text-[#ea580c]"
                          }`}
                        >
                          {ord.status || "PENDING"}
                        </div>
                        <div className="text-[11px] font-black tracking-tight text-black mt-0.5">
                          RM {Number(ord.total_amount).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right 4 Columns: Inventory Intel & System Notification */}
            <div className="lg:col-span-4 space-y-6">
              {/* Inventory Intel */}
              <div className="space-y-2.5">
                <h2 className="text-[10px] font-bold tracking-[0.22em] text-neutral-700 uppercase">
                  INVENTORY INTEL
                </h2>
                <div className="bg-white border border-[#eaeaea] h-[95px] flex items-center justify-center p-4">
                  <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-300 uppercase">
                    STOCK LEVELS OPTIMAL
                  </span>
                </div>
              </div>

              {/* System Notification Box */}
              <div className="bg-[#fcfcfc] border border-[#ebebeb] p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Info className="w-3.5 h-3.5" />
                  <span className="text-[9.5px] font-bold tracking-[0.2em] uppercase">
                    SYSTEM NOTIFICATION
                  </span>
                </div>
                <p className="text-[10px] font-black tracking-wide text-black uppercase leading-relaxed">
                  ALL TRANSACTIONAL DATA IS SYNCHRONIZED WITH YOUR TIDB CLOUD CLUSTER.
                </p>
              </div>

              {/* Cloudflare R2 Storage Status Widget */}
              <div className="bg-white border border-[#eaeaea] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-700">
                    <Cloud className="w-3.5 h-3.5 text-black" />
                    <span className="text-[9.5px] font-black tracking-[0.2em] uppercase">
                      CLOUDFLARE R2
                    </span>
                  </div>
                  <span className="text-[7.5px] font-black tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 uppercase">
                    ONLINE
                  </span>
                </div>
                <div className="space-y-1 text-[9px] font-bold text-neutral-500 uppercase">
                  <div className="flex justify-between">
                    <span>BUCKET</span>
                    <span className="text-black font-black">CLOTH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PUBLIC DEV HOST</span>
                    <span className="text-black font-mono text-[8px] truncate max-w-[140px]">
                      PUB-C52E7B8C42B4...
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowMediaModal(true)}
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] hover:border-black py-2 text-[9px] font-black uppercase tracking-widest text-black transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-black hover:text-white"
                >
                  <Upload className="w-3 h-3" />
                  <span>UPLOAD PHOTO</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cloudflare R2 Media Modal */}
          <R2MediaModal
            isOpen={showMediaModal}
            onClose={() => setShowMediaModal(false)}
          />
        </main>
      </div>
    </div>
  );
}
