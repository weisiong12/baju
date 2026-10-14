export interface Product {
  id: string;
  name: string;
  category: "TEES" | "SHORTS" | "HATS" | string;
  price: string;
  priceNumber: number;
  sku: string;
  type: "tee" | "shorts" | "hat" | string;
  colorName: string;
  colorHex: string;
  frontBadge: string;
  sizes: string[];
  description: string[];
  sizingNotes: string;
  shippingNotes: string;
  swatches: { id: string; name: string; colorHex: string; type: "tee" | "shorts" | "hat" | string }[];
  similarProductIds: string[];
  stock?: number;
  stockAllocation?: Record<string, number>;
}

export const PRODUCTS_DATABASE: Record<string, Product> = {
  "shorts-blue": {
    id: "shorts-blue",
    name: "Klein Blue Homeboy Logo Shorts",
    category: "SHORTS",
    price: "109.00 MYR",
    priceNumber: 109.0,
    sku: "HB-001-KKB20760",
    type: "shorts",
    colorName: "KLEIN BLUE",
    colorHex: "#1d4ed8",
    frontBadge: "01 / FRONT",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: [
      "RELAXED FIT DOUBLE LAYER MESH SHORT",
      "100% POLYESTER",
      "ABOVE KNEE",
      "KLEIN BLUE",
      "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
    ],
    sizingNotes: "TRUE TO SIZE FIT. SIZE UP FOR AN OVERSIZED BAGGY LOOK.",
    shippingNotes: "FREE STANDARD DELIVERY ACROSS WEST & EAST MALAYSIA (2-4 BUSINESS DAYS).",
    swatches: [
      { id: "shorts-green", name: "Forest Green", colorHex: "#15803d", type: "shorts" },
      { id: "shorts-blue", name: "Klein Blue", colorHex: "#1d4ed8", type: "shorts" },
    ],
    similarProductIds: ["shorts-green"],
  },
  "shorts-green": {
    id: "shorts-green",
    name: "Forest Green Homeboy Logo Shorts",
    category: "SHORTS",
    price: "109.00 MYR",
    priceNumber: 109.0,
    sku: "HB-001-FGR10440",
    type: "shorts",
    colorName: "FOREST GREEN",
    colorHex: "#15803d",
    frontBadge: "01 / FRONT",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: [
      "RELAXED FIT DOUBLE LAYER MESH SHORT",
      "100% POLYESTER",
      "ABOVE KNEE",
      "FOREST GREEN",
      "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
    ],
    sizingNotes: "TRUE TO SIZE FIT. SIZE UP FOR AN OVERSIZED BAGGY LOOK.",
    shippingNotes: "FREE STANDARD DELIVERY ACROSS WEST & EAST MALAYSIA (2-4 BUSINESS DAYS).",
    swatches: [
      { id: "shorts-green", name: "Forest Green", colorHex: "#15803d", type: "shorts" },
      { id: "shorts-blue", name: "Klein Blue", colorHex: "#1d4ed8", type: "shorts" },
    ],
    similarProductIds: ["shorts-blue"],
  },
  "tee-white": {
    id: "tee-white",
    name: "White Homeboy Logo Tee",
    category: "TEES",
    price: "99.00 MYR",
    priceNumber: 99.0,
    sku: "HB-001-WHT30910",
    type: "tee",
    colorName: "OPTIC WHITE",
    colorHex: "#ffffff",
    frontBadge: "01 / FRONT",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: [
      "HEAVYWEIGHT 260GSM 100% COMBED COTTON",
      "OVERSIZED BOXY STREETWEAR FIT",
      "HIGH DENSITY CHEST SILKSCREEN GRAPHIC",
      "PRE-SHRUNK FABRIC",
      "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
    ],
    sizingNotes: "BOXY OVERSIZED FIT. TAKE YOUR NORMAL SIZE FOR STREETWEAR DRAPE.",
    shippingNotes: "FREE STANDARD DELIVERY ACROSS WEST & EAST MALAYSIA (2-4 BUSINESS DAYS).",
    swatches: [
      { id: "tee-white", name: "White", colorHex: "#ffffff", type: "tee" },
      { id: "tee-black", name: "Black", colorHex: "#18181b", type: "tee" },
      { id: "tee-brown", name: "Brown", colorHex: "#5c3317", type: "tee" },
    ],
    similarProductIds: ["tee-black", "tee-brown"],
  },
  "tee-black": {
    id: "tee-black",
    name: "Black Homeboy Logo Tee",
    category: "TEES",
    price: "99.00 MYR",
    priceNumber: 99.0,
    sku: "HB-001-BLK30920",
    type: "tee",
    colorName: "VINTAGE BLACK",
    colorHex: "#18181b",
    frontBadge: "01 / FRONT",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: [
      "HEAVYWEIGHT 260GSM 100% COMBED COTTON",
      "OVERSIZED BOXY STREETWEAR FIT",
      "HIGH DENSITY CHEST SILKSCREEN GRAPHIC",
      "PRE-SHRUNK FABRIC",
      "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
    ],
    sizingNotes: "BOXY OVERSIZED FIT. TAKE YOUR NORMAL SIZE FOR STREETWEAR DRAPE.",
    shippingNotes: "FREE STANDARD DELIVERY ACROSS WEST & EAST MALAYSIA (2-4 BUSINESS DAYS).",
    swatches: [
      { id: "tee-white", name: "White", colorHex: "#ffffff", type: "tee" },
      { id: "tee-black", name: "Black", colorHex: "#18181b", type: "tee" },
      { id: "tee-brown", name: "Brown", colorHex: "#5c3317", type: "tee" },
    ],
    similarProductIds: ["tee-white", "tee-brown"],
  },
  "tee-brown": {
    id: "tee-brown",
    name: "Brown Homeboy Logo Tee",
    category: "TEES",
    price: "99.00 MYR",
    priceNumber: 99.0,
    sku: "HB-001-BRN30930",
    type: "tee",
    colorName: "EARTH BROWN",
    colorHex: "#5c3317",
    frontBadge: "01 / FRONT",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: [
      "HEAVYWEIGHT 260GSM 100% COMBED COTTON",
      "OVERSIZED BOXY STREETWEAR FIT",
      "HIGH DENSITY CHEST SILKSCREEN GRAPHIC",
      "PRE-SHRUNK FABRIC",
      "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
    ],
    sizingNotes: "BOXY OVERSIZED FIT. TAKE YOUR NORMAL SIZE FOR STREETWEAR DRAPE.",
    shippingNotes: "FREE STANDARD DELIVERY ACROSS WEST & EAST MALAYSIA (2-4 BUSINESS DAYS).",
    swatches: [
      { id: "tee-white", name: "White", colorHex: "#ffffff", type: "tee" },
      { id: "tee-black", name: "Black", colorHex: "#18181b", type: "tee" },
      { id: "tee-brown", name: "Brown", colorHex: "#5c3317", type: "tee" },
    ],
    similarProductIds: ["tee-white", "tee-black"],
  },
};
