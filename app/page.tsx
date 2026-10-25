"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import StoreHeader from "./site/components/StoreHeader";
import { PRODUCTS_DATABASE } from "./site/data/products";

// Realistic Streetwear Vector Graphic Component with 3D Front & Back Flip
function StreetwearProductVisual({
  type,
  color,
  frontImage,
  backImage,
}: {
  type: "tee" | "shorts" | "hat" | string;
  color: string;
  frontImage?: string | null;
  backImage?: string | null;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-full flex items-center justify-center p-6 bg-[#fafafa] relative overflow-hidden group/item cursor-pointer perspective-1000 select-none"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Ambient Color Glow Reflection */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-2xl pointer-events-none rounded-full"
        style={{ backgroundColor: color }}
      />

      {/* Diagonal Light Gleam Sweep on Hover & Click */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] pointer-events-none z-20" />

      {/* Top Interactive Front/Back Pill Badge & Flip Button */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-auto">
        <span className="text-[7.5px] font-black tracking-[0.2em] px-2 py-0.5 bg-black/5 border border-black/10 text-neutral-600 uppercase">
          {isFlipped ? "02 / BACK" : "01 / FRONT"}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFlipped((prev) => !prev);
          }}
          className="text-[7.5px] font-black tracking-wider px-2 py-0.5 bg-white border border-neutral-300 hover:border-black text-black uppercase shadow-2xs hover:bg-black hover:text-white transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>↻</span>
          <span>{isFlipped ? "FRONT" : "BACK"}</span>
        </button>
      </div>

      {/* 3D Flip Container */}
      <div
        className="w-full h-full flex items-center justify-center preserve-3d transition-transform duration-700 ease-out"
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ========================================================================= */}
        {/* FRONT SIDE (01 / FRONT)                                                   */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 flex items-center justify-center backface-hidden p-3">
          {frontImage ? (
            <img
              src={frontImage}
              alt="Front Silhouette"
              className="w-full h-full object-contain drop-shadow-md select-none group-hover/item:scale-105 transition-transform duration-300"
            />
          ) : type === "hat" ? (
            <svg
              viewBox="0 0 160 140"
              className="w-4/5 h-4/5 drop-shadow-md group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M35 85 C35 38 125 38 125 85 Z"
                fill={color}
                stroke={color === "#ffffff" ? "#d4d4d8" : color}
                strokeWidth="2"
              />
              <path
                d="M20 85 C20 85 80 115 140 85 C132 80 120 78 110 78 L50 78 C40 78 28 80 20 85 Z"
                fill={color}
                stroke={color === "#ffffff" ? "#d4d4d8" : color}
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
                fill={color === "#ffffff" ? "#000000" : "#ffffff"}
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
                fill={color === "#ffffff" ? "#52525b" : "rgba(255,255,255,0.7)"}
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
              className="w-4/5 h-4/5 drop-shadow-md group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="36"
                y="18"
                width="88"
                height="12"
                rx="2"
                fill={color}
                stroke={color}
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
                fill={color}
                stroke={color}
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
              className="w-4/5 h-4/5 drop-shadow-md group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main T-Shirt Body */}
              <path
                d="M50 16 C60 28 100 28 110 16 L145 38 L126 64 L112 55 L112 130 L48 130 L48 55 L34 64 L15 38 Z"
                fill={color}
                stroke={color === "#ffffff" ? "#d4d4d8" : color}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Collar Fold */}
              <path
                d="M50 16 C60 28 100 28 110 16 C100 22 60 22 50 16 Z"
                fill={color === "#ffffff" ? "#f4f4f5" : "rgba(0,0,0,0.2)"}
                stroke={color === "#ffffff" ? "#a1a1aa" : "rgba(255,255,255,0.25)"}
                strokeWidth="1.5"
              />
              {/* Front HOMEBOY Typography */}
              <text
                x="80"
                y="68"
                fill={color === "#ffffff" ? "#000000" : "#ffffff"}
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
        {/* BACK SIDE (02 / BACK) - Oversized Streetwear Graphic Artwork              */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 flex items-center justify-center backface-hidden p-3"
          style={{ transform: "rotateY(180deg)" }}
        >
          {backImage ? (
            <img
              src={backImage}
              alt="Back Vision"
              className="w-full h-full object-contain drop-shadow-md select-none group-hover/item:scale-105 transition-transform duration-300"
            />
          ) : type === "hat" ? (
            <svg
              viewBox="0 0 160 140"
              className="w-4/5 h-4/5 drop-shadow-md group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M35 85 C35 38 125 38 125 85 Z"
                fill={color}
                stroke={color === "#ffffff" ? "#d4d4d8" : color}
                strokeWidth="2"
              />
              <path
                d="M60 85 C60 65 100 65 100 85 Z"
                fill="#fafafa"
                stroke={color === "#ffffff" ? "#d4d4d8" : color}
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
                fill={color === "#ffffff" ? "#000000" : "#ffffff"}
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
              className="w-4/5 h-4/5 drop-shadow-md group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back Waistband with Brand Patch */}
              <rect
                x="36"
                y="18"
                width="88"
                height="12"
                rx="2"
                fill={color}
                stroke={color}
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
              {/* Shorts Leg Outlines */}
              <path
                d="M36 28 L30 115 C30 118 64 122 74 116 L80 65 L86 116 C96 122 130 118 130 115 L124 28 Z"
                fill={color}
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Back Pocket */}
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
              className="w-4/5 h-4/5 drop-shadow-md group-hover:scale-105 group-active:scale-95 transition-all duration-300 select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main T-Shirt Body */}
              <path
                d="M50 16 C60 28 100 28 110 16 L145 38 L126 64 L112 55 L112 130 L48 130 L48 55 L34 64 L15 38 Z"
                fill={color}
                stroke={color === "#ffffff" ? "#d4d4d8" : color}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Back Neck Line (Higher & Solid) */}
              <path
                d="M50 16 C65 19 95 19 110 16"
                stroke={color === "#ffffff" ? "#a1a1aa" : "rgba(255,255,255,0.3)"}
                strokeWidth="2"
              />
              {/* Big Oversized Streetwear Back Graphic Print */}
              <rect
                x="56"
                y="36"
                width="48"
                height="62"
                fill="none"
                stroke={color === "#ffffff" ? "#18181b" : "#ffffff"}
                strokeWidth="1.2"
                strokeDasharray="4 2"
                opacity="0.85"
              />
              <text
                x="80"
                y="52"
                fill={color === "#ffffff" ? "#000000" : "#ffffff"}
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
                fill={color === "#ffffff" ? "#71717a" : "rgba(255,255,255,0.7)"}
                fontSize="4.5"
                fontWeight="800"
                textAnchor="middle"
                letterSpacing="0.15em"
              >
                ARCHIVE 2026
              </text>
              {/* Graphic Crosshair / Box Design */}
              <line
                x1="62"
                y1="72"
                x2="98"
                y2="72"
                stroke={color === "#ffffff" ? "#18181b" : "#ffffff"}
                strokeWidth="0.8"
                opacity="0.6"
              />
              {/* Barcode Graphic Print */}
              <g transform="translate(64, 78)">
                <rect x="0" y="0" width="2" height="12" fill={color === "#ffffff" ? "#000" : "#fff"} />
                <rect x="4" y="0" width="1" height="12" fill={color === "#ffffff" ? "#000" : "#fff"} />
                <rect x="7" y="0" width="3" height="12" fill={color === "#ffffff" ? "#000" : "#fff"} />
                <rect x="12" y="0" width="1.5" height="12" fill={color === "#ffffff" ? "#000" : "#fff"} />
                <rect x="15" y="0" width="2.5" height="12" fill={color === "#ffffff" ? "#000" : "#fff"} />
                <rect x="20" y="0" width="1" height="12" fill={color === "#ffffff" ? "#000" : "#fff"} />
                <rect x="23" y="0" width="3" height="12" fill={color === "#ffffff" ? "#000" : "#fff"} />
                <rect x="28" y="0" width="1" height="12" fill={color === "#ffffff" ? "#000" : "#fff"} />
                <rect x="30" y="0" width="2" height="12" fill={color === "#ffffff" ? "#000" : "#fff"} />
              </g>
            </svg>
          )}
        </div>
      </div>

      {/* Floating Quick View Badge on Hover */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-3 transition-all duration-300 ease-out z-20 pointer-events-none">
        <span className="bg-black/90 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 shadow-lg backdrop-blur-xs whitespace-nowrap">
          {isFlipped ? "VIEW BACK DETAILS →" : "VIEW PIECE →"}
        </span>
      </div>
    </div>
  );
}

function StorefrontContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category")?.toUpperCase();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "ALL"
  );

  const [products, setProducts] = useState(Object.values(PRODUCTS_DATABASE));

  const refreshProducts = React.useCallback(() => {
    fetch(`/api/products?_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => console.log("Live products refresh:", err));
  }, []);

  useEffect(() => {
    refreshProducts();

    // 1. Instant cross-tab real-time sync via BroadcastChannel
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("homeboy-stock-sync");
      bc.onmessage = () => {
        refreshProducts();
      };
    } catch (e) {
      // ignore
    }

    // 2. Cross-tab sync via localStorage storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hb_stock_updated") {
        refreshProducts();
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Tab visibility/focus auto refresh
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshProducts();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", refreshProducts);

    // 4. Polling interval every 2 seconds
    const interval = setInterval(refreshProducts, 2000);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", refreshProducts);
      clearInterval(interval);
    };
  }, [refreshProducts]);

  const availableCategories = React.useMemo(() => {
    const dynamicCats = Array.from(
      new Set(
        products
          .map((p) => p.category?.toUpperCase()?.trim())
          .filter((cat): cat is string => Boolean(cat && cat !== "ALL"))
      )
    );
    return ["ALL", ...dynamicCats];
  }, [products]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("ALL");
    }
  }, [categoryParam]);

  const changeCategory = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === "ALL") {
      router.push("/", { scroll: false });
    } else {
      router.push(`/?category=${cat.toLowerCase()}`, { scroll: false });
    }
  };

  const categoriesToRender =
    selectedCategory === "ALL"
      ? availableCategories.filter((c) => c !== "ALL")
      : [selectedCategory];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body antialiased selection:bg-black selection:text-white">
      {/* Top Store Header */}
      <StoreHeader
        activeCategory={selectedCategory}
        categories={availableCategories}
        onSelectCategory={changeCategory}
      />

      {/* Sub Category Under-Header Filter Tabs */}
      <div className="flex items-center justify-center gap-6 md:gap-8 py-5 border-b border-[#f5f5f5] overflow-x-auto px-4 scrollbar-none">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => changeCategory(cat)}
            className={`text-[10px] font-black tracking-[0.25em] uppercase transition-all cursor-pointer relative pb-1 whitespace-nowrap ${
              selectedCategory === cat
                ? "text-black border-b-2 border-black"
                : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Showcase Catalog Canvas */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-12 py-10 space-y-16">
        {categoriesToRender.map((cat, idx) => {
          const catProducts = products.filter((p) => {
            const pCat = (p.category || "TEES").toUpperCase().trim();
            return pCat === cat;
          });

          if (catProducts.length === 0 && selectedCategory === "ALL") {
            return null;
          }

          return (
            <section key={cat} id={cat.toLowerCase()} className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <span className="text-[8.5px] font-bold tracking-[0.3em] text-neutral-400 uppercase">
                  [ SERIES 0{idx + 1} ]
                </span>
                <h2 className="font-display font-black italic text-2xl md:text-3xl tracking-wide text-black uppercase">
                  {cat}
                </h2>
              </div>

              {catProducts.length === 0 ? (
                <div className="py-14 text-center space-y-2 bg-[#fafafa] border border-[#f0f0f0] max-w-xl mx-auto p-8">
                  <p className="font-display font-black text-xs uppercase text-neutral-400 tracking-wider">
                    NO PIECES CURRENTLY IN {cat} CATALOGUE
                  </p>
                  <p className="text-[8.5px] font-bold text-neutral-400 uppercase tracking-widest">
                    NEW ARCHIVE DROP ARRIVING SOON
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  {catProducts.map((product) => {
                    const isSoldOut = product.stock !== undefined && product.stock <= 0;
                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="group cursor-pointer space-y-3 block relative"
                      >
                        <div className="aspect-square w-full bg-[#fafafa] border border-[#ebebeb] group-hover:border-black transition-all duration-300 overflow-hidden relative">
                          <StreetwearProductVisual
                            type={
                              product.type === "hat" || product.category === "HATS" || product.category === "HAT"
                                ? "hat"
                                : product.type === "shorts" || product.category === "SHORTS" || product.category === "PANTS"
                                ? "shorts"
                                : "tee"
                            }
                            color={product.colorHex}
                            frontImage={product.frontImage}
                            backImage={product.backImage}
                          />

                          {/* SOLD OUT Badge Overlay */}
                          {isSoldOut && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-30 pointer-events-none">
                              <span className="bg-black text-white text-[10px] font-black tracking-[0.25em] uppercase px-4 py-1.5 shadow-md border border-black transform -rotate-3">
                                SOLD OUT
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-left space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-body font-black text-[11px] tracking-wider text-black uppercase group-hover:underline truncate">
                              {product.name}
                            </h3>
                            {isSoldOut && (
                              <span className="text-[8px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 shrink-0">
                                SOLD OUT
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
                            {product.price}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </main>

      {/* Storefront Footer */}
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

export default function StorefrontPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <StorefrontContent />
    </Suspense>
  );
}
