"use client";

import React from "react";
import { CartProvider, useCart } from "../site/context/CartContext";
import CartDrawer from "../site/components/CartDrawer";
import SearchModal from "../site/components/SearchModal";

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

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
      <GlobalOverlays />
    </CartProvider>
  );
}
