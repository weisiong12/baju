"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, X, ArrowRight, Minus, Plus, Lock, AlertTriangle } from "lucide-react";
import { Product } from "../data/products";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  type: "tee" | "shorts" | "hat" | string;
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
function CartThumb({ type, colorHex }: { type: "tee" | "shorts" | "hat" | string; colorHex: string }) {
  if (type === "hat") {
    return (
      <svg viewBox="0 0 100 90" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 55 C22 25 78 25 78 55 Z" fill={colorHex} stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="1.5" />
        <path d="M12 55 C12 55 50 75 88 55 C82 52 75 50 68 50 L32 50 C25 50 18 52 12 55 Z" fill={colorHex} stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="1.5" />
        <text x="50" y="42" fill={colorHex === "#ffffff" ? "#000000" : "#ffffff"} fontSize="4.5" fontWeight="900" fontStyle="italic" textAnchor="middle">HB</text>
      </svg>
    );
  }
  if (type === "shorts") {
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

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const router = useRouter();
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  // Fetch live products from database
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
      console.log("CartDrawer live stock fetch error:", e);
    }
  }, []);

  // Fetch on mount & when opened
  useEffect(() => {
    fetchLiveProducts();
  }, [fetchLiveProducts]);

  useEffect(() => {
    if (!isOpen) return;
    fetchLiveProducts();

    // 1. Instant cross-tab real-time sync via BroadcastChannel
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("homeboy-stock-sync");
      bc.onmessage = () => {
        fetchLiveProducts();
      };
    } catch (e) {}

    // 2. Storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hb_stock_updated") {
        fetchLiveProducts();
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Fast 2s polling interval while cart drawer is open
    const interval = setInterval(fetchLiveProducts, 2000);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [isOpen, fetchLiveProducts]);

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

  // Helper to determine if an item is sold out
  const getItemStock = (item: CartItem) => {
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

    // 1. Overall product stock check
    if (prod.stock !== undefined && prod.stock <= 0) {
      return { isSoldOut: true, availableStock: 0 };
    }

    // 2. Per-size allocation check
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

  if (!isOpen) return null;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const soldOutItems = items.filter((item) => getItemStock(item).isSoldOut);
  const hasSoldOutItems = soldOutItems.length > 0;

  const handleProductClick = (productId: string) => {
    onClose();
    router.push(`/product/${productId}`);
  };

  const handleCheckoutClick = () => {
    if (hasSoldOutItems) {
      alert("Your bag contains sold out pieces. Please remove them before proceeding to checkout.");
      return;
    }
    onClose();
    router.push("/checkout");
  };

  const handleRemoveAllSoldOut = () => {
    soldOutItems.forEach((so) => onRemoveItem(so.id));
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
            items.map((item) => {
              const stockInfo = getItemStock(item);
              const isSoldOut = stockInfo.isSoldOut;

              return (
                <div
                  key={item.id}
                  className={`flex gap-4 pb-5 border-b border-neutral-100 last:border-b-0 transition-opacity ${
                    isSoldOut ? "opacity-85" : ""
                  }`}
                >
                  {/* Product Thumbnail (Clickable to view product detail) */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => handleProductClick(item.productId)}
                      title="View Product Detail"
                      className={`w-18 h-18 bg-[#fafafa] border flex items-center justify-center p-1 shrink-0 cursor-pointer transition-all ${
                        isSoldOut
                          ? "border-red-300 hover:border-red-500"
                          : "border-[#ebebeb] hover:border-black"
                      }`}
                    >
                      <CartThumb type={item.type} colorHex={item.colorHex} />
                    </button>
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                        <span className="text-[7px] font-black text-white tracking-widest uppercase bg-red-600 px-1 py-0.5">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info & Quantity */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {/* Product Title + SOLD OUT Badge */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleProductClick(item.productId)}
                            className="text-left font-body font-black text-[10px] tracking-wide uppercase text-black hover:underline leading-tight block cursor-pointer"
                          >
                            {item.name}
                          </button>
                          {isSoldOut && (
                            <span className="bg-red-600 text-white text-[7.5px] font-black px-1.5 py-0.5 tracking-wider uppercase rounded-xs">
                              SOLD OUT
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase mt-0.5">
                          SIZE: <span className="text-neutral-700 font-black">{item.size}</span>
                        </p>
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-400 hover:text-black cursor-pointer p-0.5 transition-colors"
                        title="Remove from bag"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Sold out notice under title */}
                    {isSoldOut && (
                      <p className="text-[8px] font-black text-red-600 uppercase tracking-wider mt-1">
                        PIECE SOLD OUT — REMOVE TO CHECKOUT
                      </p>
                    )}

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
                          onClick={() => {
                            if (isSoldOut || item.quantity >= stockInfo.availableStock) {
                              alert("Cannot increase quantity: this piece / size is SOLD OUT.");
                              return;
                            }
                            onUpdateQuantity(item.id, 1);
                          }}
                          disabled={isSoldOut || item.quantity >= stockInfo.availableStock}
                          title={
                            isSoldOut
                              ? "Item is sold out"
                              : item.quantity >= stockInfo.availableStock
                              ? "Maximum available stock reached"
                              : "Increase quantity"
                          }
                          className={`w-5 h-full flex items-center justify-center ${
                            isSoldOut || item.quantity >= stockInfo.availableStock
                              ? "text-neutral-300 cursor-not-allowed"
                              : "text-neutral-400 hover:text-black cursor-pointer"
                          }`}
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
              );
            })
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#f0f0f0] space-y-4 bg-white">
            {/* Warning banner if sold out items are present */}
            {hasSoldOutItems && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-xs space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-red-700">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[9px] font-black tracking-wider uppercase">
                    SOLD OUT PIECES DETECTED ({soldOutItems.length})
                  </span>
                </div>
                <p className="text-[8.5px] font-bold text-red-600 uppercase tracking-wide leading-tight">
                  Checkout is disabled until sold out items are removed from your bag.
                </p>
                <button
                  type="button"
                  onClick={handleRemoveAllSoldOut}
                  className="text-[8.5px] font-black text-red-700 hover:text-black underline uppercase tracking-wider cursor-pointer pt-0.5 block"
                >
                  [ REMOVE ALL SOLD OUT ITEMS ]
                </button>
              </div>
            )}

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
              {hasSoldOutItems ? (
                <button
                  type="button"
                  disabled
                  title="Cannot proceed to checkout with sold out items"
                  className="w-full bg-neutral-200 text-neutral-400 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] cursor-not-allowed flex items-center justify-between px-5 border border-neutral-300 select-none shadow-none"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                    SOLD OUT — CANNOT CHECKOUT
                  </span>
                  <X className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full bg-black text-white py-3.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-between px-5 cursor-pointer shadow-md"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <p className="text-center text-[7.5px] font-bold tracking-wider text-neutral-400 uppercase mt-2">
                {hasSoldOutItems
                  ? "REMOVE SOLD OUT PIECES TO ENABLE CHECKOUT"
                  : "SHIPPING & TAXES CALCULATED AT THE NEXT STEP"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
