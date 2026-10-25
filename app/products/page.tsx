"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import R2MediaModal from "../components/R2MediaModal";
import {
  Search,
  ChevronDown,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  X,
  Upload,
  Cloud,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

export const COLOR_PRESETS = [
  { name: "OPTIC WHITE", hex: "#ffffff" },
  { name: "VINTAGE BLACK", hex: "#18181b" },
  { name: "EARTH BROWN", hex: "#5c3317" },
  { name: "KLEIN BLUE", hex: "#1d4ed8" },
  { name: "FOREST GREEN", hex: "#15803d" },
  { name: "CHARCOAL", hex: "#374151" },
  { name: "CRIMSON RED", hex: "#991b1b" },
  { name: "ROYAL PURPLE", hex: "#6b21a8" },
];

// Realistic Streetwear Silhouette Graphic (Tee, Shorts & Hat)
function ShirtGraphic({
  type = "tee",
  color,
  logoColor,
}: {
  type?: "tee" | "shorts" | "hat";
  color: string;
  logoColor: string;
}) {
  if (type === "hat") {
    return (
      <svg viewBox="0 0 100 90" className="w-12 h-11 drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 55 C22 25 78 25 78 55 Z" fill={color} stroke={color === "#ffffff" ? "#d4d4d8" : color} strokeWidth="1.5" />
        <path d="M12 55 C12 55 50 75 88 55 C82 52 75 50 68 50 L32 50 C25 50 18 52 12 55 Z" fill={color} stroke={color === "#ffffff" ? "#d4d4d8" : color} strokeWidth="1.5" />
        <text x="50" y="42" fill={color === "#ffffff" ? "#000000" : "#ffffff"} fontSize="4.5" fontWeight="900" fontStyle="italic" textAnchor="middle">HOMEBOY</text>
      </svg>
    );
  }
  if (type === "shorts") {
    return (
      <svg viewBox="0 0 100 90" className="w-12 h-11 drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="22" y="10" width="56" height="8" rx="1.5" fill={color} stroke={color === "#ffffff" ? "#d4d4d8" : color} strokeWidth="1.5" />
        <path d="M46 14 Q44 24 42 29 M54 14 Q56 24 58 29" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 17 L18 76 C18 78 40 81 47 77 L50 42 L53 77 C60 81 82 78 82 76 L78 17 Z" fill={color} stroke={color === "#ffffff" ? "#d4d4d8" : color} strokeWidth="1.5" strokeLinejoin="round" />
        <g transform="translate(54, 58) rotate(-6)">
          <text x="0" y="0" fill={color === "#ffffff" ? "#000000" : "#ffffff"} fontSize="5.5" fontWeight="900" fontStyle="italic">HOMEBOY</text>
        </g>
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 100 90"
      className="w-12 h-11 drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 10 C38 18 62 18 68 10 L88 24 L76 40 L68 34 L68 84 L32 84 L32 34 L24 40 L12 24 Z"
        fill={color}
        stroke={color === "#ffffff" ? "#d4d4d8" : color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 10 C38 18 62 18 68 10 C62 14 38 14 32 10 Z"
        fill={color === "#ffffff" ? "#f4f4f5" : "rgba(0,0,0,0.15)"}
        stroke={color === "#ffffff" ? "#a1a1aa" : "rgba(255,255,255,0.2)"}
        strokeWidth="1"
      />
      <text
        x="50"
        y="42"
        fill={logoColor}
        fontSize="7"
        fontWeight="900"
        fontStyle="italic"
        textAnchor="middle"
        letterSpacing="0.05em"
      >
        HOMEBOY
      </text>
    </svg>
  );
}

// Modal Graphic Preview (Front) - Tee, Shorts & Hat
function ModalFrontVisual({
  type = "tee",
  colorHex,
}: {
  type?: "tee" | "shorts" | "hat";
  colorHex: string;
}) {
  if (type === "hat") {
    return (
      <svg viewBox="0 0 160 140" className="w-44 h-44 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35 85 C35 38 125 38 125 85 Z" fill={colorHex} stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="2" />
        <path d="M20 85 C20 85 80 115 140 85 C132 80 120 78 110 78 L50 78 C40 78 28 80 20 85 Z" fill={colorHex} stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="2" />
        <rect x="52" y="52" width="56" height="20" rx="2" fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <text x="80" y="65" fill={colorHex === "#ffffff" ? "#000000" : "#ffffff"} fontSize="7" fontWeight="900" fontStyle="italic" textAnchor="middle" letterSpacing="0.06em">HOMEBOY</text>
        <text x="80" y="71" fill={colorHex === "#ffffff" ? "#52525b" : "rgba(255,255,255,0.7)"} fontSize="4" fontWeight="800" textAnchor="middle" letterSpacing="0.1em">CAP CO.</text>
      </svg>
    );
  }
  if (type === "shorts") {
    return (
      <svg viewBox="0 0 160 140" className="w-44 h-44 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="36" y="18" width="88" height="12" rx="2" fill={colorHex} stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="2" />
        <path d="M74 24 Q72 38 68 46 M86 24 Q88 38 92 46" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M36 28 L30 115 C30 118 64 122 74 116 L80 65 L86 116 C96 122 130 118 130 115 L124 28 Z" fill={colorHex} stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="2" strokeLinejoin="round" />
        <g transform="translate(86, 90) rotate(-6)">
          <text x="0" y="0" fill={colorHex === "#ffffff" ? "#000000" : "#ffffff"} fontSize="8.5" fontWeight="900" fontStyle="italic">HOMEBOY</text>
          <text x="2" y="9" fill={colorHex === "#ffffff" ? "#000000" : "#ffffff"} fontSize="7" fontWeight="900" fontStyle="italic">COLLECTION</text>
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 140" className="w-44 h-44 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        letterSpacing="0.06em"
      >
        HOMEBOY
      </text>
    </svg>
  );
}

// Modal Graphic Preview (Back) - Tee, Shorts & Hat
function ModalBackVisual({
  type = "tee",
  colorHex,
}: {
  type?: "tee" | "shorts" | "hat";
  colorHex: string;
}) {
  if (type === "hat") {
    return (
      <svg viewBox="0 0 160 140" className="w-44 h-44 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35 85 C35 38 125 38 125 85 Z" fill={colorHex} stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="2" />
        <path d="M60 85 C60 65 100 65 100 85 Z" fill="#fafafa" stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="2" />
        <rect x="52" y="78" width="56" height="7" rx="1.5" fill="#18181b" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <rect x="74" y="76" width="12" height="11" rx="1" fill="#d4af37" stroke="#000000" strokeWidth="1" />
        <text x="80" y="52" fill={colorHex === "#ffffff" ? "#000000" : "#ffffff"} fontSize="6" fontWeight="900" fontStyle="italic" textAnchor="middle">HB ARCHIVE</text>
      </svg>
    );
  }
  if (type === "shorts") {
    return (
      <svg viewBox="0 0 160 140" className="w-44 h-44 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="36" y="18" width="88" height="12" rx="2" fill={colorHex} stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="2" />
        <rect x="88" y="20" width="24" height="8" rx="1" fill="#000000" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <text x="100" y="26" fill="#ffffff" fontSize="4" fontWeight="900" textAnchor="middle">HB CO.</text>
        <path d="M36 28 L30 115 C30 118 64 122 74 116 L80 65 L86 116 C96 122 130 118 130 115 L124 28 Z" fill={colorHex} stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex} strokeWidth="2" strokeLinejoin="round" />
        <rect x="86" y="45" width="30" height="32" rx="2" fill="rgba(0,0,0,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
        <text x="101" y="63" fill="#ffffff" fontSize="5" fontWeight="900" textAnchor="middle" opacity="0.8">BACK POCKET</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 140" className="w-44 h-44 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 16 C60 28 100 28 110 16 L145 38 L126 64 L112 55 L112 130 L48 130 L48 55 L34 64 L15 38 Z"
        fill={colorHex}
        stroke={colorHex === "#ffffff" ? "#d4d4d8" : colorHex}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M50 16 C60 28 100 28 110 16 C100 20 60 20 50 16 Z"
        fill={colorHex === "#ffffff" ? "#e4e4e7" : "rgba(0,0,0,0.3)"}
        stroke={colorHex === "#ffffff" ? "#a1a1aa" : "rgba(255,255,255,0.25)"}
        strokeWidth="1.5"
      />
      <g transform="translate(80, 70)" textAnchor="middle">
        <text
          x="0"
          y="0"
          fill={colorHex === "#ffffff" ? "#000000" : "#ffffff"}
          fontSize="14"
          fontWeight="900"
          fontStyle="italic"
          letterSpacing="-0.03em"
        >
          HOMEBOY ™
        </text>
        <text
          x="0"
          y="15"
          fill={colorHex === "#ffffff" ? "#000000" : "#ffffff"}
          fontSize="12"
          fontWeight="900"
          fontStyle="italic"
          letterSpacing="0.05em"
        >
          COLLECTION
        </text>
      </g>
    </svg>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL COLLECTIONS");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("hb_admin_authenticated");
      if (!isAuth) {
        router.replace("/admin/login");
      }
    }
  }, [router]);

interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  price: string;
  shirtColor: string;
  logoColor: string;
  stock: string;
  rawStock?: number;
  stockAllocation?: Record<string, number>;
  sizes: string[];
  category: string;
  frontImage?: string | null;
  backImage?: string | null;
}

function notifyStockSync() {
  if (typeof window !== "undefined") {
    try {
      const bc = new BroadcastChannel("homeboy-stock-sync");
      bc.postMessage({ type: "STOCK_UPDATED", timestamp: Date.now() });
      bc.close();
    } catch (e) {
      // ignore
    }
    try {
      localStorage.setItem("hb_stock_updated", Date.now().toString());
    } catch (e) {
      // ignore
    }
  }
}

  // Products state list
  const [products, setProducts] = useState<AdminProduct[]>([
    {
      id: "tee-white",
      sku: "TEE • LOGO-001",
      name: "WHITE HOMEBOY LOGO TEE",
      price: "RM 99",
      shirtColor: "#ffffff",
      logoColor: "#000000",
      stock: "249 PIECES",
      sizes: ["S", "M", "L", "XL", "XXL"],
      category: "TEES",
    },
    {
      id: "tee-black",
      sku: "TEE • LOGO-001",
      name: "BLACK HOMEBOY LOGO TEE",
      price: "RM 99",
      shirtColor: "#171717",
      logoColor: "#ffffff",
      stock: "248 PIECES",
      sizes: ["S", "M", "L", "XL", "XXL"],
      category: "TEES",
    },
    {
      id: "tee-brown",
      sku: "TEE • LOGO-001",
      name: "BROWN HOMEBOY LOGO TEE",
      price: "RM 99",
      shirtColor: "#5c3317",
      logoColor: "#ffffff",
      stock: "249 PIECES",
      sizes: ["S", "M", "L", "XL", "XXL"],
      category: "TEES",
    },
    {
      id: "shorts-green",
      sku: "SHORTS • LOGO-002",
      name: "GREEN HOMEBOY LOGO SHORTS",
      price: "RM 109",
      shirtColor: "#15803d",
      logoColor: "#ffffff",
      stock: "250 PIECES",
      sizes: ["S", "M", "L", "XL", "XXL"],
      category: "SHORTS",
    },
    {
      id: "shorts-blue",
      sku: "SHORTS • LOGO-002",
      name: "KLEIN BLUE HOMEBOY LOGO SHORTS",
      price: "RM 109",
      shirtColor: "#1d4ed8",
      logoColor: "#ffffff",
      stock: "250 PIECES",
      sizes: ["S", "M", "L", "XL", "XXL"],
      category: "SHORTS",
    },
  ]);

  // Fetch products from TiDB Cloud
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            sku: p.sku || `${p.category} • LOGO-001`,
            name: p.name.toUpperCase(),
            price: p.price.startsWith("RM") ? p.price : `RM ${p.priceNumber || 99}`,
            shirtColor: p.colorHex || "#ffffff",
            logoColor: p.colorHex === "#ffffff" ? "#000000" : "#ffffff",
            stock: `${p.stock ?? 250} PIECES`,
            rawStock: p.stock ?? 250,
            stockAllocation: p.stockAllocation || { S: 50, M: 50, L: 50, XL: 50, XXL: 50 },
            sizes: p.sizes || ["S", "M", "L", "XL", "XXL"],
            category: p.category || "TEES",
            frontImage: p.frontImage || null,
            backImage: p.backImage || null,
          }));
          setProducts(mapped);
        }
      })
      .catch((err) => console.log("Cached admin products:", err));
  }, []);

  // Cloudflare R2 Media Modal States
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaSelectTarget, setMediaSelectTarget] = useState<
    "new-front" | "new-back" | "edit-front" | "edit-back" | null
  >(null);

  // Form states for Publish New Piece modal
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("99");
  const [newModelId, setNewModelId] = useState("LOGO-001");
  const [newSegment, setNewSegment] = useState("TEE");
  const [newNarrative, setNewNarrative] = useState("");
  const [newShirtColor, setNewShirtColor] = useState("#ffffff");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);

  // Form states for MODIFY PIECE modal
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("WHITE HOMEBOY LOGO TEE");
  const [editPrice, setEditPrice] = useState("99");
  const [editModelId, setEditModelId] = useState("LOGO-001");
  const [editSegment, setEditSegment] = useState("TEE");
  const [editNarrative, setEditNarrative] = useState(
    "- OVERSIZED FIT\n- 230 GMS 100% COTTON\n- WHITE\n- ALL SALES ARE FINAL NO RETURN NO REFUNDS"
  );
  const [editShirtColor, setEditShirtColor] = useState("#ffffff");
  const [editFrontImage, setEditFrontImage] = useState<string | null>(null);
  const [editBackImage, setEditBackImage] = useState<string | null>(null);
  const [isUploadingEditFront, setIsUploadingEditFront] = useState(false);
  const [isUploadingEditBack, setIsUploadingEditBack] = useState(false);

  const [editStockAllocation, setEditStockAllocation] = useState({
    S: 49,
    M: 50,
    L: 50,
    XL: 50,
    XXL: 50,
  });

  const [stockAllocation, setStockAllocation] = useState({
    S: 50,
    M: 50,
    L: 50,
    XL: 50,
    XXL: 50,
  });

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const editFrontInputRef = useRef<HTMLInputElement>(null);
  const editBackInputRef = useRef<HTMLInputElement>(null);

  const handleStockChange = (size: "S" | "M" | "L" | "XL" | "XXL", val: string) => {
    const num = parseInt(val) || 0;
    setStockAllocation((prev) => ({ ...prev, [size]: num }));
  };

  const handleEditStockChange = (size: "S" | "M" | "L" | "XL" | "XXL", val: string) => {
    const num = parseInt(val) || 0;
    setEditStockAllocation((prev) => ({ ...prev, [size]: num }));
  };

  // Upload file helper sending to /api/upload (Cloudflare R2)
  const uploadImageFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "products");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to upload image to Cloudflare R2");
    }

    return data.url;
  };

  // Upload handler for ADD NEW PIECE
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "front") setIsUploadingFront(true);
    else setIsUploadingBack(true);

    try {
      const url = await uploadImageFile(file);
      if (type === "front") setFrontImage(url);
      else setBackImage(url);
    } catch (err: any) {
      alert(err.message || "Failed to upload to Cloudflare R2");
    } finally {
      if (type === "front") setIsUploadingFront(false);
      else setIsUploadingBack(false);
      e.target.value = "";
    }
  };

  // Upload handler for MODIFY PIECE
  const handleEditImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "front") setIsUploadingEditFront(true);
    else setIsUploadingEditBack(true);

    try {
      const url = await uploadImageFile(file);
      if (type === "front") setEditFrontImage(url);
      else setEditBackImage(url);
    } catch (err: any) {
      alert(err.message || "Failed to upload to Cloudflare R2");
    } finally {
      if (type === "front") setIsUploadingEditFront(false);
      else setIsUploadingEditBack(false);
      e.target.value = "";
    }
  };

  const handleSelectFromR2 = (url: string) => {
    if (mediaSelectTarget === "new-front") setFrontImage(url);
    else if (mediaSelectTarget === "new-back") setBackImage(url);
    else if (mediaSelectTarget === "edit-front") setEditFrontImage(url);
    else if (mediaSelectTarget === "edit-back") setEditBackImage(url);
    setMediaSelectTarget(null);
  };

  // Open Edit Modal with pre-filled item data
  const handleOpenEditModal = (item: any) => {
    setEditId(item.id);
    setEditTitle(item.name);
    setEditPrice(item.price.replace("RM ", "").trim());
    setEditShirtColor(item.shirtColor || "#ffffff");
    setEditFrontImage(item.frontImage || null);
    setEditBackImage(item.backImage || null);

    const skuParts = (item.sku || "").split("•");
    setEditSegment(skuParts[0]?.trim() || "TEE");
    setEditModelId(skuParts[1]?.trim() || "LOGO-001");

    if (item.category === "SHORTS" || item.name.includes("SHORTS")) {
      setEditNarrative(
        "- RELAXED FIT DOUBLE LAYER MESH SHORT\n- 100% POLYESTER\n- ABOVE KNEE\n- ALL SALES ARE FINAL NO RETURN NO REFUNDS"
      );
    } else {
      setEditNarrative(
        "- OVERSIZED FIT\n- 230 GMS 100% COTTON\n- HEAVYWEIGHT STREETWEAR DRAPE\n- ALL SALES ARE FINAL NO RETURN NO REFUNDS"
      );
    }

    setEditStockAllocation(
      item.stockAllocation || {
        S: item.rawStock !== undefined ? Math.floor(item.rawStock / 5) : 50,
        M: item.rawStock !== undefined ? Math.floor(item.rawStock / 5) : 50,
        L: item.rawStock !== undefined ? Math.floor(item.rawStock / 5) : 50,
        XL: item.rawStock !== undefined ? Math.floor(item.rawStock / 5) : 50,
        XXL: item.rawStock !== undefined ? Math.floor(item.rawStock / 5) : 50,
      }
    );

    setShowEditModal(true);
  };

  // Commit updates handler for MODIFY PIECE modal
  const handleCommitUpdates = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalStock =
      editStockAllocation.S +
      editStockAllocation.M +
      editStockAllocation.L +
      editStockAllocation.XL +
      editStockAllocation.XXL;

    const finalCategory = (editSegment || "TEES").toUpperCase().trim();
    const finalType =
      finalCategory === "SHORTS" || finalCategory === "PANTS"
        ? "shorts"
        : finalCategory === "HATS" || finalCategory === "HAT"
        ? "hat"
        : "tee";

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === editId) {
          return {
            ...p,
            name: editTitle.toUpperCase(),
            price: `RM ${editPrice}`,
            sku: `${finalCategory} • ${editModelId}`,
            stock: `${totalStock} PIECES`,
            rawStock: totalStock,
            stockAllocation: editStockAllocation,
            shirtColor: editShirtColor,
            logoColor: editShirtColor === "#ffffff" ? "#000000" : "#ffffff",
            category: finalCategory,
            frontImage: editFrontImage,
            backImage: editBackImage,
          };
        }
        return p;
      })
    );

    setShowEditModal(false);
    notifyStockSync();

    // Save to TiDB Cloud
    try {
      await fetch(`/api/products/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editTitle,
          category: finalCategory,
          price: `${editPrice}.00 MYR`,
          priceNumber: Number(editPrice),
          sku: `HB-001-${editModelId}`,
          type: finalType,
          colorHex: editShirtColor,
          description: editNarrative.split("\n").filter((l) => l.trim()),
          stock: totalStock,
          stockAllocation: editStockAllocation,
          frontImage: editFrontImage,
          backImage: editBackImage,
        }),
      });
      notifyStockSync();
    } catch (err) {
      console.log("Updated locally:", err);
    }
  };

  const handleLaunchPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("Please enter official product title");
      return;
    }

    const totalStock =
      stockAllocation.S +
      stockAllocation.M +
      stockAllocation.L +
      stockAllocation.XL +
      stockAllocation.XXL;

    const finalCategory = (newSegment || "TEES").toUpperCase().trim();
    const finalType =
      finalCategory === "SHORTS" || finalCategory === "PANTS"
        ? "shorts"
        : finalCategory === "HATS" || finalCategory === "HAT"
        ? "hat"
        : "tee";

    const newId = `hb-${Date.now()}`;
    const newProduct = {
      id: newId,
      sku: `${finalCategory} • ${newModelId}`,
      name: newTitle.toUpperCase(),
      price: `RM ${newPrice}`,
      shirtColor: newShirtColor,
      logoColor: newShirtColor === "#ffffff" ? "#000000" : "#ffffff",
      stock: `${totalStock} PIECES`,
      rawStock: totalStock,
      stockAllocation,
      sizes: ["S", "M", "L", "XL", "XXL"],
      category: finalCategory,
      frontImage,
      backImage,
    };

    setProducts([newProduct, ...products]);
    setShowAddModal(false);
    notifyStockSync();

    // Save to TiDB Cloud
    try {
      const narrativeLines = newNarrative.trim()
        ? newNarrative.split("\n").filter((l) => l.trim())
        : finalCategory === "SHORTS" || finalCategory === "PANTS"
        ? [
            "RELAXED FIT DOUBLE LAYER MESH SHORT",
            "100% HIGH DENSITY POLYESTER",
            "DEEP ZIPPERED POCKETS WITH METALLIC HARDWARE",
            "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
          ]
        : finalCategory === "HATS" || finalCategory === "HAT"
        ? [
            "5-PANEL STREETWEAR STRUCTURED CAP",
            "100% COTTON CHINO TWILL",
            "HIGH DENSITY 3D EMBROIDERY",
            "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
          ]
        : [
            "HEAVYWEIGHT 260GSM 100% COMBED COTTON",
            "OVERSIZED BOXY STREETWEAR FIT",
            "HIGH DENSITY CHEST SILKSCREEN GRAPHIC",
            "ALL SALES ARE FINAL NO RETURN NO REFUNDS",
          ];

      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId,
          name: newTitle,
          category: finalCategory,
          price: `${newPrice}.00 MYR`,
          priceNumber: Number(newPrice),
          sku: `HB-001-${newModelId}`,
          type: finalType,
          colorName: "CUSTOM",
          colorHex: newShirtColor,
          sizes: ["S", "M", "L", "XL", "XXL"],
          description: narrativeLines,
          stock: totalStock,
          stockAllocation,
          frontImage,
          backImage,
        }),
      });
      notifyStockSync();
    } catch (err) {
      console.log("Saved locally:", err);
    }

    // Reset Form
    setNewTitle("");
    setNewPrice("99");
    setNewNarrative("");
    setNewShirtColor("#ffffff");
    setFrontImage(null);
    setBackImage(null);
  };

  const handleDelete = async (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    notifyStockSync();
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      notifyStockSync();
    } catch (err) {
      console.log("Deleted locally:", err);
    }
  };

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesCat =
      selectedCategory === "ALL COLLECTIONS" ||
      p.category.toUpperCase() === selectedCategory.toUpperCase() ||
      (selectedCategory === "TEES" && p.category === "TEES") ||
      (selectedCategory === "SHORTS" && p.category === "SHORTS");

    const matchesSearch =
      !q ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.price && p.price.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body antialiased selection:bg-black selection:text-white">
      {/* Top Navigation Header */}
      <Header title="PRODUCTS CENTER" />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Workspace */}
        <main className="flex-1 px-8 py-8 md:px-10 md:py-9 space-y-7 max-w-[1440px]">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9.5px] font-bold tracking-[0.24em] text-neutral-400 uppercase">
                INVENTORY CONTROL
              </p>
              <h1 className="font-display text-[28px] md:text-[32px] font-black italic tracking-[0.06em] text-black uppercase mt-0.5">
                PRODUCTS
              </h1>
            </div>

            {/* Actions: R2 Media Assets & + ADD NEW PIECE Button */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMediaSelectTarget(null);
                  setShowMediaModal(true);
                }}
                className="bg-white border border-black text-black px-4 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>R2 MEDIA ASSETS</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-black text-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>ADD NEW PIECE</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar Box */}
          <div className="bg-white border border-[#eaeaea] p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Search Box */}
              <div className="md:col-span-6 relative">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="SEARCH BY NAME OR MODEL..."
                    className="w-full pl-10 pr-8 py-2.5 bg-[#fafafa] border border-[#ebebeb] text-[10px] font-bold tracking-wider placeholder:text-neutral-400 text-black uppercase focus:outline-none focus:border-black transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 text-neutral-400 hover:text-black text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-4">
                <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                  INVENTORY CATEGORY
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-[#fafafa] border border-[#ebebeb] px-3.5 py-2.5 text-[10px] font-black tracking-wider text-black uppercase focus:outline-none cursor-pointer hover:border-neutral-400"
                  >
                    <option value="ALL COLLECTIONS">ALL COLLECTIONS</option>
                    <option value="TEES">TEES</option>
                    <option value="PANTS">PANTS</option>
                    <option value="SHORTS">SHORTS</option>
                    <option value="HATS">HATS</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Show Dropdown */}
              <div className="md:col-span-2">
                <label className="block text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                  SHOW
                </label>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-[#fafafa] border border-[#ebebeb] px-3.5 py-2.5 text-[10px] font-black tracking-wider text-black uppercase focus:outline-none cursor-pointer hover:border-neutral-400"
                  >
                    <option value={10}>10 PIECES</option>
                    <option value={25}>25 PIECES</option>
                    <option value={50}>50 PIECES</option>
                    <option value={100}>100 PIECES</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Items List */}
          <div className="space-y-4">
            {paginatedProducts.length === 0 ? (
              <div className="bg-white border border-[#eaeaea] p-12 text-center text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                NO PRODUCTS FOUND MATCHING "{searchQuery.toUpperCase()}"
              </div>
            ) : (
              paginatedProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#eaeaea] p-5 hover:border-neutral-300 transition-all shadow-2xs"
              >
                <div className="grid grid-cols-12 items-center gap-4">
                  {/* Left Group: Grip + Shirt Thumbnail + Title & SKU */}
                  <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                    {/* Drag Icon */}
                    <GripVertical className="w-4 h-4 text-neutral-300 shrink-0 cursor-grab" />

                    {/* Thumbnail Box */}
                    <div className="w-16 h-16 bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center p-1 shrink-0 overflow-hidden relative">
                      {item.frontImage ? (
                        <img
                          src={item.frontImage}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ShirtGraphic
                          type={
                            item.category === "SHORTS" || item.category === "PANTS" || (item.sku && item.sku.includes("SHORTS"))
                              ? "shorts"
                              : item.category === "HATS" || item.category === "HAT" || (item.sku && item.sku.includes("HAT"))
                              ? "hat"
                              : "tee"
                          }
                          color={item.shirtColor}
                          logoColor={item.logoColor}
                        />
                      )}
                      {item.frontImage && (
                        <span className="absolute bottom-0 right-0 bg-black text-[6.5px] font-black text-white px-1 leading-tight tracking-widest uppercase">
                          R2
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase">
                        {item.sku}
                      </div>
                      <div className="font-display font-black text-xs md:text-sm tracking-wide text-black uppercase mt-0.5 truncate">
                        {item.name}
                      </div>
                      <div className="text-[9.5px] font-bold tracking-wider text-neutral-500 uppercase mt-0.5">
                        {item.price}
                      </div>
                    </div>
                  </div>

                  {/* Right Group: Sizing Matrix (col 3) + Inventory Units (col 2) + Actions (col 1) */}
                  <div className="col-span-12 md:col-span-6 flex items-center justify-between md:justify-end gap-6 md:gap-10">
                    {/* Sizing Matrix */}
                    <div className="shrink-0">
                      <div className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                        SIZING MATRIX
                      </div>
                      <div className="flex items-center gap-1">
                        {item.sizes.map((size) => (
                          <div
                            key={size}
                            className="min-w-[24px] h-[24px] px-1 border border-black flex items-center justify-center text-[9px] font-black text-black bg-white shrink-0"
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Inventory Units */}
                    <div className="shrink-0 min-w-[90px]">
                      <div className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                        INVENTORY UNITS
                      </div>
                      <div
                        className={`font-display font-black italic text-xs tracking-wider whitespace-nowrap ${
                          (item.rawStock ?? parseInt(item.stock) ?? 0) <= 0
                            ? "text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5"
                            : "text-[#16a34a]"
                        }`}
                      >
                        {(item.rawStock ?? parseInt(item.stock) ?? 0) <= 0
                          ? "0 PIECES (SOLD OUT)"
                          : item.stock}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit Piece"
                        className="w-8 h-8 border border-[#e5e5e5] hover:border-black flex items-center justify-center text-neutral-400 hover:text-black transition-all bg-white cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 stroke-[1.8]" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete Piece"
                        className="w-8 h-8 border border-[#e5e5e5] hover:border-rose-500 flex items-center justify-center text-neutral-400 hover:text-rose-500 transition-all bg-white cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          </div>

          {/* ========================================================================= */}
          {/* MODIFY PIECE MODAL - 100% Exact Copy of Reference Image                  */}
          {/* ========================================================================= */}
          {showEditModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white border border-neutral-200 max-w-3xl w-full my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="px-8 py-5 border-b border-[#f0f0f0] flex items-center justify-between">
                  <h2 className="font-display font-black italic text-lg md:text-xl tracking-wider text-black uppercase">
                    MODIFY PIECE
                  </h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-neutral-400 hover:text-black transition-colors cursor-pointer p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCommitUpdates} className="p-8 space-y-6">
                  {/* Top Two Asset Panels: Primary Front Silhouette & Secondary Back Vision */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Front Silhouette */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                          PRIMARY FRONT SILHOUETTE
                        </label>
                        <span className="text-[7.5px] font-black text-neutral-400 tracking-wider uppercase">
                          CLOUDFLARE R2
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={editFrontInputRef}
                        onChange={(e) => handleEditImageUpload(e, "front")}
                        className="hidden"
                      />
                      <div className="h-64 bg-white border border-dashed border-[#e5e5e5] hover:border-black flex flex-col items-center justify-center relative p-4 group transition-all">
                        {isUploadingEditFront ? (
                          <div className="flex flex-col items-center justify-center gap-2 text-black">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span className="text-[8.5px] font-black tracking-widest uppercase">
                              UPLOADING TO R2...
                            </span>
                          </div>
                        ) : editFrontImage ? (
                          <>
                            <img
                              src={editFrontImage}
                              alt="Edit Front Silhouette"
                              className="max-h-52 object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => setEditFrontImage(null)}
                              title="Remove photo"
                              className="absolute top-3 right-3 w-6 h-6 bg-black text-white flex items-center justify-center cursor-pointer hover:bg-red-600 transition-all shadow-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => editFrontInputRef.current?.click()}
                                className="bg-black/90 text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-1 hover:bg-black transition-all shadow-xs cursor-pointer"
                              >
                                REPLACE
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaSelectTarget("edit-front");
                                  setShowMediaModal(true);
                                }}
                                className="bg-white border border-black text-black text-[8px] font-black uppercase tracking-wider px-2.5 py-1 hover:bg-neutral-100 transition-all shadow-xs cursor-pointer"
                              >
                                R2 LIBRARY
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <ModalFrontVisual
                              type={
                                editSegment.toUpperCase() === "SHORTS" || editSegment.toUpperCase() === "PANTS"
                                  ? "shorts"
                                  : editSegment.toUpperCase() === "HATS" || editSegment.toUpperCase() === "HAT"
                                  ? "hat"
                                  : "tee"
                              }
                              colorHex={editShirtColor}
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity backdrop-blur-[1px]">
                              <button
                                type="button"
                                onClick={() => editFrontInputRef.current?.click()}
                                className="w-9 h-9 rounded-full bg-white shadow-sm border border-neutral-200 flex items-center justify-center text-black hover:scale-105 transition-transform cursor-pointer"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => editFrontInputRef.current?.click()}
                                className="text-[8px] font-black tracking-widest text-black uppercase bg-white/95 px-2.5 py-1 shadow-xs border border-neutral-200 hover:bg-black hover:text-white transition-all cursor-pointer"
                              >
                                UPLOAD PHOTO TO R2
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaSelectTarget("edit-front");
                                  setShowMediaModal(true);
                                }}
                                className="text-[7.5px] font-black tracking-widest text-neutral-600 uppercase bg-white/90 px-2 py-0.5 border border-neutral-200 hover:text-black cursor-pointer"
                              >
                                OR PICK FROM R2
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Secondary Back Vision */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                          SECONDARY BACK VISION
                        </label>
                        <span className="text-[7.5px] font-black text-neutral-400 tracking-wider uppercase">
                          CLOUDFLARE R2
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={editBackInputRef}
                        onChange={(e) => handleEditImageUpload(e, "back")}
                        className="hidden"
                      />
                      <div className="h-64 bg-white border border-dashed border-[#e5e5e5] hover:border-black flex flex-col items-center justify-center relative p-4 group transition-all">
                        {isUploadingEditBack ? (
                          <div className="flex flex-col items-center justify-center gap-2 text-black">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span className="text-[8.5px] font-black tracking-widest uppercase">
                              UPLOADING TO R2...
                            </span>
                          </div>
                        ) : editBackImage ? (
                          <>
                            <img
                              src={editBackImage}
                              alt="Edit Back Vision"
                              className="max-h-52 object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => setEditBackImage(null)}
                              title="Remove photo"
                              className="absolute top-3 right-3 w-6 h-6 bg-black text-white flex items-center justify-center cursor-pointer hover:bg-red-600 transition-all shadow-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => editBackInputRef.current?.click()}
                                className="bg-black/90 text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-1 hover:bg-black transition-all shadow-xs cursor-pointer"
                              >
                                REPLACE
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaSelectTarget("edit-back");
                                  setShowMediaModal(true);
                                }}
                                className="bg-white border border-black text-black text-[8px] font-black uppercase tracking-wider px-2.5 py-1 hover:bg-neutral-100 transition-all shadow-xs cursor-pointer"
                              >
                                R2 LIBRARY
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <ModalBackVisual
                              type={
                                editSegment.toUpperCase() === "SHORTS" || editSegment.toUpperCase() === "PANTS"
                                  ? "shorts"
                                  : editSegment.toUpperCase() === "HATS" || editSegment.toUpperCase() === "HAT"
                                  ? "hat"
                                  : "tee"
                              }
                              colorHex={editShirtColor}
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity backdrop-blur-[1px]">
                              <button
                                type="button"
                                onClick={() => editBackInputRef.current?.click()}
                                className="w-9 h-9 rounded-full bg-white shadow-sm border border-neutral-200 flex items-center justify-center text-black hover:scale-105 transition-transform cursor-pointer"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => editBackInputRef.current?.click()}
                                className="text-[8px] font-black tracking-widest text-black uppercase bg-white/95 px-2.5 py-1 shadow-xs border border-neutral-200 hover:bg-black hover:text-white transition-all cursor-pointer"
                              >
                                UPLOAD PHOTO TO R2
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaSelectTarget("edit-back");
                                  setShowMediaModal(true);
                                }}
                                className="text-[7.5px] font-black tracking-widest text-neutral-600 uppercase bg-white/90 px-2 py-0.5 border border-neutral-200 hover:text-black cursor-pointer"
                              >
                                OR PICK FROM R2
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Left Column Fields */}
                    <div className="space-y-4">
                      {/* Official Product Title */}
                      <div>
                        <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                          OFFICIAL PRODUCT TITLE
                        </label>
                        <input
                          type="text"
                          required
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e5e5e5] text-[10px] font-bold tracking-wider text-black uppercase focus:outline-none focus:border-black"
                        />
                      </div>

                      {/* Price & Model ID */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                            PRICE (MYR)
                          </label>
                          <input
                            type="text"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e5e5e5] text-[10px] font-bold tracking-wider text-black uppercase focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                            MODEL ID
                          </label>
                          <input
                            type="text"
                            value={editModelId}
                            onChange={(e) => setEditModelId(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e5e5e5] text-[10px] font-bold tracking-wider text-black uppercase focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      {/* Collection Segment / Category Selection */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                            COLLECTION SEGMENT / CATEGORY
                          </label>
                          <span className="text-[8px] font-black text-black uppercase">
                            CURRENT: {editSegment.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditSegment("TEES")}
                            className={`py-2 px-2 border text-[9px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              editSegment.toUpperCase() === "TEES" || editSegment.toUpperCase() === "TEE"
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-[#fafafa] text-neutral-500 border-[#e5e5e5] hover:border-black hover:text-black"
                            }`}
                          >
                            <span>👕</span>
                            <span>TEES</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditSegment("PANTS")}
                            className={`py-2 px-2 border text-[9px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              editSegment.toUpperCase() === "PANTS"
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-[#fafafa] text-neutral-500 border-[#e5e5e5] hover:border-black hover:text-black"
                            }`}
                          >
                            <span>👖</span>
                            <span>PANTS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditSegment("SHORTS")}
                            className={`py-2 px-2 border text-[9px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              editSegment.toUpperCase() === "SHORTS"
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-[#fafafa] text-neutral-500 border-[#e5e5e5] hover:border-black hover:text-black"
                            }`}
                          >
                            <span>🩳</span>
                            <span>SHORTS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditSegment("HATS")}
                            className={`py-2 px-2 border text-[9px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              editSegment.toUpperCase() === "HATS" || editSegment.toUpperCase() === "HAT"
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-[#fafafa] text-neutral-500 border-[#e5e5e5] hover:border-black hover:text-black"
                            }`}
                          >
                            <span>🧢</span>
                            <span>HATS</span>
                          </button>
                        </div>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={editSegment}
                            onChange={(e) => setEditSegment(e.target.value.toUpperCase())}
                            placeholder="OR ENTER CUSTOM CATEGORY..."
                            className="w-full px-2.5 py-1.5 bg-[#fafafa] border border-[#e5e5e5] text-[9px] font-bold tracking-wider text-black uppercase focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      {/* Color Preset Palette */}
                      <div>
                        <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                          COLORWAY / SILHOUETTE PALETTE
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          {COLOR_PRESETS.map((cp) => (
                            <button
                              key={cp.hex}
                              type="button"
                              onClick={() => setEditShirtColor(cp.hex)}
                              title={cp.name}
                              className={`w-7 h-7 rounded-xs border transition-all cursor-pointer flex items-center justify-center ${
                                editShirtColor.toLowerCase() === cp.hex.toLowerCase()
                                  ? "border-black border-2 scale-110 shadow-sm"
                                  : "border-neutral-300 hover:border-black"
                              }`}
                              style={{ backgroundColor: cp.hex }}
                            />
                          ))}
                          <input
                            type="color"
                            value={editShirtColor.startsWith("#") ? editShirtColor : "#ffffff"}
                            onChange={(e) => setEditShirtColor(e.target.value)}
                            className="w-7 h-7 p-0 border border-neutral-300 rounded-xs cursor-pointer bg-transparent"
                            title="Custom Hex Color"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Narrative & Specs */}
                    <div>
                      <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                        NARRATIVE & SPECS (USE LINE BREAKS)
                      </label>
                      <textarea
                        rows={7}
                        value={editNarrative}
                        onChange={(e) => setEditNarrative(e.target.value)}
                        className="w-full h-[154px] px-3.5 py-2.5 bg-[#fafafa] border border-[#e5e5e5] text-[10px] font-bold tracking-wider text-black uppercase focus:outline-none focus:border-black resize-none font-mono leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Global Stock Allocation Section */}
                  <div className="pt-4 border-t border-[#f0f0f0]">
                    <div className="text-center mb-3">
                      <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
                        GLOBAL STOCK ALLOCATION
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      {(["S", "M", "L", "XL", "XXL"] as const).map((size) => (
                        <div key={size} className="space-y-1">
                          <div className="bg-[#fafafa] border border-[#e5e5e5] py-2 text-center text-[10px] font-black text-black">
                            {size}
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={editStockAllocation[size]}
                            onChange={(e) => handleEditStockChange(size, e.target.value)}
                            className="w-full bg-white border border-[#e5e5e5] py-2 text-center text-[10px] font-bold text-black focus:outline-none focus:border-black"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modal Action Buttons: COMMIT UPDATES & CANCEL */}
                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-black text-white py-3.5 text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
                    >
                      COMMIT UPDATES
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="border border-[#e5e5e5] px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-black hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PUBLISH NEW PIECE MODAL                                                   */}
          {/* ========================================================================= */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white border border-neutral-200 max-w-2xl w-full my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="px-8 py-5 border-b border-[#f0f0f0] flex items-center justify-between">
                  <h2 className="font-display font-black italic text-lg md:text-xl tracking-wider text-black uppercase">
                    PUBLISH NEW PIECE
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleLaunchPiece} className="p-8 space-y-6">
                  {/* Top Two Asset Uploaders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Front Silhouette */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                          PRIMARY FRONT SILHOUETTE
                        </label>
                        <span className="text-[7.5px] font-black text-neutral-400 tracking-wider uppercase">
                          CLOUDFLARE R2
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={frontInputRef}
                        onChange={(e) => handleImageUpload(e, "front")}
                        className="hidden"
                      />
                      <div className="h-64 bg-white border border-dashed border-[#e5e5e5] hover:border-black flex flex-col items-center justify-center relative p-4 group transition-all">
                        {isUploadingFront ? (
                          <div className="flex flex-col items-center justify-center gap-2 text-black">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span className="text-[8.5px] font-black tracking-widest uppercase">
                              UPLOADING TO R2...
                            </span>
                          </div>
                        ) : frontImage ? (
                          <>
                            <img
                              src={frontImage}
                              alt="Front Silhouette"
                              className="max-h-52 object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => setFrontImage(null)}
                              title="Remove photo"
                              className="absolute top-3 right-3 w-6 h-6 bg-black text-white flex items-center justify-center cursor-pointer hover:bg-red-600 transition-all shadow-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => frontInputRef.current?.click()}
                                className="bg-black/90 text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-1 hover:bg-black transition-all shadow-xs cursor-pointer"
                              >
                                REPLACE
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaSelectTarget("new-front");
                                  setShowMediaModal(true);
                                }}
                                className="bg-white border border-black text-black text-[8px] font-black uppercase tracking-wider px-2.5 py-1 hover:bg-neutral-100 transition-all shadow-xs cursor-pointer"
                              >
                                R2 LIBRARY
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <ModalFrontVisual
                              type={
                                newSegment.toUpperCase() === "SHORTS" || newSegment.toUpperCase() === "PANTS"
                                  ? "shorts"
                                  : newSegment.toUpperCase() === "HATS" || newSegment.toUpperCase() === "HAT"
                                  ? "hat"
                                  : "tee"
                              }
                              colorHex={newShirtColor}
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity backdrop-blur-[1px]">
                              <button
                                type="button"
                                onClick={() => frontInputRef.current?.click()}
                                className="w-9 h-9 rounded-full bg-white shadow-sm border border-neutral-200 flex items-center justify-center text-black hover:scale-105 transition-transform cursor-pointer"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => frontInputRef.current?.click()}
                                className="text-[8px] font-black tracking-widest text-black uppercase bg-white/95 px-2.5 py-1 shadow-xs border border-neutral-200 hover:bg-black hover:text-white transition-all cursor-pointer"
                              >
                                UPLOAD PHOTO TO R2
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaSelectTarget("new-front");
                                  setShowMediaModal(true);
                                }}
                                className="text-[7.5px] font-black tracking-widest text-neutral-600 uppercase bg-white/90 px-2 py-0.5 border border-neutral-200 hover:text-black cursor-pointer"
                              >
                                OR PICK FROM R2
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Secondary Back Vision */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                          SECONDARY BACK VISION
                        </label>
                        <span className="text-[7.5px] font-black text-neutral-400 tracking-wider uppercase">
                          CLOUDFLARE R2
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={backInputRef}
                        onChange={(e) => handleImageUpload(e, "back")}
                        className="hidden"
                      />
                      <div className="h-64 bg-white border border-dashed border-[#e5e5e5] hover:border-black flex flex-col items-center justify-center relative p-4 group transition-all">
                        {isUploadingBack ? (
                          <div className="flex flex-col items-center justify-center gap-2 text-black">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span className="text-[8.5px] font-black tracking-widest uppercase">
                              UPLOADING TO R2...
                            </span>
                          </div>
                        ) : backImage ? (
                          <>
                            <img
                              src={backImage}
                              alt="Back Vision"
                              className="max-h-52 object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => setBackImage(null)}
                              title="Remove photo"
                              className="absolute top-3 right-3 w-6 h-6 bg-black text-white flex items-center justify-center cursor-pointer hover:bg-red-600 transition-all shadow-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => backInputRef.current?.click()}
                                className="bg-black/90 text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-1 hover:bg-black transition-all shadow-xs cursor-pointer"
                              >
                                REPLACE
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaSelectTarget("new-back");
                                  setShowMediaModal(true);
                                }}
                                className="bg-white border border-black text-black text-[8px] font-black uppercase tracking-wider px-2.5 py-1 hover:bg-neutral-100 transition-all shadow-xs cursor-pointer"
                              >
                                R2 LIBRARY
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <ModalBackVisual
                              type={
                                newSegment.toUpperCase() === "SHORTS" || newSegment.toUpperCase() === "PANTS"
                                  ? "shorts"
                                  : newSegment.toUpperCase() === "HATS" || newSegment.toUpperCase() === "HAT"
                                  ? "hat"
                                  : "tee"
                              }
                              colorHex={newShirtColor}
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity backdrop-blur-[1px]">
                              <button
                                type="button"
                                onClick={() => backInputRef.current?.click()}
                                className="w-9 h-9 rounded-full bg-white shadow-sm border border-neutral-200 flex items-center justify-center text-black hover:scale-105 transition-transform cursor-pointer"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => backInputRef.current?.click()}
                                className="text-[8px] font-black tracking-widest text-black uppercase bg-white/95 px-2.5 py-1 shadow-xs border border-neutral-200 hover:bg-black hover:text-white transition-all cursor-pointer"
                              >
                                UPLOAD PHOTO TO R2
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaSelectTarget("new-back");
                                  setShowMediaModal(true);
                                }}
                                className="text-[7.5px] font-black tracking-widest text-neutral-600 uppercase bg-white/90 px-2 py-0.5 border border-neutral-200 hover:text-black cursor-pointer"
                              >
                                OR PICK FROM R2
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column Fields */}
                    <div className="space-y-4">
                      {/* Official Product Title */}
                      <div>
                        <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                          OFFICIAL PRODUCT TITLE
                        </label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. HOMEBOY RETRO LOGO TEE"
                          className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e5e5e5] text-[10px] font-bold tracking-wider text-black uppercase focus:outline-none focus:border-black"
                        />
                      </div>

                      {/* Price & Model ID */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                            PRICE (MYR)
                          </label>
                          <input
                            type="text"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="99"
                            className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e5e5e5] text-[10px] font-bold tracking-wider text-black uppercase focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                            MODEL ID
                          </label>
                          <input
                            type="text"
                            value={newModelId}
                            onChange={(e) => setNewModelId(e.target.value)}
                            placeholder="LOGO-001"
                            className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e5e5e5] text-[10px] font-bold tracking-wider text-black uppercase focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      {/* Collection Segment / Category Selection */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                            COLLECTION SEGMENT / CATEGORY
                          </label>
                          <span className="text-[8px] font-black text-black uppercase">
                            SELECTED: {newSegment.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setNewSegment("TEES");
                              if (!newNarrative || newNarrative.includes("MESH SHORT") || newNarrative.includes("CARGO")) {
                                setNewNarrative("- OVERSIZED BOXY FIT\n- 260 GSM 100% COMBED COTTON\n- SILKSCREEN CHEST GRAPHIC\n- ALL SALES ARE FINAL NO RETURN NO REFUNDS");
                              }
                            }}
                            className={`py-2 px-2 border text-[9px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              newSegment.toUpperCase() === "TEES" || newSegment.toUpperCase() === "TEE"
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-[#fafafa] text-neutral-500 border-[#e5e5e5] hover:border-black hover:text-black"
                            }`}
                          >
                            <span>👕</span>
                            <span>TEES</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewSegment("PANTS");
                              if (!newNarrative || newNarrative.includes("COTTON") || newNarrative.includes("MESH SHORT")) {
                                setNewNarrative("- WIDE LEG BAGGY STREETWEAR PANTS\n- HEAVYWEIGHT COTTON TWILL\n- DEEP CARGO UTILITY POCKETS\n- ALL SALES ARE FINAL NO RETURN NO REFUNDS");
                              }
                            }}
                            className={`py-2 px-2 border text-[9px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              newSegment.toUpperCase() === "PANTS"
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-[#fafafa] text-neutral-500 border-[#e5e5e5] hover:border-black hover:text-black"
                            }`}
                          >
                            <span>👖</span>
                            <span>PANTS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewSegment("SHORTS");
                              if (!newNarrative || newNarrative.includes("COTTON") || newNarrative.includes("CARGO")) {
                                setNewNarrative("- RELAXED FIT DOUBLE LAYER MESH SHORT\n- 100% POLYESTER\n- ABOVE KNEE WITH DRAWSTRINGS\n- ALL SALES ARE FINAL NO RETURN NO REFUNDS");
                              }
                            }}
                            className={`py-2 px-2 border text-[9px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              newSegment.toUpperCase() === "SHORTS"
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-[#fafafa] text-neutral-500 border-[#e5e5e5] hover:border-black hover:text-black"
                            }`}
                          >
                            <span>🩳</span>
                            <span>SHORTS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewSegment("HATS");
                              if (!newNarrative || newNarrative.includes("COTTON") || newNarrative.includes("MESH SHORT")) {
                                setNewNarrative("- 5-PANEL STREETWEAR STRUCTURED CAP\n- 100% COTTON CHINO TWILL\n- HIGH DENSITY 3D EMBROIDERY\n- ALL SALES ARE FINAL NO RETURN NO REFUNDS");
                              }
                            }}
                            className={`py-2 px-2 border text-[9px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              newSegment.toUpperCase() === "HATS" || newSegment.toUpperCase() === "HAT"
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-[#fafafa] text-neutral-500 border-[#e5e5e5] hover:border-black hover:text-black"
                            }`}
                          >
                            <span>🧢</span>
                            <span>HATS</span>
                          </button>
                        </div>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={newSegment}
                            onChange={(e) => setNewSegment(e.target.value.toUpperCase())}
                            placeholder="OR ENTER CUSTOM CATEGORY..."
                            className="w-full px-2.5 py-1.5 bg-[#fafafa] border border-[#e5e5e5] text-[9px] font-bold tracking-wider text-black uppercase focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      {/* Color Preset Palette */}
                      <div>
                        <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                          COLORWAY / SILHOUETTE PALETTE
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          {COLOR_PRESETS.map((cp) => (
                            <button
                              key={cp.hex}
                              type="button"
                              onClick={() => setNewShirtColor(cp.hex)}
                              title={cp.name}
                              className={`w-7 h-7 rounded-xs border transition-all cursor-pointer flex items-center justify-center ${
                                newShirtColor.toLowerCase() === cp.hex.toLowerCase()
                                  ? "border-black border-2 scale-110 shadow-sm"
                                  : "border-neutral-300 hover:border-black"
                              }`}
                              style={{ backgroundColor: cp.hex }}
                            />
                          ))}
                          <input
                            type="color"
                            value={newShirtColor.startsWith("#") ? newShirtColor : "#ffffff"}
                            onChange={(e) => setNewShirtColor(e.target.value)}
                            className="w-7 h-7 p-0 border border-neutral-300 rounded-xs cursor-pointer bg-transparent"
                            title="Custom Hex Color"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Narrative & Specs */}
                    <div>
                      <label className="block text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                        NARRATIVE & SPECS (USE LINE BREAKS)
                      </label>
                      <textarea
                        rows={8}
                        value={newNarrative}
                        onChange={(e) => setNewNarrative(e.target.value)}
                        placeholder="LINE 1: OVERSIZED FIT LINE 2: 100% COTTON"
                        className="w-full h-[182px] px-3.5 py-2.5 bg-[#fafafa] border border-[#e5e5e5] text-[10px] font-bold tracking-wider text-black placeholder:text-neutral-400 uppercase focus:outline-none focus:border-black resize-none"
                      />
                    </div>
                  </div>

                  {/* Global Stock Allocation Section */}
                  <div className="pt-2 border-t border-[#f0f0f0]">
                    <div className="text-center mb-3">
                      <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
                        GLOBAL STOCK ALLOCATION
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {(["S", "M", "L", "XL", "XXL"] as const).map((size) => (
                        <div key={size} className="space-y-1">
                          <div className="bg-[#fafafa] border border-[#e5e5e5] py-2 text-center text-[10px] font-black text-black">
                            {size}
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={stockAllocation[size]}
                            onChange={(e) => handleStockChange(size, e.target.value)}
                            className="w-full bg-white border border-[#e5e5e5] py-2 text-center text-[10px] font-bold text-black focus:outline-none focus:border-black"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-black text-white py-3.5 text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
                    >
                      LAUNCH PIECE
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="border border-[#e5e5e5] px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-black hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Cloudflare R2 Media Asset Manager Modal */}
          <R2MediaModal
            isOpen={showMediaModal}
            onClose={() => {
              setShowMediaModal(false);
              setMediaSelectTarget(null);
            }}
            selectMode={Boolean(mediaSelectTarget)}
            onSelectImage={handleSelectFromR2}
          />
        </main>
      </div>
    </div>
  );
}
