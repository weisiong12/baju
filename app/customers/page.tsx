"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  Search,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("hb_admin_authenticated");
      if (!isAuth) {
        router.replace("/admin/login");
      }
    }
  }, [router]);

  const [customers, setCustomers] = useState<any[]>([]);

  const loadCustomers = () => {
    fetch("/api/customers", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomers(data);
        }
      })
      .catch((err) => console.log("Cached customers:", err));
  };

  useEffect(() => {
    loadCustomers();
    const interval = setInterval(loadCustomers, 4000);
    window.addEventListener("focus", loadCustomers);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", loadCustomers);
    };
  }, []);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalUsers = customers.length;
  const totalSpendSum = customers.reduce((sum, c) => sum + (c.totalSpentNumber || 0), 0);
  const avgLifetime = totalUsers > 0 ? (totalSpendSum / totalUsers).toFixed(2) : "0.00";

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body antialiased selection:bg-black selection:text-white">
      {/* Top Navigation Header */}
      <Header title="CUSTOMERS CENTER" />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Workspace */}
        <main className="flex-1 px-8 py-8 md:px-10 md:py-9 space-y-7 max-w-[1440px]">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9.5px] font-bold tracking-[0.24em] text-neutral-400 uppercase">
                CUSTOMER RELATIONS
              </p>
              <h1 className="font-display text-[28px] md:text-[32px] font-black italic tracking-[0.06em] text-black uppercase mt-0.5">
                DIRECTORY
              </h1>
            </div>

            {/* Right Mini Stats */}
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase">
                  TOTAL DATABASE
                </p>
                <p className="font-display font-black italic text-sm md:text-base tracking-tight text-black uppercase mt-0.5">
                  {totalUsers} USERS
                </p>
              </div>

              <div className="text-right">
                <p className="text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase">
                  AVG LIFETIME
                </p>
                <p className="font-display font-black italic text-sm md:text-base tracking-tight text-black uppercase mt-0.5">
                  RM {avgLifetime}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar Box */}
          <div className="bg-white border border-[#eaeaea] p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Search Box */}
              <div className="md:col-span-10 relative">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="SEARCH NAME, EMAIL, PHONE..."
                    className="w-full pl-10 pr-8 py-2.5 bg-[#fafafa] border border-[#ebebeb] text-[10px] font-bold tracking-wider placeholder:text-neutral-400 text-black uppercase focus:outline-none focus:border-black transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 text-neutral-400 hover:text-black text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Show Dropdown */}
              <div className="md:col-span-2">
                <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                  SHOW
                </label>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-[#fafafa] border border-[#ebebeb] px-3.5 py-2.5 text-[10px] font-black tracking-wider text-black uppercase focus:outline-none cursor-pointer hover:border-neutral-400"
                  >
                    <option value={10}>10 RECORDS</option>
                    <option value={25}>25 RECORDS</option>
                    <option value={50}>50 RECORDS</option>
                    <option value={100}>100 RECORDS</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Customers List Cards */}
          <div className="space-y-4">
            {paginatedCustomers.length === 0 ? (
              <div className="bg-white border border-[#eaeaea] p-12 text-center text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                NO CUSTOMERS FOUND MATCHING "{searchQuery.toUpperCase()}"
              </div>
            ) : (
              paginatedCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white border border-[#eaeaea] p-6 hover:border-neutral-300 transition-all shadow-2xs"
                >
                  <div className="grid grid-cols-12 items-center gap-6">
                    {/* Left Column: Avatar + Customer Details */}
                    <div className="col-span-12 md:col-span-6 flex items-center gap-5">
                      {/* Avatar Box */}
                      <div className="w-12 h-12 bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center font-display font-black italic text-lg text-black shrink-0">
                        {customer.initial}
                      </div>

                      {/* Customer Info */}
                      <div className="min-w-0 space-y-1">
                        <div className="font-display font-black text-sm tracking-wide text-black uppercase">
                          {customer.name}
                        </div>

                        {/* Meta Tags Row */}
                        <div className="flex flex-wrap items-center gap-4 text-[9.5px] font-medium text-neutral-400 uppercase tracking-wide">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-neutral-400" />
                            {customer.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-neutral-400" />
                            {customer.phone}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            {customer.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Stats & Action */}
                    <div className="col-span-12 md:col-span-6 flex items-center justify-between md:justify-end gap-8 md:gap-12">
                      {/* Orders Count */}
                      <div className="shrink-0">
                        <div className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
                          ORDERS
                        </div>
                        <div className="flex items-center gap-1 font-display font-black text-xs md:text-sm text-black">
                          <ShoppingBag className="w-3 h-3 text-neutral-400" />
                          <span>{customer.ordersCount}</span>
                        </div>
                      </div>

                      {/* Lifetime LTV */}
                      <div className="shrink-0">
                        <div className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
                          LIFETIME LTV
                        </div>
                        <div className="font-display font-black italic text-xs md:text-sm tracking-tight text-black">
                          {customer.ltv}
                        </div>
                      </div>

                      {/* Last Interaction */}
                      <div className="shrink-0">
                        <div className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
                          LAST INTERACTION
                        </div>
                        <div className="text-right">
                          <div className="text-[9.5px] font-bold text-neutral-800 uppercase leading-none">
                            {customer.lastInteractionDate}
                          </div>
                          <div className="text-[8.5px] font-medium text-neutral-400 uppercase mt-0.5">
                            {customer.lastInteractionTime}
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp Action Button */}
                      <div className="shrink-0">
                        <a
                          href={`https://wa.me/${(customer.phone || "").replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Chat via WhatsApp"
                          className="w-9 h-9 border border-[#e5e5e5] hover:border-black flex items-center justify-center text-neutral-400 hover:text-black transition-all bg-white cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 stroke-[1.8]" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Footer */}
          <div className="px-2 py-4 flex items-center justify-between text-[9.5px] font-bold tracking-[0.2em] uppercase">
            <span className="text-neutral-400">
              INDEXING {filteredCustomers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} TO{" "}
              {Math.min(currentPage * pageSize, filteredCustomers.length)} OF {totalUsers} VERIFIED USERS
            </span>
            <div className="flex items-center gap-4">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`transition-colors cursor-pointer ${
                  currentPage <= 1 ? "text-neutral-300 cursor-not-allowed" : "text-neutral-500 hover:text-black"
                }`}
              >
                PREVIOUS
              </button>
              <span className="text-black font-black">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`transition-colors cursor-pointer ${
                  currentPage >= totalPages
                    ? "text-neutral-300 cursor-not-allowed"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                NEXT
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
