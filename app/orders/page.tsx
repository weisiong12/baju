"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  Search,
  Calendar,
  ChevronDown,
  MessageCircle,
  Trash2,
  Clock,
  Shirt,
  X,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

export interface OrderItem {
  id?: string;
  productId?: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  type?: "tee" | "shorts";
  colorHex?: string;
}

export interface OrderRecord {
  id: string;
  orderRef: string;
  date: string;
  dateStr: string;
  createdAt: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  totalAmount: string;
  totalNumber: number;
  shipping: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: OrderItem[];
}

// Mini Vector Shirt/Shorts Thumb for Order Items
function ItemThumb({ type, colorHex }: { type?: "tee" | "shorts" | "hat" | string; colorHex?: string }) {
  const bg = colorHex || "#18181b";
  if (type === "hat") {
    return (
      <svg viewBox="0 0 100 90" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 55 C22 25 78 25 78 55 Z" fill={bg} stroke={bg === "#ffffff" ? "#d4d4d8" : bg} strokeWidth="1.5" />
        <path d="M12 55 C12 55 50 75 88 55 C82 52 75 50 68 50 L32 50 C25 50 18 52 12 55 Z" fill={bg} stroke={bg === "#ffffff" ? "#d4d4d8" : bg} strokeWidth="1.5" />
        <text x="50" y="42" fill={bg === "#ffffff" ? "#000000" : "#ffffff"} fontSize="4.5" fontWeight="900" fontStyle="italic" textAnchor="middle">HB</text>
      </svg>
    );
  }
  if (type === "shorts") {
    return (
      <svg viewBox="0 0 100 90" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="22" y="10" width="56" height="8" rx="1" fill={bg} />
        <path
          d="M22 16 L18 76 C18 78 40 80 46 76 L50 40 L54 76 C60 80 82 78 82 76 L78 16 Z"
          fill={bg}
          stroke={bg}
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 90" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 10 C38 18 62 18 68 10 L88 24 L76 40 L68 34 L68 84 L32 84 L32 34 L24 40 L12 24 Z"
        fill={bg}
        stroke={bg === "#ffffff" ? "#d4d4d8" : bg}
        strokeWidth="1.5"
      />
      <text
        x="50"
        y="42"
        fill={bg === "#ffffff" ? "#000000" : "#ffffff"}
        fontSize="6"
        fontWeight="900"
        fontStyle="italic"
        textAnchor="middle"
      >
        HB
      </text>
    </svg>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("hb_admin_authenticated");
      if (!isAuth) {
        router.replace("/admin/login");
      }
    }
  }, [router]);

  const filters = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  const defaultInitialOrder: OrderRecord = {
    id: "HB-254502-SZE",
    orderRef: "HB-254502-SZE",
    date: "3/28/2026, 6:27:38 PM",
    dateStr: "2026-03-28",
    createdAt: new Date("2026-03-28T18:27:38").getTime(),
    customerName: "ASD SAD",
    customerEmail: "test@gmail.com",
    customerPhone: "01123456789",
    address: "12, JALAN STREETWEAR 3",
    city: "KUALA LUMPUR",
    state: "WEST MALAYSIA",
    postalCode: "50000",
    totalAmount: "99.00 MYR",
    totalNumber: 99.0,
    shipping: "FREE DELIVERY",
    status: "PENDING",
    items: [
      {
        name: "BLACK HOMEBOY LOGO TEE",
        size: "M",
        quantity: 1,
        price: 99.0,
        type: "tee",
        colorHex: "#18181b",
      },
    ],
  };

  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Load live orders from TiDB Cloud
  const fetchLiveOrders = () => {
    fetch("/api/orders", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped: OrderRecord[] = data.map((o: any) => {
            let parsedItems: OrderItem[] = [];
            if (o.items) {
              try {
                parsedItems = typeof o.items === "string" ? JSON.parse(o.items) : o.items;
              } catch {
                parsedItems = [];
              }
            }
            if (parsedItems.length === 0) {
              parsedItems = [
                {
                  name: "HOMEBOY STREETWEAR PIECE",
                  size: "L",
                  quantity: 1,
                  price: Number(o.total_amount) || 99.0,
                  type: "tee",
                  colorHex: "#18181b",
                },
              ];
            }

            const rawDate = o.created_at ? new Date(o.created_at) : new Date();
            const orderEpoch = rawDate.getTime();
            const yyyy = rawDate.getFullYear();
            const mm = String(rawDate.getMonth() + 1).padStart(2, "0");
            const dd = String(rawDate.getDate()).padStart(2, "0");
            const dateStr = `${yyyy}-${mm}-${dd}`;

            return {
              id: o.order_ref || o.id,
              orderRef: o.order_ref || o.id,
              date: new Date(orderEpoch).toLocaleString(),
              dateStr,
              createdAt: orderEpoch,
              customerName: o.customer_name || "Customer",
              customerEmail: o.customer_email || "test@gmail.com",
              customerPhone: o.customer_phone || "01123456789",
              address: o.address || "12, JALAN STREETWEAR 3",
              city: o.city || "KUALA LUMPUR",
              state: o.state || "WEST MALAYSIA",
              postalCode: o.postal_code || "50000",
              totalAmount: `${Number(o.total_amount).toFixed(2)} MYR`,
              totalNumber: Number(o.total_amount) || 99.0,
              shipping: "FREE DELIVERY",
              status: (o.status as any) || "PENDING",
              items: parsedItems,
            };
          });
          setOrders(mapped);
        }
      })
      .catch((err) => console.log("Cached orders:", err));
  };

  useEffect(() => {
    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 4000);
    window.addEventListener("focus", fetchLiveOrders);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", fetchLiveOrders);
    };
  }, []);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Update order status in TiDB Cloud
  const handleUpdateStatus = async (
    orderId: string,
    newStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  ) => {
    // 1. Update UI state immediately
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    setStatusMessage(`STATUS UPDATED TO ${newStatus}`);
    setTimeout(() => setStatusMessage(null), 2500);

    // 2. Persist to TiDB Cloud
    try {
      const target = orders.find((o) => o.id === orderId) || selectedOrder;
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          customerName: target?.customerName,
          customerEmail: target?.customerEmail,
          customerPhone: target?.customerPhone,
          address: target?.address,
          city: target?.city,
          state: target?.state,
          postalCode: target?.postalCode,
          totalAmount: target?.totalNumber || 99.0,
          items: target?.items || [],
        }),
      });
    } catch (err) {
      console.log("Status updated locally:", err);
    }
  };

  // Delete order in TiDB Cloud
  const handleDeleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(null);
    }

    try {
      await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    } catch (err) {
      console.log("Deleted locally:", err);
    }
  };

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.trim().toLowerCase();

    const matchesFilter =
      activeFilter === "ALL" || order.status.toUpperCase() === activeFilter;

    const matchesSearch =
      !q ||
      (order.id && order.id.toLowerCase().includes(q)) ||
      (order.orderRef && order.orderRef.toLowerCase().includes(q)) ||
      (order.customerName && order.customerName.toLowerCase().includes(q)) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(q)) ||
      (order.customerPhone && order.customerPhone.toLowerCase().includes(q)) ||
      (order.address && order.address.toLowerCase().includes(q)) ||
      (order.city && order.city.toLowerCase().includes(q)) ||
      (order.state && order.state.toLowerCase().includes(q)) ||
      (order.totalAmount && order.totalAmount.toLowerCase().includes(q)) ||
      (order.status && order.status.toLowerCase().includes(q)) ||
      (order.items &&
        order.items.some(
          (item) =>
            (item.name && item.name.toLowerCase().includes(q)) ||
            (item.size && item.size.toLowerCase().includes(q))
        ));

    let matchesDate = true;
    const orderDateKey = order.dateStr || "";

    if (fromDate && orderDateKey) {
      if (orderDateKey < fromDate) {
        matchesDate = false;
      }
    }
    if (toDate && orderDateKey) {
      if (orderDateKey > toDate) {
        matchesDate = false;
      }
    }

    return matchesFilter && matchesSearch && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body antialiased selection:bg-black selection:text-white">
      {/* Top Navigation Header */}
      <Header title="ORDERS CENTER" />

      {/* Main Container */}
      <div className="flex flex-1 relative overflow-x-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Workspace */}
        <main className="flex-1 px-8 py-8 md:px-10 md:py-9 space-y-7 max-w-[1440px]">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9.5px] font-bold tracking-[0.24em] text-neutral-400 uppercase">
                ORDER FULFILLMENT
              </p>
              <h1 className="font-display text-[28px] md:text-[32px] font-black italic tracking-[0.06em] text-black uppercase mt-0.5">
                LOGISTICS
              </h1>
            </div>

            {/* Pending Verifications Badge */}
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 pt-2">
                <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse"></span>
                <span className="text-[9.5px] font-black tracking-widest text-[#ea580c] uppercase">
                  {pendingCount} PENDING VERIFICATIONS
                </span>
              </div>
            )}
          </div>

          {/* Search & Filter Toolbar Box */}
          <div className="bg-white border border-[#eaeaea] p-6 space-y-6">
            {/* Top Inputs Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Search Box */}
              <div className="md:col-span-6 relative">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="SEARCH BY ID, NAME, PHONE..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#fafafa] border border-[#ebebeb] text-[10px] font-bold tracking-wider placeholder:text-neutral-400 text-black uppercase focus:outline-none focus:border-black transition-all"
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

              {/* Date From */}
              <div className="md:col-span-2">
                <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                  FROM
                </label>
                <div className="relative flex items-center bg-[#fafafa] border border-[#ebebeb] px-3 py-2">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-transparent text-[10px] font-bold tracking-wider text-black uppercase focus:outline-none cursor-pointer"
                  />
                  {fromDate && (
                    <button
                      type="button"
                      onClick={() => {
                        setFromDate("");
                        setCurrentPage(1);
                      }}
                      className="text-neutral-400 hover:text-black text-xs font-bold ml-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Date To */}
              <div className="md:col-span-2">
                <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                  TO
                </label>
                <div className="relative flex items-center bg-[#fafafa] border border-[#ebebeb] px-3 py-2">
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-transparent text-[10px] font-bold tracking-wider text-black uppercase focus:outline-none cursor-pointer"
                  />
                  {toDate && (
                    <button
                      type="button"
                      onClick={() => {
                        setToDate("");
                        setCurrentPage(1);
                      }}
                      className="text-neutral-400 hover:text-black text-xs font-bold ml-1 cursor-pointer"
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
                    <option value={10}>10 PIECES</option>
                    <option value={25}>25 PIECES</option>
                    <option value={50}>50 PIECES</option>
                    <option value={100}>100 PIECES</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Bottom Filter Buttons Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100">
              <span className="text-[9.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mr-2">
                FILTER:
              </span>
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 text-[9.5px] uppercase transition-all cursor-pointer ${
                    activeFilter === filter
                      ? "bg-black text-white font-black tracking-wider"
                      : "text-neutral-400 hover:text-black font-bold tracking-wider bg-transparent"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table Container */}
          <div className="bg-white border border-[#eaeaea]">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-4 border-b border-[#ededed] text-[9.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase items-center">
              <div className="col-span-3">TRANSACTION ID</div>
              <div className="col-span-2">CUSTOMER DETAILS</div>
              <div className="col-span-2">PARCEL ITEMS</div>
              <div className="col-span-2">NET AMOUNT</div>
              <div className="col-span-2">CURRENT STATUS</div>
              <div className="col-span-1 text-right">ACTION</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#f5f5f5]">
              {paginatedOrders.length === 0 ? (
                <div className="py-12 text-center text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                  NO ORDERS FOUND MATCHING "{searchQuery.toUpperCase()}"
                </div>
              ) : (
                paginatedOrders.map((order) => {
                  const isPending = order.status === "PENDING";
                  const isConfirmed = order.status === "CONFIRMED";
                  const isShipped = order.status === "SHIPPED";
                  const isDelivered = order.status === "DELIVERED";
                  const isCancelled = order.status === "CANCELLED";

                  return (
                    <div
                      key={order.id}
                      className="grid grid-cols-12 px-6 py-5 items-center hover:bg-neutral-50/40 transition-colors"
                    >
                      {/* TRANSACTION ID */}
                      <div className="col-span-3">
                        <div className="text-[11px] font-black tracking-wider text-black uppercase font-display">
                          {order.id}
                        </div>
                        <div className="text-[9px] font-medium text-neutral-400 tracking-tight mt-0.5">
                          {order.date}
                        </div>
                      </div>

                      {/* CUSTOMER DETAILS */}
                      <div className="col-span-2">
                        <div className="text-[11px] font-black tracking-wider text-black uppercase">
                          {order.customerName}
                        </div>
                        <div className="text-[9px] font-bold text-neutral-400 tracking-wider uppercase mt-0.5">
                          {order.state}
                        </div>
                      </div>

                      {/* PARCEL ITEMS */}
                      <div className="col-span-2 flex items-center gap-1.5">
                        <div className="w-10 h-10 bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                          <Shirt className="w-5 h-5 text-black stroke-[1.8]" />
                        </div>
                        <span className="text-[9px] font-bold text-neutral-400 uppercase">
                          [{order.items.length}]
                        </span>
                      </div>

                      {/* NET AMOUNT */}
                      <div className="col-span-2">
                        <div className="text-[11px] font-black tracking-tight text-black uppercase">
                          {order.totalAmount}
                        </div>
                        <div className="text-[8.5px] font-bold tracking-wider text-neutral-400 uppercase mt-0.5">
                          {order.shipping}
                        </div>
                      </div>

                      {/* CURRENT STATUS */}
                      <div className="col-span-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold italic tracking-wider uppercase border ${
                            isPending
                              ? "bg-[#fffaf5] border-[#ffedd5] text-[#ea580c]"
                              : isConfirmed
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : isShipped
                              ? "bg-purple-50 border-purple-200 text-purple-700"
                              : isDelivered
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-red-50 border-red-200 text-red-700"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {order.status}
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="col-span-1 flex items-center justify-end gap-2">
                        {/* WhatsApp button */}
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Contact customer via WhatsApp"
                          className="w-8 h-8 border border-[#e5e5e5] hover:border-black flex items-center justify-center text-neutral-400 hover:text-black transition-all bg-white"
                        >
                          <MessageCircle className="w-3.5 h-3.5 stroke-[1.8]" />
                        </a>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          title="Delete transaction"
                          className="w-8 h-8 border border-[#e5e5e5] hover:border-rose-500 flex items-center justify-center text-neutral-400 hover:text-rose-500 transition-all bg-white cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                        </button>

                        {/* Review Log button */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="border border-black bg-white px-3 py-1.5 text-[9.5px] font-black tracking-wider uppercase text-black hover:bg-black hover:text-white transition-all whitespace-nowrap cursor-pointer shadow-2xs"
                        >
                          REVIEW LOG
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-[#ededed] flex items-center justify-between text-[9.5px] font-bold tracking-[0.2em] uppercase">
              <span className="text-neutral-400">
                SHOWING {filteredOrders.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} TO{" "}
                {Math.min(currentPage * pageSize, filteredOrders.length)} OF {filteredOrders.length} RESULTS
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
          </div>
        </main>

        {/* ========================================================================= */}
        {/* REVIEW LOG SIDE DRAWER (100% Exact Copy of Reference Image 2)              */}
        {/* ========================================================================= */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
            />

            {/* Right Drawer Panel */}
            <div className="relative w-full max-w-[460px] bg-white h-full flex flex-col justify-between shadow-2xl border-l border-neutral-200 z-10 overflow-y-auto animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-[#f0f0f0] flex items-center justify-between sticky top-0 bg-white z-20">
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
                    LOGISTICS / AUDIT TRAIL
                  </span>
                  <h2 className="font-display font-black italic text-lg uppercase tracking-tight text-black mt-0.5">
                    {selectedOrder.id}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    title="Delete order record"
                    className="text-neutral-400 hover:text-red-500 cursor-pointer p-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-neutral-400 hover:text-black cursor-pointer p-1.5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6">
                {/* 1. BANK PAYMENT VERIFICATION CARD */}
                <div className="bg-[#fffaf5] border border-[#fed7aa] p-5 space-y-4">
                  <div className="flex items-center gap-2 text-[#ea580c]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="text-[9px] font-black tracking-widest uppercase">
                      BANK PAYMENT VERIFICATION
                    </span>
                  </div>

                  {/* Receipt Image / Proof Preview Box */}
                  <div className="bg-white border border-[#fbd38d] p-3 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-full aspect-[4/3] bg-neutral-100 border border-neutral-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                      {/* Realistic Receipt Mockup Graphic */}
                      <div className="w-4/5 bg-white border border-neutral-300 p-3 shadow-xs space-y-1 text-left font-mono text-[8px] text-neutral-600">
                        <div className="font-bold text-black border-b border-neutral-200 pb-1 text-[9px]">
                          INSTANT FPX TRANSFER
                        </div>
                        <div>REF: {selectedOrder.id}</div>
                        <div>PAYEE: HOMEBOY CO.</div>
                        <div className="font-bold text-black">AMOUNT: {selectedOrder.totalAmount}</div>
                        <div className="text-emerald-600 font-bold">STATUS: SUCCESSFUL</div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "CONFIRMED")}
                      className="flex-1 bg-[#16a34a] hover:bg-emerald-700 text-white py-2.5 text-[9.5px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>CONFIRM PAYMENT</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "CANCELLED")}
                      className="px-4 py-2.5 border border-neutral-300 bg-white text-neutral-600 hover:text-red-600 hover:border-red-400 text-[9.5px] font-black tracking-wider uppercase transition-all cursor-pointer"
                    >
                      REJECT
                    </button>
                  </div>
                </div>

                {/* 2. STATUS LIFECYCLE */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold tracking-[0.22em] text-[#8e8e93] uppercase">
                      STATUS LIFECYCLE
                    </span>
                    <span className="text-[8.5px] font-bold tracking-[0.22em] text-[#8e8e93] uppercase">
                      UPDATE
                    </span>
                  </div>

                  {/* Step Buttons */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map(
                      (st) => {
                        const isActive = selectedOrder.status === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                            className={`py-2.5 px-1 text-[8.5px] font-black uppercase tracking-wider transition-all border cursor-pointer text-center ${
                              isActive
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-white text-[#94a3b8] border-[#e2e8f0] hover:text-black hover:border-black"
                            }`}
                          >
                            {st}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {statusMessage && (
                    <div className="text-[8.5px] font-bold tracking-widest text-[#16a34a] uppercase text-center pt-1 animate-in fade-in">
                      ✓ {statusMessage}
                    </div>
                  )}
                </div>

                {/* 3. CUSTOMER DOSSIER & DROP POINT */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                  {/* Customer Dossier */}
                  <div className="space-y-3">
                    <span className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                      CUSTOMER DOSSIER
                    </span>

                    <div>
                      <div className="text-[8px] font-bold text-neutral-400 uppercase">FULL NAME</div>
                      <div className="text-[11px] font-black text-black uppercase mt-0.5">
                        {selectedOrder.customerName}
                      </div>
                    </div>

                    <div>
                      <div className="text-[8px] font-bold text-neutral-400 uppercase">PHONE (WA/TEL)</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-black text-black">
                          {selectedOrder.customerPhone}
                        </span>
                        <a
                          href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-1.5 py-0.5 bg-[#25D366] text-white text-[7.5px] font-black uppercase tracking-wider rounded-2xs flex items-center gap-0.5 hover:opacity-90"
                        >
                          <MessageCircle className="w-2.5 h-2.5" />
                          <span>WA</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <div className="text-[8px] font-bold text-neutral-400 uppercase">EMAIL ID & SYNC</div>
                      <div className="text-[9.5px] font-mono font-bold text-black lowercase mt-0.5 truncate">
                        {selectedOrder.customerEmail}
                      </div>
                    </div>
                  </div>

                  {/* Drop Point */}
                  <div className="space-y-3">
                    <span className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                      DROP POINT
                    </span>

                    <div>
                      <div className="text-[8px] font-bold text-neutral-400 uppercase">DELIVERY ADDRESS</div>
                      <div className="text-[10px] font-bold text-neutral-800 uppercase mt-0.5 leading-snug">
                        {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state}{" "}
                        {selectedOrder.postalCode}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleCopyAddress(
                          `${selectedOrder.address}, ${selectedOrder.city}, ${selectedOrder.state} ${selectedOrder.postalCode}`
                        )
                      }
                      className="w-full py-1.5 border border-neutral-200 bg-[#fafafa] hover:border-black text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? "COPIED TO CLIPBOARD" : "COPY ADDRESS"}</span>
                    </button>
                  </div>
                </div>

                {/* 4. ITEM MANIFEST */}
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <span className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                    ITEM MANIFEST ({selectedOrder.items.length})
                  </span>

                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#fafafa] border border-neutral-200 p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white border border-neutral-200 flex items-center justify-center p-1 shrink-0">
                            <ItemThumb type={item.type} colorHex={item.colorHex} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase text-black">
                              {item.name}
                            </div>
                            <div className="text-[8.5px] font-bold text-neutral-400 uppercase mt-0.5">
                              SIZE: <span className="text-black font-black">{item.size}</span> • QTY:{" "}
                              <span className="text-black font-black">{item.quantity}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-display font-black text-xs text-black">
                          {(item.price * item.quantity).toFixed(2)} MYR
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. FINANCIAL AUDIT BREAKDOWN */}
                <div className="space-y-2 pt-4 border-t border-neutral-100 text-[10px]">
                  <div className="flex justify-between text-neutral-400 font-bold uppercase">
                    <span>SUBTOTAL</span>
                    <span className="text-black">{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 font-bold uppercase">
                    <span>LOGISTICS ({selectedOrder.state})</span>
                    <span className="text-emerald-600 font-black">FREE</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-neutral-300">
                    <span className="font-body font-black uppercase text-xs tracking-wider">
                      TOTAL
                    </span>
                    <span className="font-display font-black text-xl text-black">
                      {selectedOrder.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
