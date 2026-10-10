"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, X, ArrowRight, Minus, Plus } from "lucide-react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  type: "tee" | "shorts";
  colorHex: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

// Compact graphic for cart thumbnail
function CartThumb({ type, colorHex }: { type: "tee" | "shorts"; colorHex: string }) {
  if (type === "tee") {
    return (
      <svg viewBox="0 0 100 90" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  return (
    <svg viewBox="0 0 100 90" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const router = useRouter();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleProductClick = (productId: string) => {
    onClose();
    router.push(`/product/${productId}`);
  };

  const handleCheckoutClick = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-[390px] bg-white h-full flex flex-col justify-between shadow-2xl border-l border-neutral-200 z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#f0f0f0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-black stroke-[2.2]" />
            <span className="font-display font-black text-sm uppercase tracking-wider text-black">
              YOUR BAG <span className="text-neutral-400 font-bold">({totalQuantity})</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black cursor-pointer p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-20">
              <span className="font-display font-black text-sm uppercase text-neutral-400">
                YOUR BAG IS EMPTY
              </span>
              <p className="text-[9.5px] text-neutral-400 tracking-wider uppercase">
                EXPLORE THE COLLECTION TO ADD PIECES.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-5 border-b border-neutral-100 last:border-b-0">
                {/* Product Thumbnail (Clickable to view product detail) */}
                <button
                  type="button"
                  onClick={() => handleProductClick(item.productId)}
                  title="View Product Detail"
                  className="w-18 h-18 bg-[#fafafa] border border-[#ebebeb] hover:border-black flex items-center justify-center p-1 shrink-0 cursor-pointer transition-all"
                >
                  <CartThumb type={item.type} colorHex={item.colorHex} />
                </button>

                {/* Info & Quantity */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {/* Product Title (Clickable to view product detail) */}
                      <button
                        type="button"
                        onClick={() => handleProductClick(item.productId)}
                        className="text-left font-body font-black text-[10px] tracking-wide uppercase text-black hover:underline leading-tight block cursor-pointer"
                      >
                        {item.name}
                      </button>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase mt-0.5">
                        SIZE: <span className="text-neutral-700 font-black">{item.size}</span>
                      </p>
                    </div>
                    {/* Delete button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-neutral-400 hover:text-black cursor-pointer p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom row: Counter + Price */}
                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-neutral-200 bg-white h-7 px-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-5 h-full flex items-center justify-center text-neutral-400 hover:text-black cursor-pointer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-6 text-center text-[10px] font-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-5 h-full flex items-center justify-center text-neutral-400 hover:text-black cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-display font-black text-xs text-black">
                      {(item.price * item.quantity).toFixed(2)} MYR
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary (Matching exact screenshot) */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#f0f0f0] space-y-4 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-[9.5px]">
              <span className="font-bold tracking-widest text-neutral-400 uppercase">
                SUBTOTAL
              </span>
              <span className="font-display font-black text-xs tracking-tight text-black">
                {totalAmount.toFixed(2)} MYR
              </span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between text-[9.5px]">
              <span className="font-bold tracking-widest text-neutral-400 uppercase">
                SHIPPING
              </span>
              <span className="font-bold tracking-wider text-neutral-400 uppercase text-[9px]">
                CALCULATED AT CHECKOUT
              </span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <span className="font-body font-black text-xs tracking-wider uppercase text-black">
                TOTAL
              </span>
              <span className="font-display font-black text-sm tracking-tight text-black">
                {totalAmount.toFixed(2)} MYR
              </span>
            </div>

            {/* Proceed to Checkout Button */}
            <div>
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full bg-black text-white py-3.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-between px-5 cursor-pointer shadow-md"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[7.5px] font-bold tracking-wider text-neutral-400 uppercase mt-2">
                SHIPPING & TAXES CALCULATED AT THE NEXT STEP
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
