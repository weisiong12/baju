"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("PLEASE ENTER ACCESS KEY");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("hb_admin_authenticated", "true");
        }
        router.push("/admin");
      } else {
        setError(data.message || "INVALID ACCESS KEY. PLEASE TRY AGAIN.");
      }
    } catch (err: any) {
      setError("NETWORK OR SERVER ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body antialiased selection:bg-black selection:text-white">
      {/* Top Navigation Header */}
      <Header title="ADMIN CONTROL CENTER" />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Center Canvas */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative min-h-[calc(100vh-60px)]">
          <div className="w-full max-w-[380px] flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Black Square Monogram Logo Box */}
            <div className="w-14 h-14 border-2 border-black bg-white text-black flex items-center justify-center font-display font-black italic text-2xl tracking-tighter">
              HB
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="font-display font-black italic text-2xl md:text-[26px] tracking-wide text-black uppercase">
                CONTROL CENTER
              </h1>
              <p className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
                AUTHORIZATION REQUIRED
              </p>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleAuthenticate} className="w-full space-y-4 pt-2">
              <div className="text-left space-y-1.5">
                <label className="block text-[8.5px] font-bold tracking-[0.22em] text-neutral-400 uppercase">
                  ACCESS KEY
                </label>
                <div className="relative flex items-center bg-[#fafafa] border border-[#e5e5e5] focus-within:border-black transition-colors">
                  <div className="pl-3.5 pr-2 flex items-center justify-center text-neutral-400">
                    <Lock className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ENTER PASSWORD..."
                    className="w-full py-3.5 pr-10 text-[10px] font-bold uppercase tracking-wider text-black bg-transparent placeholder:text-neutral-300 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-neutral-400 hover:text-black cursor-pointer p-1 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-[8.5px] font-bold tracking-wider text-red-500 uppercase text-left">
                  {error}
                </p>
              )}

              {/* Authenticate Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-neutral-800 py-3.5 text-[10px] font-black uppercase tracking-[0.25em] transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isLoading ? "AUTHENTICATING..." : "AUTHENTICATE —"}
              </button>
            </form>

            {/* Bottom Security Subtext */}
            <div className="pt-8 text-neutral-400 text-[8px] font-bold tracking-[0.22em] uppercase leading-relaxed">
              <p>SECURE ADMINISTRATIVE SESSION.</p>
              <p>UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
