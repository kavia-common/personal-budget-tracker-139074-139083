"use client";

import React from "react";

/**
 * PUBLIC_INTERFACE
 * CategoryBadge renders a pill-styled badge for a category with Neon Cyber accents.
 */
export default function CategoryBadge({ name }: { name: string }) {
  const colorMap: Record<string, string> = {
    salary: "from-emerald-500/30 to-emerald-900/30 text-emerald-200 ring-emerald-400/40",
    food: "from-orange-500/30 to-amber-900/30 text-amber-200 ring-amber-400/40",
    transport:
      "from-cyan-500/30 to-sky-900/30 text-cyan-200 ring-cyan-400/40",
    shopping:
      "from-fuchsia-500/30 to-purple-900/30 text-fuchsia-200 ring-fuchsia-400/40",
    bills: "from-rose-500/30 to-rose-900/30 text-rose-200 ring-rose-400/40",
    other: "from-slate-600/40 to-slate-900/40 text-slate-200 ring-slate-400/30",
  };

  const key = name?.toLowerCase() || "other";
  const cls =
    colorMap[key] ||
    "from-slate-600/40 to-slate-900/40 text-slate-200 ring-slate-400/30";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-slate-700/70 bg-gradient-to-br px-3 py-1 text-xs font-bold ring-1 ${cls}`}
    >
      {name}
    </span>
  );
}
