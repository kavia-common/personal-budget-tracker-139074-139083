"use client";

import React, { useMemo, useState } from "react";
import { useBudget } from "@/hooks/BudgetDataContext";

/**
 * PUBLIC_INTERFACE
 * Insights renders selectable category buttons for expense and income types,
 * and shows a neon-styled mini chart and total for the chosen category in a padded layout.
 * - Expense categories: food, shopping, groceries, gifts, personal, other
 * - Income categories: salary, bonus, gift, other
 */
export default function Insights(): React.ReactElement {
  const { transactions } = useBudget();

  // Required taxonomy (UI labels)
  const expenseCats = ["Food", "Shopping", "Groceries", "Gifts", "Personal", "Other"] as const;
  const incomeCats = ["Salary", "Bonus", "Gift", "Other"] as const;

  type ExpenseCat = (typeof expenseCats)[number];
  type IncomeCat = (typeof incomeCats)[number];

  // Current selection state
  const [selectedKind, setSelectedKind] = useState<"expense" | "income">("expense");
  const [selectedExpense, setSelectedExpense] = useState<ExpenseCat>("Food");
  const [selectedIncome, setSelectedIncome] = useState<IncomeCat>("Salary");

  // Robust text normalizer to map free-form descriptions to our categories
  const normalize = (s?: string) => (s || "").trim().toLowerCase();

  // Compute totals for expense categories
  const expenseTotals = useMemo(() => {
    const totals: Record<ExpenseCat, number> = {
      Food: 0,
      Shopping: 0,
      Groceries: 0,
      Gifts: 0,
      Personal: 0,
      Other: 0,
    };
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      const basis = normalize(t.description);
      const amount = Math.max(0, t.amount);
      if (basis.includes("food") || basis.includes("dining") || basis.includes("restaurant")) {
        totals.Food += amount;
      } else if (basis.includes("grocery") || basis.includes("groceries") || basis.includes("supermarket")) {
        totals.Groceries += amount;
      } else if (basis.includes("shop") || basis.includes("retail") || basis.includes("clothes")) {
        totals.Shopping += amount;
      } else if (basis.includes("gift")) {
        totals.Gifts += amount;
      } else if (basis.includes("personal") || basis.includes("self") || basis.includes("care")) {
        totals.Personal += amount;
      } else {
        totals.Other += amount;
      }
    }
    return totals;
  }, [transactions]);

  // Compute totals for income categories
  const incomeTotals = useMemo(() => {
    const totals: Record<IncomeCat, number> = {
      Salary: 0,
      Bonus: 0,
      Gift: 0,
      Other: 0,
    };
    for (const t of transactions) {
      if (t.type !== "income") continue;
      const basis = normalize(t.description);
      const amount = Math.max(0, t.amount);
      if (basis.includes("salary") || basis.includes("paycheck") || basis.includes("wage")) {
        totals.Salary += amount;
      } else if (basis.includes("bonus")) {
        totals.Bonus += amount;
      } else if (basis.includes("gift")) {
        totals.Gift += amount;
      } else {
        totals.Other += amount;
      }
    }
    return totals;
  }, [transactions]);

  // Selected label & total for display
  const selectedLabel = selectedKind === "expense" ? selectedExpense : selectedIncome;
  const selectedTotal =
    selectedKind === "expense" ? expenseTotals[selectedExpense] : incomeTotals[selectedIncome];

  // Determine bar width relative to max in the selected group
  const chartBarWidthPct = useMemo(() => {
    const values =
      selectedKind === "expense" ? Object.values(expenseTotals) : Object.values(incomeTotals);
    const max = Math.max(1, ...values);
    return Math.min(100, (selectedTotal / max) * 100);
  }, [selectedKind, selectedTotal, expenseTotals, incomeTotals]);

  const formatCurrency = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD" });

  // Toggle expense/income group
  const groupToggle = (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-700/80">
      {(["expense", "income"] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => setSelectedKind(k)}
          className={`px-3 py-2 text-xs font-bold capitalize transition ${
            selectedKind === k
              ? k === "expense"
                ? "bg-rose-500/30 text-white"
                : "bg-emerald-500/30 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700/80"
          }`}
          aria-pressed={selectedKind === k}
        >
          {k}
        </button>
      ))}
    </div>
  );

  // Expense category buttons
  const expenseButtons = (
    <div className="flex flex-wrap gap-2">
      {expenseCats.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setSelectedExpense(c)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
            selectedExpense === c
              ? "border-rose-400/50 bg-rose-500/20 text-rose-100 ring-1 ring-rose-400/40"
              : "border-slate-700/70 bg-slate-800/70 text-slate-300 hover:bg-slate-700/70"
          }`}
          aria-pressed={selectedExpense === c}
        >
          {c}
        </button>
      ))}
    </div>
  );

  // Income category buttons
  const incomeButtons = (
    <div className="flex flex-wrap gap-2">
      {incomeCats.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setSelectedIncome(c)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
            selectedIncome === c
              ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/40"
              : "border-slate-700/70 bg-slate-800/70 text-slate-300 hover:bg-slate-700/70"
          }`}
          aria-pressed={selectedIncome === c}
        >
          {c}
        </button>
      ))}
    </div>
  );

  return (
    <section className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">Insights</h3>
          <p className="text-xs text-slate-400">
            Tap a button to view a neon chart and total for the selected category.
          </p>
        </div>
        {groupToggle}
      </header>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {selectedKind === "expense" ? "Expense Categories" : "Income Categories"}
        </h4>
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3">
          {selectedKind === "expense" ? expenseButtons : incomeButtons}
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 space-y-2">
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`inline-block h-2 w-2 rounded-sm ${
                  selectedKind === "expense"
                    ? "bg-rose-400 shadow-[0_0_8px_#fb7185]"
                    : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                }`}
              />
              <span className="text-sm font-semibold text-slate-200">
                {selectedLabel}
              </span>
            </div>
            <span
              className={`text-xs sm:text-sm tabular-nums ${
                selectedKind === "expense" ? "text-rose-200" : "text-emerald-200"
              }`}
            >
              {formatCurrency(selectedTotal)}
            </span>
          </div>

          {/* Neon progress bar as the chart */}
          <div className="h-3.5 w-full rounded-full bg-slate-800/70 border border-slate-700 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                selectedKind === "expense" ? "bg-rose-400" : "bg-emerald-400"
              } relative`}
              style={{
                width: `${chartBarWidthPct}%`,
                boxShadow:
                  selectedKind === "expense"
                    ? "0 0 12px rgba(251, 113, 133, 0.9), inset 0 0 6px rgba(244, 63, 94, 0.6)"
                    : "0 0 12px rgba(52, 211, 153, 0.9), inset 0 0 6px rgba(16, 185, 129, 0.6)",
              }}
              aria-label={`${selectedLabel}: ${formatCurrency(selectedTotal)}`}
              role="img"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 40%)",
                  mixBlendMode: "screen",
                }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Tip: Switch between expense and income. Click a category to update.
          </div>
        </div>
      </div>
    </section>
  );
}
