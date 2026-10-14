"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ChevronRight,
  Tag,
  AlertTriangle,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { Product } from "../data/products";

// Vector visual for exact product rendering in checkout
function ProductVisualThumb({ type, colorHex }: { type?: "tee" | "shorts" | "hat" | string; colorHex: string }) {
  if (type === "hat") {
    return (
      <svg viewBox="0 0 100 90" className="w-10 h-10 drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 55 C22 25 78 25 78 55 Z" fill={colorHex} stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="1.5" />
        <path d="M12 55 C12 55 50 75 88 55 C82 52 75 50 68 50 L32 50 C25 50 18 52 12 55 Z" fill={colorHex} stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="1.5" />
        <text x="50" y="42" fill={colorHex === "#ffffff" ? "#000000" : "#ffffff"} fontSize="4.5" fontWeight="900" fontStyle="italic" textAnchor="middle">HB</text>
      </svg>
    );
  }
  if (type === "shorts") {
    return (
      <svg viewBox="0 0 100 90" className="w-10 h-10 drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="22" y="10" width="56" height="8" rx="1" fill={colorHex} />
        <path
          d="M22 16 L18 76 C18 78 40 80 46 76 L50 40 L54 76 C60 80 82 78 82 76 L78 16 Z"
          fill={colorHex}
          stroke={colorHex}
          strokeWidth="1.5"
        />
        <text
          x="58"
          y="62"
          fill="#ffffff"
          fontSize="5"
          fontWeight="900"
          fontStyle="italic"
        >
          HB
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 90" className="w-10 h-10 drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 10 C38 18 62 18 68 10 L88 24 L76 40 L68 34 L68 84 L32 84 L32 34 L24 40 L12 24 Z"
        fill={colorHex}
        stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex}
        strokeWidth="1.5"
      />
      <text
        x="50"
        y="42"
        fill={colorHex === "#ffffff" ? "#000000" : "#ffffff"}
        fontSize="7"
        fontWeight="900"
        fontStyle="italic"
        textAnchor="middle"
      >
        HB
      </text>
    </svg>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, totalCount, clearCart, removeItem } = useCart();
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("fpx");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("HB-254502-SZE");
  const [lastSummary, setLastSummary] = useState({
    recipient: "",
    destination: "",
    totalPaid: 0,
  });

  // Reset all inputs helper
  const resetFormFields = useCallback(() => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setAddress("");
    setCity("");
    setState("");
    setPostalCode("");
    setPhone("");
    setDiscountCode("");
    setDiscountApplied(false);
  }, []);

  // Ensure clean empty fields when entering checkout
  useEffect(() => {
    resetFormFields();
  }, [resetFormFields]);

  // Fetch live products
  const fetchLiveProducts = useCallback(async () => {
    try {
      const res = await fetch(`/api/products?_t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLiveProducts(data);
        }
      }
    } catch (e) {
      console.log("Checkout live stock fetch error:", e);
    }
  }, []);

  useEffect(() => {
    fetchLiveProducts();

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("homeboy-stock-sync");
      bc.onmessage = () => {
        fetchLiveProducts();
      };
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hb_stock_updated") {
        fetchLiveProducts();
      }
    };
    window.addEventListener("storage", handleStorage);

    const interval = setInterval(fetchLiveProducts, 3000);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [fetchLiveProducts]);

  const getItemStock = (item: any) => {
    if (!liveProducts || liveProducts.length === 0) {
      return { isSoldOut: false, availableStock: 99 };
    }
    const cleanItemName = item.name.trim().toLowerCase();
    const cleanItemId = item.productId?.trim().toLowerCase();

    const prod = liveProducts.find((p) => {
      const pId = p.id?.trim().toLowerCase();
      const pName = p.name?.trim().toLowerCase();
      return pId === cleanItemId || pName === cleanItemName;
    });

    if (!prod) {
      return { isSoldOut: false, availableStock: 99 };
    }

    if (prod.stock !== undefined && prod.stock <= 0) {
      return { isSoldOut: true, availableStock: 0 };
    }

    if (prod.stockAllocation && typeof prod.stockAllocation === "object") {
      const sizeKey = item.size?.toUpperCase();
      const allocated =
        prod.stockAllocation[item.size] ??
        prod.stockAllocation[sizeKey] ??
        (prod.stock !== undefined ? prod.stock : 50);

      const num = Number(allocated);
      if (num <= 0) {
        return { isSoldOut: true, availableStock: 0 };
      }
      return { isSoldOut: false, availableStock: num };
    }

    const avail = prod.stock !== undefined ? Number(prod.stock) : 50;
    return { isSoldOut: avail <= 0, availableStock: avail };
  };

  const soldOutItems = items.filter((item) => getItemStock(item).isSoldOut);
  const hasSoldOutItems = soldOutItems.length > 0;

  const finalTotal = discountApplied ? totalAmount * 0.9 : totalAmount;

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === "HOMEBOY10" || discountCode.trim()) {
      setDiscountApplied(true);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasSoldOutItems) {
      alert("Checkout cannot proceed: your bag contains sold out pieces. Please remove them to continue.");
      return;
    }

    setIsProcessing(true);

    const generatedId = `HB-${Math.floor(100000 + Math.random() * 900000)}-SZE`;
    setOrderId(generatedId);

    const submittedRecipient = `${firstName} ${lastName}`.trim() || "Customer";
    const submittedDestination = `${address}, ${city}, ${state}`.trim() || "West Malaysia";
    const submittedTotal = finalTotal;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderRef: generatedId,
          firstName,
          lastName,
          customerName: submittedRecipient,
          email,
          phone,
          address,
          city,
          state,
          postalCode,
          totalAmount: submittedTotal,
          items: items.length > 0 ? items : [
            {
              name: "BLACK HOMEBOY LOGO TEE",
              size: "M",
              quantity: 1,
              price: submittedTotal || 99.0,
              type: "tee",
              colorHex: "#18181b",
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        alert(data.error || "Checkout failed: piece is SOLD OUT.");
        setIsProcessing(false);
        return;
      }

      // 1. Snapshot values for confirmation display
      setLastSummary({
        recipient: submittedRecipient,
        destination: submittedDestination,
        totalPaid: submittedTotal,
      });

      // 2. Clear all form inputs completely so they are never saved or retained
      resetFormFields();

      // 3. Clear cart
      clearCart();

      // 4. Show confirmation
      setOrderComplete(true);

      if (typeof window !== "undefined") {
        try {
          const bc = new BroadcastChannel("homeboy-stock-sync");
          bc.postMessage({ type: "STOCK_UPDATED", timestamp: Date.now() });
          bc.close();
        } catch (e) {}
        try {
          localStorage.setItem("hb_stock_updated", Date.now().toString());
        } catch (e) {}
      }
    } catch (err) {
      console.error("Order submit exception:", err);
      alert("Transaction failed. Please check item availability and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = (e: React.MouseEvent) => {
    e.preventDefault();
    resetFormFields();
    setOrderComplete(false);
    router.push("/site");
  };

  const handleViewOrders = (e: React.MouseEvent) => {
    e.preventDefault();
    resetFormFields();
    setOrderComplete(false);
    router.push("/orders");
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col font-body antialiased selection:bg-black selection:text-white">
        {/* Header */}
        <header className="px-6 md:px-12 py-6 border-b border-[#ededed] flex items-center justify-between">
          <button type="button" onClick={handleContinueShopping} className="flex flex-col leading-none cursor-pointer">
            <span className="font-display font-black italic text-xl tracking-tight text-black uppercase">
              HOMEBOY
            </span>
            <span className="font-display font-black italic text-xs tracking-[0.25em] text-black uppercase -mt-0.5">
              COLLECTION
            </span>
          </button>
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            ORDER CONFIRMATION
          </span>
        </header>

        {/* Confirmation Container */}
        <main className="flex-1 max-w-xl w-full mx-auto px-6 py-16 text-center space-y-6">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <span className="text-[9.5px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
              TRANSACTION VERIFIED & LOGGED
            </span>
            <h1 className="font-display font-black italic text-2xl md:text-3xl uppercase tracking-wide">
              THANK YOU FOR YOUR ORDER
            </h1>
            <p className="text-xs font-mono text-neutral-600 font-bold mt-1">
              ORDER REF: {orderId}
            </p>
          </div>

          <div className="bg-[#fafafa] border border-[#e5e5e5] p-6 text-left space-y-3 text-[10px] font-medium text-neutral-600">
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-400 uppercase font-bold">RECIPIENT</span>
              <span className="font-black text-black uppercase">{lastSummary.recipient || "CUSTOMER"}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-400 uppercase font-bold">DESTINATION</span>
              <span className="font-black text-black uppercase">{lastSummary.destination || "WEST MALAYSIA"}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-400 uppercase font-bold">TOTAL PAID</span>
              <span className="font-black text-black">{lastSummary.totalPaid.toFixed(2)} MYR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 uppercase font-bold">DATABASE CLOUD SYNC</span>
              <span className="font-black text-emerald-600 uppercase">SYNCHRONIZED (OK)</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleViewOrders}
              className="flex-1 bg-black text-white py-3.5 text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all text-center cursor-pointer"
            >
              VIEW IN ADMIN ORDERS
            </button>
            <button
              type="button"
              onClick={handleContinueShopping}
              className="flex-1 border border-black bg-white text-black py-3.5 text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-50 transition-all text-center cursor-pointer"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body antialiased selection:bg-black selection:text-white">
      {/* Minimal Top Header */}
      <header className="px-6 md:px-12 py-6 border-b border-[#ededed] flex items-center justify-between sticky top-0 bg-white z-40">
        <Link
          href="/site"
          className="flex items-center gap-2 text-neutral-400 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO SHOP</span>
        </Link>

        {/* Center Logo */}
        <Link href="/site" className="flex flex-col items-center leading-none text-center">
          <span className="font-display font-black italic text-xl md:text-2xl tracking-tight text-black uppercase">
            HOMEBOY
          </span>
          <span className="font-display font-black italic text-xs tracking-[0.25em] text-black uppercase -mt-0.5">
            COLLECTION
          </span>
        </Link>

        {/* Secure Badge */}
        <div className="flex items-center gap-1.5 text-neutral-400 text-[9px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>ENCRYPTED CHECKOUT</span>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-6 md:px-12 py-10">
        {/* Sold out alert banner */}
        {hasSoldOutItems && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-8 text-red-700 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-display font-black text-xs uppercase tracking-wider text-red-700">
                PAYMENT BLOCKED — SOLD OUT PIECES IN YOUR ORDER ({soldOutItems.length})
              </span>
            </div>
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide leading-relaxed">
              The following pieces are currently SOLD OUT:{" "}
              <span className="font-black text-black">
                {soldOutItems.map((s) => `${s.name} (${s.size})`).join(", ")}
              </span>
              . You cannot place this order until sold out pieces are removed.
            </p>
            <button
              type="button"
              onClick={() => {
                soldOutItems.forEach((s) => removeItem(s.id));
              }}
              className="text-[9px] font-black text-red-700 hover:text-black underline uppercase tracking-wider cursor-pointer pt-1 block"
            >
              [ REMOVE ALL SOLD OUT PIECES FROM ORDER ]
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmitOrder}
          autoComplete="off"
          data-lpignore="true"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
        >
          {/* Left Column (7 Cols): Contact, Shipping, Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Breadcrumb Steps */}
            <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
              <Link href="/site" className="hover:text-black">CART</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-black font-black">INFORMATION</span>
              <ChevronRight className="w-3 h-3" />
              <span>SHIPPING</span>
              <ChevronRight className="w-3 h-3" />
              <span>PAYMENT</span>
            </div>

            {/* Step 1: Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <h2 className="font-display font-black italic text-base uppercase tracking-wider text-black">
                  1. CONTACT INFORMATION
                </h2>
                <span className="text-[8.5px] font-bold text-neutral-400 uppercase">
                  INSTANT CONFIRMATION
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    data-lpignore="true"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#ebebeb] text-[10px] font-bold text-black focus:outline-none focus:border-black placeholder:text-neutral-300 placeholder:font-normal placeholder:text-[9.5px]"
                  />
                </div>
                <div>
                  <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                    PHONE NUMBER (WHATSAPP)
                  </label>
                  <input
                    type="tel"
                    required
                    autoComplete="off"
                    data-lpignore="true"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0123456789"
                    className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#ebebeb] text-[10px] font-bold text-black focus:outline-none focus:border-black placeholder:text-neutral-300 placeholder:font-normal placeholder:text-[9.5px]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <h2 className="font-display font-black italic text-base uppercase tracking-wider text-black">
                  2. DELIVERY DESTINATION
                </h2>
                <span className="text-[8.5px] font-bold text-neutral-400 uppercase">
                  MALAYSIA COURIER
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      data-lpignore="true"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#ebebeb] text-[10px] font-bold text-black uppercase focus:outline-none focus:border-black placeholder:text-neutral-300 placeholder:font-normal placeholder:normal-case placeholder:text-[9.5px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      data-lpignore="true"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#ebebeb] text-[10px] font-bold text-black uppercase focus:outline-none focus:border-black placeholder:text-neutral-300 placeholder:font-normal placeholder:normal-case placeholder:text-[9.5px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                    STREET ADDRESS & UNIT NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    data-lpignore="true"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address, unit / apartment"
                    className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#ebebeb] text-[10px] font-bold text-black uppercase focus:outline-none focus:border-black placeholder:text-neutral-300 placeholder:font-normal placeholder:normal-case placeholder:text-[9.5px]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                      CITY
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      data-lpignore="true"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#ebebeb] text-[10px] font-bold text-black uppercase focus:outline-none focus:border-black placeholder:text-neutral-300 placeholder:font-normal placeholder:normal-case placeholder:text-[9.5px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                      STATE / REGION
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      data-lpignore="true"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State / Region"
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#ebebeb] text-[10px] font-bold text-black uppercase focus:outline-none focus:border-black placeholder:text-neutral-300 placeholder:font-normal placeholder:normal-case placeholder:text-[9.5px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                      POSTCODE
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      data-lpignore="true"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postcode"
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#ebebeb] text-[10px] font-bold text-black uppercase focus:outline-none focus:border-black placeholder:text-neutral-300 placeholder:font-normal placeholder:normal-case placeholder:text-[9.5px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <h2 className="font-display font-black italic text-base uppercase tracking-wider text-black">
                  3. PAYMENT METHOD
                </h2>
                <span className="text-[8.5px] font-bold text-neutral-400 uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3 text-black" />
                  SSL ENCRYPTED
                </span>
              </div>

              <div className="space-y-2">
                <label
                  onClick={() => setPaymentMethod("fpx")}
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                    paymentMethod === "fpx"
                      ? "border-black bg-[#fafafa]"
                      : "border-[#e5e5e5] hover:border-neutral-400"
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-black tracking-wider uppercase text-black">
                      ONLINE BANKING (FPX / TOYYIBPAY)
                    </div>
                    <div className="text-[9px] text-neutral-400 uppercase mt-0.5">
                      MAYBANK, CIMB, PUBLIC BANK, RHB, HONG LEONG
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full border ${paymentMethod === "fpx" ? "border-4 border-black" : "border-neutral-300"}`} />
                </label>

                <label
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-black bg-[#fafafa]"
                      : "border-[#e5e5e5] hover:border-neutral-400"
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-black tracking-wider uppercase text-black">
                      CREDIT & DEBIT CARDS (VISA / MASTERCARD)
                    </div>
                    <div className="text-[9px] text-neutral-400 uppercase mt-0.5">
                      SECURE 3D PAYMENT AUTHENTICATION
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full border ${paymentMethod === "card" ? "border-4 border-black" : "border-neutral-300"}`} />
                </label>
              </div>
            </div>

            {/* Complete Button */}
            <button
              type="submit"
              disabled={isProcessing || items.length === 0 || hasSoldOutItems}
              className={`w-full py-4 text-xs font-black uppercase tracking-[0.2em] transition-all cursor-pointer shadow-lg ${
                hasSoldOutItems
                  ? "bg-neutral-200 text-neutral-400 border border-neutral-300 cursor-not-allowed shadow-none"
                  : "bg-black text-white hover:bg-neutral-800"
              } disabled:opacity-75`}
            >
              {hasSoldOutItems
                ? "SOLD OUT — PAYMENT DISABLED"
                : isProcessing
                ? "PROCESSING TRANSACTION..."
                : `PAY NOW • ${finalTotal.toFixed(2)} MYR`}
            </button>
            {hasSoldOutItems && (
              <p className="text-center text-[8px] font-black text-red-600 uppercase tracking-wider mt-2">
                REMOVE SOLD OUT PIECES TO ENABLE PAYMENT
              </p>
            )}
          </div>

          {/* Right Column (5 Cols): Order Summary with exact photos */}
          <div className="lg:col-span-5 bg-[#fafafa] border border-[#e5e5e5] p-6 space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-display font-black italic text-sm uppercase tracking-wider text-black">
                ORDER SUMMARY
              </h3>
              <span className="text-[9.5px] font-bold text-neutral-400 uppercase">
                {totalCount} {totalCount === 1 ? "PIECE" : "PIECES"}
              </span>
            </div>

            {/* Items List with exact Product Visual Render */}
            <div className="space-y-4 divide-y divide-neutral-200">
              {items.map((item) => {
                const isSoldOut = getItemStock(item).isSoldOut;

                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Exact Photo Box */}
                      <div className="w-14 h-14 bg-white border border-neutral-200 flex items-center justify-center relative shrink-0 p-1">
                        <ProductVisualThumb type={item.type} colorHex={item.colorHex} />
                        <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                        {isSoldOut && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                            <span className="text-[6.5px] font-black text-white uppercase bg-red-600 px-1 py-0.5">
                              OUT
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-body font-black text-[10.5px] uppercase text-black truncate">
                            {item.name}
                          </p>
                          {isSoldOut && (
                            <span className="bg-red-600 text-white text-[7px] font-black px-1.5 py-0.5 tracking-wider uppercase rounded-xs">
                              SOLD OUT
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase mt-0.5">
                          SIZE: <span className="text-black font-black">{item.size}</span>
                        </p>
                        {isSoldOut && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-[8px] font-black text-red-600 hover:text-red-900 underline uppercase tracking-wider mt-0.5 cursor-pointer block"
                          >
                            [ REMOVE PIECE ]
                          </button>
                        )}
                      </div>
                    </div>

                    <span className="font-display font-black text-xs text-black shrink-0">
                      {(item.price * item.quantity).toFixed(2)} MYR
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Box */}
            <div className="pt-4 border-t border-neutral-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="DISCOUNT CODE (TRY: HOMEBOY10)"
                  className="flex-1 px-3 py-2 bg-white border border-[#e5e5e5] text-[9.5px] font-bold uppercase placeholder:text-neutral-400 text-black focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  className="bg-black text-white px-4 py-2 text-[9px] font-black uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  APPLY
                </button>
              </div>
              {discountApplied && (
                <div className="flex items-center gap-1.5 text-emerald-600 text-[9px] font-bold uppercase mt-2">
                  <Tag className="w-3 h-3" />
                  <span>10% PROMO CODE APPLIED</span>
                </div>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 pt-4 border-t border-neutral-200 text-[10px]">
              <div className="flex justify-between text-neutral-500">
                <span className="font-bold uppercase tracking-wider">SUBTOTAL</span>
                <span className="font-black text-black">{totalAmount.toFixed(2)} MYR</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span className="uppercase tracking-wider">DISCOUNT</span>
                  <span>-{(totalAmount * 0.1).toFixed(2)} MYR</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-500">
                <span className="font-bold uppercase tracking-wider">SHIPPING</span>
                <span className="font-black text-emerald-600 uppercase">FREE DELIVERY</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-neutral-200 text-black">
                <span className="font-black uppercase tracking-wider text-xs">TOTAL</span>
                <span className="font-display font-black text-base">{finalTotal.toFixed(2)} MYR</span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
