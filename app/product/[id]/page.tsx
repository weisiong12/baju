"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Minus,
  Plus,
} from "lucide-react";
import { PRODUCTS_DATABASE, Product } from "../../site/data/products";
import { useCart } from "../../site/context/CartContext";
import StoreHeader from "../../site/components/StoreHeader";

// Realistic Streetwear Vector Graphic Component with 3D Front & Back Flip
function StreetwearVisual({
  type,
  color,
}: {
  type?: "tee" | "shorts" | "hat" | string;
  color?: string;
}) {
  const safeColor = color || "#18181b";
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
      {/* Top Switcher Tabs: 01 / FRONT & 02 / BACK */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-1.5 bg-white border border-neutral-200 p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setIsFlipped(false)}
            className={`px-3 py-1 text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              !isFlipped
                ? "bg-black text-white shadow-xs"
                : "text-neutral-400 hover:text-black"
            }`}
          >
            01 / FRONT
          </button>
          <button
            type="button"
            onClick={() => setIsFlipped(true)}
            className={`px-3 py-1 text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              isFlipped
                ? "bg-black text-white shadow-xs"
                : "text-neutral-400 hover:text-black"
            }`}
          >
            02 / BACK
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsFlipped((prev) => !prev)}
          className="bg-white border border-neutral-200 hover:border-black text-black px-2.5 py-1 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xs hover:bg-black hover:text-white transition-all cursor-pointer"
        >
          <span>↻</span>
          <span>FLIP 3D</span>
        </button>
      </div>

      {/* Main 3D Flip Canvas */}
      <div
        onClick={() => setIsFlipped((prev) => !prev)}
        className="w-full h-full flex items-center justify-center relative perspective-1000 cursor-pointer group"
      >
        {/* Ambient Color Glow Reflection */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl pointer-events-none rounded-full"
          style={{ backgroundColor: safeColor }}
        />

        {/* Diagonal Light Gleam Sweep on Hover & Click */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-25deg] pointer-events-none z-10" />

        {/* 3D Inner Container */}
        <div
          className="w-full h-full flex items-center justify-center preserve-3d transition-transform duration-700 ease-out"
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ========================================================================= */}
          {/* FRONT VIEW (01 / FRONT)                                                   */}
          {/* ========================================================================= */}
          <div className="absolute inset-0 flex items-center justify-center backface-hidden">
            {type === "hat" ? (
              <svg
                viewBox="0 0 160 140"
                className="w-4/5 h-4/5 drop-shadow-xl group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M35 85 C35 38 125 38 125 85 Z"
                  fill={safeColor}
                  stroke={safeColor === "#ffffff" ? "#d4d4d8" : safeColor}
                  strokeWidth="2"
                />
                <path
                  d="M20 85 C20 85 80 115 140 85 C132 80 120 78 110 78 L50 78 C40 78 28 80 20 85 Z"
                  fill={safeColor}
                  stroke={safeColor === "#ffffff" ? "#d4d4d8" : safeColor}
                  strokeWidth="2"
                />
                <rect
                  x="52"
                  y="52"
                  width="56"
                  height="20"
                  rx="2"
                  fill="rgba(0,0,0,0.15)"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                />
                <text
                  x="80"
                  y="65"
                  fill={safeColor === "#ffffff" ? "#000000" : "#ffffff"}
                  fontSize="7"
                  fontWeight="900"
                  fontStyle="italic"
                  textAnchor="middle"
                  letterSpacing="0.06em"
                >
                  HOMEBOY
                </text>
                <text
                  x="80"
                  y="71"
                  fill={safeColor === "#ffffff" ? "#52525b" : "rgba(255,255,255,0.7)"}
                  fontSize="4"
                  fontWeight="800"
                  textAnchor="middle"
                  letterSpacing="0.1em"
                >
                  CAP CO.
                </text>
              </svg>
            ) : type === "shorts" ? (
              <svg
                viewBox="0 0 160 140"
                className="w-4/5 h-4/5 drop-shadow-xl group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="36"
                  y="18"
                  width="88"
                  height="12"
                  rx="2"
                  fill={safeColor}
                  stroke={safeColor}
                  strokeWidth="2"
                />
                <path
                  d="M74 24 Q72 38 68 46 M86 24 Q88 38 92 46"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M36 28 L30 115 C30 118 64 122 74 116 L80 65 L86 116 C96 122 130 118 130 115 L124 28 Z"
                  fill={safeColor}
                  stroke={safeColor}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M38 45 L122 45 M36 65 L124 65 M34 85 L126 85 M32 105 L128 105"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <g transform="translate(86, 90) rotate(-6)">
                  <text
                    x="0"
                    y="0"
                    fill="#ffffff"
                    fontSize="8.5"
                    fontWeight="900"
                    fontStyle="italic"
                    letterSpacing="-0.02em"
                  >
                    HOMEBOY
                  </text>
                  <text
                    x="2"
                    y="9"
                    fill="#ffffff"
                    fontSize="7"
                    fontWeight="900"
                    fontStyle="italic"
                    letterSpacing="0.04em"
                  >
                    COLLECTION
                  </text>
                </g>
              </svg>
            ) : (
              <svg
                viewBox="0 0 160 140"
                className="w-4/5 h-4/5 drop-shadow-xl group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 16 C60 28 100 28 110 16 L145 38 L126 64 L112 55 L112 130 L48 130 L48 55 L34 64 L15 38 Z"
                  fill={safeColor}
                  stroke={safeColor === "#ffffff" ? "#d4d4d8" : safeColor}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M50 16 C60 28 100 28 110 16 C100 22 60 22 50 16 Z"
                  fill={safeColor === "#ffffff" ? "#f4f4f5" : "rgba(0,0,0,0.2)"}
                  stroke={safeColor === "#ffffff" ? "#a1a1aa" : "rgba(255,255,255,0.25)"}
                  strokeWidth="1.5"
                />
                <text
                  x="80"
                  y="68"
                  fill={safeColor === "#ffffff" ? "#000000" : "#ffffff"}
                  fontSize="10"
                  fontWeight="900"
                  fontStyle="italic"
                  textAnchor="middle"
                  letterSpacing="0.06em"
                >
                  HOMEBOY
                </text>
              </svg>
            )}
          </div>

          {/* ========================================================================= */}
          {/* BACK VIEW (02 / BACK) - Oversized Streetwear Graphic Artwork              */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 flex items-center justify-center backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            {type === "hat" ? (
              <svg
                viewBox="0 0 160 140"
                className="w-4/5 h-4/5 drop-shadow-xl group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M35 85 C35 38 125 38 125 85 Z"
                  fill={safeColor}
                  stroke={safeColor === "#ffffff" ? "#d4d4d8" : safeColor}
                  strokeWidth="2"
                />
                <path
                  d="M60 85 C60 65 100 65 100 85 Z"
                  fill="#fafafa"
                  stroke={safeColor === "#ffffff" ? "#d4d4d8" : safeColor}
                  strokeWidth="2"
                />
                <rect
                  x="52"
                  y="78"
                  width="56"
                  height="7"
                  rx="1.5"
                  fill="#18181b"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="0.8"
                />
                <rect
                  x="74"
                  y="76"
                  width="12"
                  height="11"
                  rx="1"
                  fill="#d4af37"
                  stroke="#000000"
                  strokeWidth="1"
                />
                <text
                  x="80"
                  y="52"
                  fill={safeColor === "#ffffff" ? "#000000" : "#ffffff"}
                  fontSize="6"
                  fontWeight="900"
                  fontStyle="italic"
                  textAnchor="middle"
                >
                  HB ARCHIVE
                </text>
              </svg>
            ) : type === "shorts" ? (
              <svg
                viewBox="0 0 160 140"
                className="w-4/5 h-4/5 drop-shadow-xl group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="36"
                  y="18"
                  width="88"
                  height="12"
                  rx="2"
                  fill={safeColor}
                  stroke={safeColor}
                  strokeWidth="2"
                />
                <rect
                  x="88"
                  y="20"
                  width="24"
                  height="8"
                  rx="1"
                  fill="#000000"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="0.8"
                />
                <text
                  x="100"
                  y="26"
                  fill="#ffffff"
                  fontSize="4"
                  fontWeight="900"
                  textAnchor="middle"
                >
                  HB CO.
                </text>
                <path
                  d="M36 28 L30 115 C30 118 64 122 74 116 L80 65 L86 116 C96 122 130 118 130 115 L124 28 Z"
                  fill={safeColor}
                  stroke={safeColor}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <rect
                  x="86"
                  y="45"
                  width="30"
                  height="32"
                  rx="2"
                  fill="rgba(0,0,0,0.12)"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1.2"
                />
                <text
                  x="101"
                  y="63"
                  fill="#ffffff"
                  fontSize="5"
                  fontWeight="900"
                  textAnchor="middle"
                  opacity="0.8"
                >
                  BACK POCKET
                </text>
              </svg>
            ) : (
              <svg
                viewBox="0 0 160 140"
                className="w-4/5 h-4/5 drop-shadow-xl group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Main T-Shirt Body */}
                <path
                  d="M50 16 C60 28 100 28 110 16 L145 38 L126 64 L112 55 L112 130 L48 130 L48 55 L34 64 L15 38 Z"
                  fill={safeColor}
                  stroke={safeColor === "#ffffff" ? "#d4d4d8" : safeColor}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Back Neck Line */}
                <path
                  d="M50 16 C65 19 95 19 110 16"
                  stroke={safeColor === "#ffffff" ? "#a1a1aa" : "rgba(255,255,255,0.3)"}
                  strokeWidth="2"
                />
                {/* Big Oversized Streetwear Back Graphic Print */}
                <rect
                  x="56"
                  y="36"
                  width="48"
                  height="62"
                  fill="none"
                  stroke={safeColor === "#ffffff" ? "#18181b" : "#ffffff"}
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                  opacity="0.85"
                />
                <text
                  x="80"
                  y="52"
                  fill={safeColor === "#ffffff" ? "#000000" : "#ffffff"}
                  fontSize="8.5"
                  fontWeight="900"
                  fontStyle="italic"
                  textAnchor="middle"
                  letterSpacing="0.08em"
                >
                  HOMEBOY
                </text>
                <text
                  x="80"
                  y="62"
                  fill={safeColor === "#ffffff" ? "#71717a" : "rgba(255,255,255,0.7)"}
                  fontSize="4.5"
                  fontWeight="800"
                  textAnchor="middle"
                  letterSpacing="0.15em"
                >
                  ARCHIVE 2026
                </text>
                <line
                  x1="62"
                  y1="72"
                  x2="98"
                  y2="72"
                  stroke={safeColor === "#ffffff" ? "#18181b" : "#ffffff"}
                  strokeWidth="0.8"
                  opacity="0.6"
                />
                <g transform="translate(64, 78)">
                  <rect x="0" y="0" width="2" height="12" fill={safeColor === "#ffffff" ? "#000" : "#fff"} />
                  <rect x="4" y="0" width="1" height="12" fill={safeColor === "#ffffff" ? "#000" : "#fff"} />
                  <rect x="7" y="0" width="3" height="12" fill={safeColor === "#ffffff" ? "#000" : "#fff"} />
                  <rect x="12" y="0" width="1.5" height="12" fill={safeColor === "#ffffff" ? "#000" : "#fff"} />
                  <rect x="15" y="0" width="2.5" height="12" fill={safeColor === "#ffffff" ? "#000" : "#fff"} />
                  <rect x="20" y="0" width="1" height="12" fill={safeColor === "#ffffff" ? "#000" : "#fff"} />
                  <rect x="23" y="0" width="3" height="12" fill={safeColor === "#ffffff" ? "#000" : "#fff"} />
                  <rect x="28" y="0" width="1" height="12" fill={safeColor === "#ffffff" ? "#000" : "#fff"} />
                  <rect x="30" y="0" width="2" height="12" fill={safeColor === "#ffffff" ? "#000" : "#fff"} />
                </g>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Helper text under canvas */}
      <div className="absolute bottom-3 text-[7.5px] font-bold tracking-widest text-neutral-400 uppercase pointer-events-none">
        CLICK TO FLIP 3D VIEW
      </div>
    </div>
  );
}

function ProductDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const productId = (params.id as string) || "shorts-blue";

  const [product, setProduct] = useState<Product>(
    PRODUCTS_DATABASE[productId] || {
      id: productId,
      name: "HOMEBOY LOGO TEE",
      category: "TEES",
      price: "99.00 MYR",
      priceNumber: 99.0,
      sku: "HB-001-NEW",
      type: "tee",
      colorName: "VINTAGE BLACK",
      colorHex: "#18181b",
      frontBadge: "01 / FRONT",
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: [
        "HEAVYWEIGHT 260GSM 100% COMBED COTTON",
        "OVERSIZED BOXY STREETWEAR FIT",
        "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
      ],
      sizingNotes: "TRUE TO SIZE FIT. SIZE UP FOR AN OVERSIZED BAGGY LOOK.",
      shippingNotes: "FREE STANDARD DELIVERY ACROSS WEST & EAST MALAYSIA.",
      swatches: [{ id: productId, name: "Color", colorHex: "#18181b", type: "tee" }],
      similarProductIds: ["tee-white", "tee-black"],
    }
  );

  const [allProducts, setAllProducts] = useState<Product[]>(Object.values(PRODUCTS_DATABASE));

  const refreshCurrentProduct = React.useCallback(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}?_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setProduct(data);
        }
      })
      .catch((err) => console.log("Live product refresh:", err));

    fetch(`/api/products?_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllProducts(data);
        }
      })
      .catch((err) => console.log("Live all products refresh:", err));
  }, [productId]);

  useEffect(() => {
    refreshCurrentProduct();

    // 1. Instant cross-tab real-time sync via BroadcastChannel
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("homeboy-stock-sync");
      bc.onmessage = () => {
        refreshCurrentProduct();
      };
    } catch (e) {
      // ignore
    }

    // 2. Cross-tab sync via localStorage storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hb_stock_updated") {
        refreshCurrentProduct();
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Tab visibility/focus auto refresh
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshCurrentProduct();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", refreshCurrentProduct);

    // 4. Polling interval every 2 seconds
    const interval = setInterval(refreshCurrentProduct, 2000);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", refreshCurrentProduct);
      clearInterval(interval);
    };
  }, [refreshCurrentProduct]);

  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>("S");
  const [quantity, setQuantity] = useState(1);
  const [descOpen, setDescOpen] = useState(false);
  const [sizingOpen, setSizingOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(true);

  const effectiveType =
    product.type === "hat" || product.category === "HATS" || product.category === "HAT"
      ? "hat"
      : product.type === "shorts" || product.category === "SHORTS" || product.category === "PANTS"
      ? "shorts"
      : "tee";

  const isOverallSoldOut = product.stock !== undefined && product.stock <= 0;
  const sizeStock =
    product.stockAllocation && product.stockAllocation[selectedSize] !== undefined
      ? Number(product.stockAllocation[selectedSize])
      : product.stock !== undefined
      ? product.stock
      : 50;
  const isCurrentSizeSoldOut = isOverallSoldOut || sizeStock <= 0;

  const handleAddToCart = () => {
    if (isCurrentSizeSoldOut) {
      alert("This piece / size is currently SOLD OUT.");
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name.toUpperCase(),
      size: selectedSize,
      price: product.priceNumber || 99.0,
      quantity: quantity,
      type: effectiveType,
      colorHex: product.colorHex || "#18181b",
    });
  };

  const swatchesList =
    allProducts && allProducts.length > 0
      ? allProducts
          .filter((p) => p.category === product.category)
          .map((p) => ({
            id: p.id,
            name: p.name,
            colorHex: p.colorHex || "#18181b",
            type:
              p.type ||
              (p.category === "HATS" || p.category === "HAT"
                ? "hat"
                : p.category === "SHORTS" || p.category === "PANTS"
                ? "shorts"
                : "tee"),
          }))
      : product.swatches && product.swatches.length > 0
      ? product.swatches
      : [{ id: product.id, name: product.name, colorHex: product.colorHex || "#18181b", type: effectiveType }];

  const similarProducts = (product.similarProductIds || [])
    .map((id) => allProducts.find((p) => p.id === id) || PRODUCTS_DATABASE[id])
    .filter(Boolean);

  const displaySimilar =
    similarProducts.length > 0
      ? similarProducts
      : allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const sizesList =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : effectiveType === "hat"
      ? ["ONE SIZE"]
      : ["S", "M", "L", "XL", "XXL"];

  const descList = Array.isArray(product.description)
    ? product.description
    : typeof product.description === "string"
    ? (product.description as string)
        .split("\n")
        .map((l) => l.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean)
    : [
        "HEAVYWEIGHT 260GSM 100% COMBED COTTON",
        "OVERSIZED BOXY STREETWEAR FIT",
        "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
      ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body antialiased selection:bg-black selection:text-white">
      {/* Top Store Header */}
      <StoreHeader activeCategory={product.category} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 md:px-12 py-8 space-y-16">
        {/* Breadcrumb Row */}
        <div className="text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase flex items-center gap-2">
          <Link href="/" className="hover:text-black">
            HOME
          </Link>
          <span>/</span>
          <Link
            href={`/?category=${(product.category || "TEES").toLowerCase()}`}
            className="hover:text-black"
          >
            {product.category || "TEES"}
          </Link>
          <span>/</span>
          <span className="text-black uppercase">{product.name}</span>
        </div>

        {/* Two-Column Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Product Showcase Container with 3D Flip */}
          <div className="md:col-span-7 bg-[#fafafa] border border-[#f0f0f0] aspect-square relative flex items-center justify-center p-4 overflow-hidden">
            {isOverallSoldOut && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-40 pointer-events-none">
                <span className="bg-black text-white text-xs md:text-sm font-black tracking-[0.3em] uppercase px-6 py-2.5 shadow-xl border border-black transform -rotate-3">
                  SOLD OUT
                </span>
              </div>
            )}
            {/* Product Visual */}
            <StreetwearVisual type={effectiveType} color={product.colorHex} />
          </div>

          {/* Right Column: Details & Purchasing Controls */}
          <div className="md:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="bg-black text-white text-[7.5px] font-black tracking-widest uppercase px-1.5 py-0.5">
                  ORIGINAL
                </span>
                {isOverallSoldOut ? (
                  <span className="bg-rose-600 text-white text-[7.5px] font-black tracking-widest uppercase px-1.5 py-0.5 animate-pulse">
                    SOLD OUT
                  </span>
                ) : isCurrentSizeSoldOut ? (
                  <span className="bg-amber-600 text-white text-[7.5px] font-black tracking-widest uppercase px-1.5 py-0.5">
                    SIZE {selectedSize} SOLD OUT
                  </span>
                ) : null}
                <span className="text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase">
                  {product.sku || "HB-001-ORIGINAL"}
                </span>
              </div>

              <h1 className="font-display font-black text-2xl lg:text-3xl uppercase tracking-tight text-black mt-1">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-display font-black text-base lg:text-lg tracking-tight text-black">
                  {product.price || `${product.priceNumber || 99}.00 MYR`}
                </span>
                <span className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
                  / VAT INCL.
                </span>
                {isOverallSoldOut && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 ml-2">
                    [ SOLD OUT ]
                  </span>
                )}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="block text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
                COLOR SWATCH
              </label>
              <div className="flex items-center gap-2">
                {swatchesList.map((swatch) => (
                  <button
                    key={swatch.id}
                    onClick={() => router.push(`/product/${swatch.id}`)}
                    className={`w-12 h-12 p-1 border transition-all cursor-pointer flex items-center justify-center ${
                      swatch.id === product.id
                        ? "border-black border-2 bg-white"
                        : "border-neutral-200 bg-[#fafafa] hover:border-neutral-400"
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-xs"
                      style={{ backgroundColor: swatch.colorHex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Select Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
                  SELECT SIZE
                </label>
                {isCurrentSizeSoldOut && (
                  <span className="text-[8px] font-bold tracking-wider text-rose-600 uppercase">
                    SIZE {selectedSize} IS SOLD OUT
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {sizesList.map((size) => {
                  const sStock =
                    product.stockAllocation && product.stockAllocation[size] !== undefined
                      ? Number(product.stockAllocation[size])
                      : (product.stock ?? 50);
                  const sizeIsSoldOut = isOverallSoldOut || sStock <= 0;

                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 text-[9.5px] font-black uppercase transition-all cursor-pointer border relative ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : sizeIsSoldOut
                          ? "bg-neutral-100 text-neutral-400 border-neutral-200 hover:border-neutral-400"
                          : "bg-white text-black border-neutral-200 hover:border-black"
                      }`}
                    >
                      <span className={sizeIsSoldOut && selectedSize !== size ? "line-through opacity-70" : ""}>
                        {size}
                      </span>
                      {sizeIsSoldOut && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity and Add to Cart Row */}
            <div className="flex items-center gap-3 pt-2">
              {/* Quantity Selector */}
              <div
                className={`flex items-center border border-neutral-200 bg-white h-11 px-2 shrink-0 ${
                  isCurrentSizeSoldOut ? "opacity-40 pointer-events-none bg-neutral-100" : ""
                }`}
              >
                <button
                  disabled={isCurrentSizeSoldOut}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-6 h-full flex items-center justify-center text-neutral-400 hover:text-black cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-xs font-black">
                  {quantity}
                </span>
                <button
                  disabled={isCurrentSizeSoldOut}
                  onClick={() => setQuantity((q) => (sizeStock > 0 ? Math.min(sizeStock, q + 1) : q + 1))}
                  className="w-6 h-full flex items-center justify-center text-neutral-400 hover:text-black cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add to Cart Button */}
              {isCurrentSizeSoldOut ? (
                <button
                  disabled
                  className="flex-1 h-11 bg-neutral-200 text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] border border-neutral-300 cursor-not-allowed flex items-center justify-center gap-2 select-none"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>SOLD OUT</span>
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-11 bg-black text-white hover:bg-neutral-800 text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md"
                >
                  ADD TO CART
                </button>
              )}
            </div>

            {/* Buy It Now Button */}
            {isCurrentSizeSoldOut ? (
              <div className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 text-center">
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-rose-600">
                  ⚠️ THIS PIECE / SIZE IS CURRENTLY SOLD OUT (CANNOT CHECKOUT)
                </span>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleAddToCart();
                  router.push("/checkout");
                }}
                className="w-full h-11 border border-neutral-300 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-50 transition-all cursor-pointer"
              >
                BUY IT NOW
              </button>
            )}

            {/* Accordion List */}
            <div className="pt-4 border-t border-neutral-100 divide-y divide-neutral-100">
              {/* Description */}
              <div className="py-3">
                <button
                  onClick={() => setDescOpen(!descOpen)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-[9px] font-bold tracking-[0.2em] text-black uppercase">
                    DESCRIPTION
                  </span>
                  {descOpen ? (
                    <Minus className="w-3 h-3 text-neutral-400" />
                  ) : (
                    <Plus className="w-3 h-3 text-neutral-400" />
                  )}
                </button>
                {descOpen && (
                  <ul className="mt-3 space-y-1 text-[9.5px] font-semibold text-neutral-600 uppercase tracking-wider leading-relaxed">
                    {descList.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sizing */}
              <div className="py-3">
                <button
                  onClick={() => setSizingOpen(!sizingOpen)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-[9px] font-bold tracking-[0.2em] text-black uppercase">
                    SIZING
                  </span>
                  {sizingOpen ? (
                    <Minus className="w-3 h-3 text-neutral-400" />
                  ) : (
                    <Plus className="w-3 h-3 text-neutral-400" />
                  )}
                </button>
                {sizingOpen && (
                  <p className="mt-2 text-[9.5px] font-semibold text-neutral-600 uppercase tracking-wider leading-relaxed">
                    {product.sizingNotes || "TRUE TO SIZE FIT. SIZE UP FOR AN OVERSIZED BAGGY LOOK."}
                  </p>
                )}
              </div>

              {/* Shipping */}
              <div className="py-3">
                <button
                  onClick={() => setShippingOpen(!shippingOpen)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-[9px] font-bold tracking-[0.2em] text-black uppercase">
                    SHIPPING
                  </span>
                  {shippingOpen ? (
                    <Minus className="w-3 h-3 text-neutral-400" />
                  ) : (
                    <Plus className="w-3 h-3 text-neutral-400" />
                  )}
                </button>
                {shippingOpen && (
                  <ul className="mt-3 space-y-1.5 text-[9px] font-semibold text-neutral-600 uppercase tracking-wider leading-relaxed">
                    <li>• FREE SHIPPING ON ALL ORDERS OVER RM150 WITHIN MALAYSIA.</li>
                    <li>• STANDARD DELIVERY TAKES 3-5 BUSINESS DAYS.</li>
                    <li>• INTERNATIONAL SHIPPING AVAILABLE AT CHECKOUT.</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Styles Section */}
        {displaySimilar.length > 0 && (
          <div className="pt-10 border-t border-neutral-100 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black italic text-base uppercase tracking-wider text-black">
                SIMILAR STYLES
              </h3>
              <Link
                href="/"
                className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase hover:text-black"
              >
                VIEW ALL
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {displaySimilar.map((sim: any) => (
                <Link
                  key={sim.id}
                  href={`/product/${sim.id}`}
                  className="group space-y-2 block"
                >
                  <div className="aspect-square bg-[#fafafa] border border-[#e5e5e5] group-hover:border-black transition-all flex items-center justify-center p-4">
                    <StreetwearVisual type={sim.type || "tee"} color={sim.colorHex} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-body font-black text-[10px] uppercase text-black group-hover:underline truncate">
                      {sim.name}
                    </h4>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase">
                      {sim.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-[#ededed] mt-16 text-neutral-400 text-[9px] font-bold tracking-[0.2em] uppercase flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© 2026 HOMEBOY COLLECTION</div>
        <div className="flex items-center gap-4 text-[8.5px]">
          <span className="hover:text-black cursor-pointer">TERMS</span>
          <span className="hover:text-black cursor-pointer">PRIVACY</span>
          <span>WEBSITE DEVELOPED BY HOMEBOY.CC</span>
        </div>
        <div className="flex items-center gap-1 text-black hover:opacity-60 cursor-pointer">
          <span>INSTAGRAM</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </footer>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductDetailPageContent />
    </Suspense>
  );
}
