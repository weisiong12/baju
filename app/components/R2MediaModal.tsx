"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  ExternalLink,
  Cloud,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface R2Item {
  key: string;
  url: string;
  size: number;
  lastModified?: string;
}

interface R2MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string) => void;
  selectMode?: boolean;
}

export default function R2MediaModal({
  isOpen,
  onClose,
  onSelectImage,
  selectMode = false,
}: R2MediaModalProps) {
  const [items, setItems] = useState<R2Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [recentUploadUrl, setRecentUploadUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/upload?prefix=products/&t=${Date.now()}`);
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (err: any) {
      console.error("Failed to load R2 assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchItems();
      setStatusMessage(null);
      setRecentUploadUrl(null);
    }
  }, [isOpen]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatusMessage({
        type: "error",
        text: "Please select an image file (JPG, PNG, WEBP, GIF, SVG, AVIF)",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(`Uploading ${file.name}...`);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setRecentUploadUrl(data.url);
      setStatusMessage({
        type: "success",
        text: `Photo uploaded successfully to Cloudflare R2!`,
      });

      // Refresh list
      await fetchItems();

      // If in select mode, auto select
      if (selectMode && onSelectImage) {
        onSelectImage(data.url);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to upload to Cloudflare R2",
      });
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleCopy = (url: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      const res = await fetch(`/api/upload?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((item) => item.key !== key));
        setDeleteConfirmKey(null);
        setStatusMessage({
          type: "success",
          text: "Photo removed from Cloudflare R2",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to delete file",
      });
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 max-w-4xl w-full my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f0f0f0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center">
              <Cloud className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black italic text-base md:text-lg tracking-wider text-black uppercase">
                  CLOUDFLARE R2 ASSET MANAGER
                </h2>
                <span className="flex items-center gap-1 text-[8px] font-black tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  BUCKET: CLOTH
                </span>
              </div>
              <p className="text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mt-0.5">
                HIGH-SPEED CLOUD STORAGE • PUB-C52E7B8C42B44D5C8CE9C706E856A2DD.R2.DEV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchItems}
              disabled={loading}
              title="Refresh assets"
              className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-3.5 border flex items-center justify-between text-[9.5px] font-bold tracking-wider uppercase ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-black bg-neutral-100 scale-[0.99]"
                : "border-[#e5e5e5] bg-[#fafafa] hover:border-black hover:bg-neutral-50/70"
            } relative`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-2.5">
              <div className="w-12 h-12 bg-white border border-[#e5e5e5] shadow-xs flex items-center justify-center text-black">
                {uploading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 stroke-[2]" />
                )}
              </div>

              <div>
                <p className="font-display font-black italic text-xs md:text-sm tracking-wider text-black uppercase">
                  {uploading
                    ? uploadProgress || "UPLOADING TO CLOUDFLARE R2..."
                    : "DRAG & DROP PHOTOS HERE OR CLICK TO BROWSE"}
                </p>
                <p className="text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase mt-0.5">
                  SUPPORTS JPG, PNG, WEBP, GIF, SVG, AVIF (UP TO 10MB)
                </p>
              </div>

              {!uploading && (
                <div className="pt-1">
                  <span className="bg-black text-white px-4 py-1.5 text-[8.5px] font-black tracking-widest uppercase hover:bg-neutral-800 transition-all inline-block shadow-xs">
                    SELECT FILE TO UPLOAD
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Upload Highlight */}
          {recentUploadUrl && (
            <div className="bg-[#fcfcfc] border border-black p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black tracking-widest text-emerald-700 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  JUST UPLOADED TO CLOUDFLARE R2
                </span>
                <button
                  onClick={() => handleCopy(recentUploadUrl, "recent")}
                  className="bg-black text-white px-2.5 py-1 text-[8px] font-black tracking-widest uppercase flex items-center gap-1 hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
                >
                  {copiedKey === "recent" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>COPIED URL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPY PUBLIC LINK</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white border border-[#e5e5e5] shrink-0 p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={recentUploadUrl}
                    alt="Uploaded Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    readOnly
                    value={recentUploadUrl}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#e5e5e5] text-[9.5px] font-mono text-neutral-700 select-all focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Gallery / Asset List Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                <h3 className="text-[9.5px] font-black tracking-[0.2em] text-neutral-700 uppercase">
                  BUCKET ASSETS ({items.length})
                </h3>
              </div>
              <span className="text-[8.5px] font-bold tracking-wider text-neutral-400 uppercase">
                AUTOMATICALLY HOSTED VIA R2 PUBLIC URL
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-[10px] font-black tracking-widest text-neutral-400 uppercase flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>FETCHING CLOUDFLARE R2 ASSETS...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="p-12 border border-dashed border-[#e5e5e5] text-center text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                NO ASSETS IN R2 BUCKET YET. UPLOAD YOUR FIRST PRODUCT PHOTO ABOVE.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {items.map((item) => {
                  const filename = item.key.split("/").pop() || item.key;
                  const isCopied = copiedKey === item.key;
                  const isConfirmingDelete = deleteConfirmKey === item.key;

                  return (
                    <div
                      key={item.key}
                      className="bg-white border border-[#eaeaea] hover:border-black transition-all group flex flex-col justify-between overflow-hidden shadow-2xs"
                    >
                      {/* Image Thumbnail */}
                      <div
                        onClick={() => {
                          if (selectMode && onSelectImage) {
                            onSelectImage(item.url);
                            onClose();
                          }
                        }}
                        className={`aspect-square w-full bg-[#fafafa] flex items-center justify-center p-2 relative overflow-hidden ${
                          selectMode ? "cursor-pointer" : ""
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={filename}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                          {selectMode ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (onSelectImage) {
                                  onSelectImage(item.url);
                                  onClose();
                                }
                              }}
                              className="bg-white text-black px-3 py-1 text-[8px] font-black uppercase tracking-wider hover:bg-neutral-200 transition-all cursor-pointer shadow-sm"
                            >
                              USE PHOTO
                            </button>
                          ) : (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-white text-black px-2.5 py-1 text-[8px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-neutral-200 transition-all cursor-pointer shadow-sm"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>VIEW</span>
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item.url, item.key);
                            }}
                            className="bg-black/90 border border-white/30 text-white px-2.5 py-1 text-[8px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-black transition-all cursor-pointer shadow-sm"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                                <span>COPIED</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-2.5 h-2.5" />
                                <span>COPY URL</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Footer Info & Actions */}
                      <div className="p-2.5 border-t border-[#f0f0f0] bg-white flex items-center justify-between gap-1.5">
                        <div className="min-w-0">
                          <p
                            title={filename}
                            className="text-[9px] font-bold text-black uppercase truncate tracking-wider"
                          >
                            {filename}
                          </p>
                          <p className="text-[7.5px] font-semibold text-neutral-400 uppercase">
                            {formatSize(item.size)}
                          </p>
                        </div>

                        {/* Delete action */}
                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleDelete(item.key)}
                              className="px-1.5 py-0.5 bg-red-600 text-white text-[7.5px] font-black uppercase tracking-wider hover:bg-red-700 cursor-pointer"
                            >
                              YES
                            </button>
                            <button
                              onClick={() => setDeleteConfirmKey(null)}
                              className="px-1.5 py-0.5 bg-neutral-200 text-black text-[7.5px] font-black uppercase tracking-wider hover:bg-neutral-300 cursor-pointer"
                            >
                              NO
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmKey(item.key)}
                            title="Delete file from R2"
                            className="text-neutral-300 hover:text-red-600 p-1 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#f0f0f0] bg-[#fafafa] flex items-center justify-between shrink-0">
          <span className="text-[8.5px] font-bold tracking-widest text-neutral-400 uppercase">
            CLOUD STORAGE ENGINE: CLOUDFLARE R2 (S3 API COMPATIBLE)
          </span>
          <button
            onClick={onClose}
            className="bg-black text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
