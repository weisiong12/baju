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
  type?: "tee" | "shorts";
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
            {type === "tee" ? (
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
            ) : (
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
            )}
          </div>

          {/* ========================================================================= */}
          {/* BACK VIEW (02 / BACK) - Oversized Streetwear Graphic Artwork              */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 flex items-center justify-center backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            {type === "tee" ? (
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
            ) : (
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

  useEffect(() => {
    // Fetch all products for swatches & recommendations
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllProducts(data);
          const found = data.find((p: any) => p.id === productId);
          if (found) {
            setProduct(found);
          }
        }
      })
      .catch((err) => console.log("Cached all products:", err));

    // Fetch this specific product
    if (productId) {
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.id) {
            setProduct(data);
          }
        })
        .catch((err) => console.log("Using cached product:", err));
    }
  }, [productId]);

  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>("S");
  const [quantity, setQuantity] = useState(1);
  const [descOpen, setDescOpen] = useState(false);
  const [sizingOpen, setSizingOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(true);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name.toUpperCase(),
      size: selectedSize,
      price: product.priceNumber || 99.0,
      quantity: quantity,
      type: product.type || "tee",
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
            type: p.type || (product.category === "SHORTS" ? "shorts" : "tee"),
          }))
      : product.swatches && product.swatches.length > 0
      ? product.swatches
      : [{ id: product.id, name: product.name, colorHex: product.colorHex || "#18181b", type: product.type || "tee" }];

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
            {/* Product Visual */}
            <StreetwearVisual type={product.type || "tee"} color={product.colorHex} />
          </div>

          {/* Right Column: Details & Purchasing Controls */}
          <div className="md:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-black text-white text-[7.5px] font-black tracking-widest uppercase px-1.5 py-0.5">
                  ORIGINAL
                </span>
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
              <label className="block text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
                SELECT SIZE
              </label>
              <div className="flex items-center gap-1.5">
                {sizesList.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-9 h-9 text-[9.5px] font-black uppercase transition-all cursor-pointer border ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-neutral-200 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart Row */}
            <div className="flex items-center gap-3 pt-2">
              {/* Quantity Selector */}
              <div className="flex items-center border border-neutral-200 bg-white h-11 px-2 shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-6 h-full flex items-center justify-center text-neutral-400 hover:text-black cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-xs font-black">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-6 h-full flex items-center justify-center text-neutral-400 hover:text-black cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-11 bg-black text-white hover:bg-neutral-800 text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md"
              >
                ADD TO CART
              </button>
            </div>

            {/* Buy It Now Button */}
            <button
              onClick={handleAddToCart}
              className="w-full h-11 border border-neutral-300 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-50 transition-all cursor-pointer"
            >
              BUY IT NOW
            </button>

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
