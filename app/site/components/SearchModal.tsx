"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { PRODUCTS_DATABASE, Product } from "../data/products";

// Product Vector Visual for Search Results
function SearchVisual({ type, colorHex }: { type: "tee" | "shorts" | "hat" | string; colorHex: string }) {
  if (type === "hat") {
    return (
      <svg viewBox="0 0 160 140" className="w-4/5 h-4/5 drop-shadow-sm group-hover:scale-105 transition-transform duration-200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M35 85 C35 38 125 38 125 85 Z"
          fill={colorHex}
          stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex}
          strokeWidth="2"
        />
        <path
          d="M20 85 C20 85 80 115 140 85 C132 80 120 78 110 78 L50 78 C40 78 28 80 20 85 Z"
          fill={colorHex}
          stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex}
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
          fill={colorHex === "#ffffff" ? "#000000" : "#ffffff"}
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
          fill={colorHex === "#ffffff" ? "#52525b" : "rgba(255,255,255,0.7)"}
          fontSize="4"
          fontWeight="800"
          textAnchor="middle"
          letterSpacing="0.1em"
        >
          CAP CO.
        </text>
      </svg>
    );
  }
  if (type === "shorts") {
    return (
      <svg viewBox="0 0 160 140" className="w-4/5 h-4/5 drop-shadow-sm group-hover:scale-105 transition-transform duration-200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="36" y="18" width="88" height="12" rx="2" fill={colorHex} stroke={colorHex} strokeWidth="2" />
        <path d="M74 24 Q72 38 68 46 M86 24 Q88 38 92 46" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M36 28 L30 115 C30 118 64 122 74 116 L80 65 L86 116 C96 122 130 118 130 115 L124 28 Z" fill={colorHex} stroke={colorHex} strokeWidth="2" strokeLinejoin="round" />
        <g transform="translate(86, 90) rotate(-6)">
          <text x="0" y="0" fill="#ffffff" fontSize="8.5" fontWeight="900" fontStyle="italic">HOMEBOY</text>
          <text x="2" y="9" fill="#ffffff" fontSize="7" fontWeight="900" fontStyle="italic">COLLECTION</text>
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 140" className="w-4/5 h-4/5 drop-shadow-sm group-hover:scale-105 transition-transform duration-200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 16 C60 28 100 28 110 16 L145 38 L126 64 L112 55 L112 130 L48 130 L48 55 L34 64 L15 38 Z"
        fill={colorHex}
        stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M50 16 C60 28 100 28 110 16 C100 22 60 22 50 16 Z"
        fill={colorHex === "#ffffff" ? "#f4f4f5" : "rgba(0,0,0,0.2)"}
        stroke={colorHex === "#ffffff" ? "#a1a1aa" : "rgba(255,255,255,0.25)"}
        strokeWidth="1.5"
      />
      <text
        x="80"
        y="68"
        fill={colorHex === "#ffffff" ? "#000000" : "#ffffff"}
        fontSize="10"
        fontWeight="900"
        fontStyle="italic"
        textAnchor="middle"
      >
        HOMEBOY
      </text>
    </svg>
  );
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>(Object.values(PRODUCTS_DATABASE));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);

      // Fetch latest live products from database
      fetch(`/api/products?_t=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setAllProducts(data);
          }
        })
        .catch((err) => console.log("SearchModal live fetch error, using fallback:", err));
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = allProducts.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.colorName && p.colorName.toLowerCase().includes(q)) ||
      (Array.isArray(p.description)
        ? p.description.some((d) => d.toLowerCase().includes(q))
        : typeof p.description === "string" && (p.description as string).toLowerCase().includes(q))
    );
  });

  const handleSelectProduct = (id: string) => {
    onClose();
    router.push(`/product/${id}`);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-white animate-in fade-in duration-150 overflow-y-auto">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 space-y-8 min-h-screen flex flex-col justify-between">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
              SEARCH CATALOGUE
            </span>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-black cursor-pointer p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Large Search Input Box (Matching screenshot 100%) */}
          <div className="relative">
            <div className="flex items-center border border-black px-4 py-3 bg-white shadow-2xs">
              <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH FOR SHIRTS, SHORTS, SKUS..."
                className="w-full text-xl md:text-2xl font-black uppercase tracking-wider text-black placeholder:text-neutral-300 focus:outline-none bg-transparent"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-neutral-400 hover:text-black text-xs font-bold uppercase p-1 cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Results Count Label */}
          <div>
            <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
              RESULTS ({filteredProducts.length})
            </span>
          </div>

          {/* 5-Column Grid Display (Matching screenshot 100%) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-start">
            {filteredProducts.map((product) => {
              const isSoldOut = product.stock !== undefined && product.stock <= 0;
              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className="group cursor-pointer space-y-3 relative"
                >
                  {/* Visual Box */}
                  <div className="aspect-square bg-[#fafafa] border border-[#ebebeb] group-hover:border-black transition-all flex items-center justify-center p-4 relative overflow-hidden">
                    <SearchVisual
                      type={
                        product.type === "hat" || product.category === "HATS" || product.category === "HAT"
                          ? "hat"
                          : product.type === "shorts" || product.category === "SHORTS" || product.category === "PANTS"
                          ? "shorts"
                          : "tee"
                      }
                      colorHex={product.colorHex}
                    />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center pointer-events-none">
                        <span className="bg-black text-white text-[8px] font-black tracking-widest px-2 py-1 uppercase transform -rotate-3">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="text-left space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-body font-black text-[10px] tracking-wider uppercase text-black group-hover:underline truncate">
                        {product.name}
                      </h4>
                      {isSoldOut && (
                        <span className="text-[7.5px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-200 px-1 py-0.2 shrink-0">
                          SOLD OUT
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase">
                      {product.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center space-y-2">
              <p className="font-display font-black text-sm uppercase text-neutral-400">
                NO PIECES FOUND MATCHING &quot;{query}&quot;
              </p>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                TRY SEARCHING FOR &quot;TEE&quot;, &quot;SHORTS&quot;, OR &quot;HOMEBOY&quot;
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-12 pb-6 border-t border-neutral-100 flex items-center justify-between text-neutral-400 text-[8.5px] font-bold tracking-widest uppercase">
          <span>PRESS [ESC] TO CLOSE</span>
          <span>HOMEBOY COLLECTION ARCHIVE</span>
        </div>
      </div>
    </div>
  );
}
