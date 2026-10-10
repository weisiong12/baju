"use client";

import React from "react";
import Link from "next/link";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="h-[60px] bg-white border-b border-[#ededed] flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left: Brand Logo & Ctrl badge */}
      <Link href="/admin" className="flex items-center gap-1.5 min-w-[200px] cursor-pointer">
        <span className="font-display text-[22px] font-black italic tracking-tighter text-black uppercase">
          HOMEBOY
        </span>
        <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase -mt-2">
          CTRL
        </span>
      </Link>

      {/* Center: Section Title */}
      <div className="hidden md:flex items-center">
        <span className="text-[10px] font-bold tracking-[0.28em] text-neutral-400 uppercase">
          {title}
        </span>
      </div>

      {/* Right: Administrator & Monogram */}
      <div className="flex items-center gap-3">
        <div className="text-right flex flex-col leading-tight">
          <span className="text-[10px] font-black tracking-tight text-black uppercase">
            ADMINISTRATOR
          </span>
          <span className="text-[8.5px] font-semibold tracking-wider text-neutral-400 uppercase">
            MASTER CONTROL
          </span>
        </div>
        <div className="w-[34px] h-[34px] bg-black text-white flex items-center justify-center font-black text-xs tracking-tighter">
          HB
        </div>
      </div>
    </header>
  );
}
