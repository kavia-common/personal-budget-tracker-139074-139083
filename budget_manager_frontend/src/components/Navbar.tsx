"use client";

import React from "react";
import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * Navbar component renders the top navigation with Neon Cyber styling.
 * Provides a consistent header bar used across the app.
 */
export default function Navbar(): React.ReactElement {
  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-500/20 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_#34d399]" />
            <span className="text-lg font-extrabold tracking-wide">
              <span className="text-white">Personal</span>{" "}
              <span className="text-emerald-400">Budget</span>{" "}
              <span className="text-white">Manager</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
              Neon Cyber
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              v1.0
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
