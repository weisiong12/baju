"use client";

import React from "react";
import Link from "next/link";
import { Search, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useCart } from "../context/CartContext";

interface StoreHeaderProps {
  activeCategory?: string;
  categories?: string[];
  onSelectCategory?: (category: string) => void;
}

export default function StoreHeader({
  activeCategory = "ALL",
  categories = ["ALL", "TEES", "SHORTS"],
  onSelectCategory,
}: StoreHeaderProps) {
  const { openCart, totalCount, openSearch } = useCart();

  const handleCatClick = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  return (
    <header className="px-6 md:px-12 py-6 border-b border-[#ededed] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-40">
      {/* Left: Quick Nav Links */}
      <nav className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-none py-1 max-w-[50%]">
        {categories.map((cat) =>
          onSelectCategory ? (
            <button
              key={cat}
              onClick={() => handleCatClick(cat)}
              className={`text-[10px] font-black tracking-[0.2em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? "text-black font-black"
                  : "text-neutral-400 hover:text-black"
              }`}
            >
              {cat}
            </button>
          ) : (
            <Link
              key={cat}
              href={cat === "ALL" ? "/" : `/?category=${cat.toLowerCase()}`}
              className={`text-[10px] font-black tracking-[0.2em] uppercase transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? "text-black font-black"
                  : "text-neutral-400 hover:text-black"
              }`}
            >
              {cat}
            </Link>
          )
        )}
      </nav>

      {/* Center: Distinctive Graffiti Stacked Logo */}
      <Link
        href="/"
        className="flex flex-col items-center leading-none text-center cursor-pointer"
      >
        <span className="font-display font-black italic text-xl md:text-2xl tracking-tight text-black uppercase">
          HOMEBOY
        </span>
        <span className="font-display font-black italic text-xs md:text-sm tracking-[0.25em] text-black uppercase -mt-0.5">
          COLLECTION
        </span>
      </Link>

      {/* Right: Search, Cart & Admin Return Button */}
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search"
          className="text-black hover:opacity-60 transition-opacity cursor-pointer p-1"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Shopping Bag Button with explicit click handler */}
        <button
          type="button"
          onClick={() => {
            openCart();
          }}
          aria-label="Shopping Bag"
          className="flex items-center gap-1.5 text-black hover:opacity-60 transition-opacity cursor-pointer p-1 bg-transparent border-none"
        >
          <ShoppingBag className="w-4 h-4 stroke-[2]" />
          <span className="text-[10px] font-black tracking-wider">
            [{totalCount}]
          </span>
        </button>

        {/* Admin Switcher Pill -> now points to /admin */}
        <Link
          href="/admin"
          title="Go to Admin Dashboard"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[9px] font-black tracking-widest uppercase hover:bg-neutral-800 transition-all shadow-xs"
        >
          <span>CTRL</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </header>
  );
}
