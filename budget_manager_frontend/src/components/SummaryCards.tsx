"use client";

import React from "react";
import { useBudgetData } from "@/hooks/useBudgetData";

/**
 * PUBLIC_INTERFACE
 * SummaryCards displays a row of KPI cards for total income, expenses, and balance.
 */
export default function SummaryCards() {
  const { totalIncome, totalExpenses, balance } = useBudgetData();

  const cards = [
    {
      label: "Total Income",
      value: totalIncome,
      color: "from-emerald-500/30 to-emerald-900/20",
      accent: "text-emerald-300",
      ring: "ring-emerald-500/40",
      prefix: "+",
    },
    {
      label: "Total Expenses",
      value: totalExpenses,
      color: "from-rose-500/30 to-rose-900/20",
      accent: "text-rose-300",
      ring: "ring-rose-500/40",
      prefix: "-",
    },
    {
      label: "Balance",
      value: balance,
      color: "from-cyan-500/30 to-indigo-900/20",
      accent: "text-cyan-300",
      ring: "ring-cyan-500/40",
      prefix: balance >= 0 ? "" : "-",
    },
  ];

  const formatCurrency = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD" });

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br ${c.color} p-4 ring-1 ${c.ring}`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wide text-slate-300">
              {c.label}
            </h3>
          </div>
          <p
            className={`mt-3 text-2xl font-extrabold tracking-tight ${c.accent}`}
          >
            {c.prefix}
            {formatCurrency(Math.abs(c.value))}
          </p>
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
        </div>
      ))}
    </section>
  );
}
