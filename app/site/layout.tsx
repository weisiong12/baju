"use client";

import React from "react";
import { CartProvider, useCart } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import SearchModal from "./components/SearchModal";

function GlobalOverlays() {
  const {
    isCartOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    isSearchOpen,
    closeSearch,
  } = useCart();

  return (
    <>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white text-black font-body antialiased">
        {children}
        <GlobalOverlays />
      </div>
    </CartProvider>
  );
}
