"use client";

import React, { useMemo } from "react";
import { useBudgetData } from "@/hooks/useBudgetData";

/**
 * PUBLIC_INTERFACE
 * SpendingChart component renders a responsive neon-styled bar chart that visualizes
 * total expenses by category using flex/CSS (no chart libs).
 */
export function SpendingChart(): React.ReactElement {
  const { transactions } = useBudgetData();

  const totalsByCategory = useMemo(() => {
    const totals = new Map<string, number>();
    if (!transactions || transactions.length === 0) return totals;

    for (const t of transactions as Array<{ amount: number; category?: string; type?: string }>) {
      const isExpense =
        (typeof t.type === "string" && t.type === "expense") ||
        (typeof t.amount === "number" && t.amount < 0);

      if (!isExpense) continue;

      const category = (t.category || "Uncategorized").trim() || "Uncategorized";
      const amount = Math.abs(Number(t.amount) || 0);
      totals.set(category, (totals.get(category) || 0) + amount);
    }
    return totals;
  }, [transactions]);

  const data = useMemo(() => {
    const entries = Array.from(totalsByCategory.entries()).map(
      ([category, total]) => ({ category, total })
    );
    entries.sort((a, b) => b.total - a.total);
    return entries;
  }, [totalsByCategory]);

  const maxValue = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.max(...data.map((d) => d.total));
  }, [data]);

  return (
    <section
      aria-labelledby="spending-chart-title"
      className="rounded-xl border border-emerald-500/30 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2
          id="spending-chart-title"
          className="text-lg sm:text-xl font-bold text-white tracking-wide"
        >
          Spending by Category
        </h2>
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-sm bg-emerald-400 shadow-[0_0_8px_#34d399]"
            />
            Expense total
          </span>
        </div>
      </div>

      {(!transactions || transactions.length === 0) && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 p-6 text-center"
        >
          <p className="text-slate-300">
            No transactions yet. Add an expense to see your spending by category.
          </p>
        </div>
      )}

      {transactions && transactions.length > 0 && data.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 p-6 text-center"
        >
          <p className="text-slate-300">
            No expenses found. Add an expense to visualize your spending.
          </p>
        </div>
      )}

      {data.length > 0 && (
        <div
          role="img"
          aria-label="Bar chart showing spending totals by category"
          className="flex flex-col gap-3"
        >
          {data.map((d) => {
            const pct = maxValue > 0 ? (d.total / maxValue) * 100 : 0;
            return (
              <div key={d.category} className="flex flex-col gap-1">
                <div className="flex items-end justify-between gap-3">
                  <span className="text-slate-200 text-sm sm:text-base font-medium">
                    {d.category}
                  </span>
                  <span className="text-slate-300 text-xs sm:text-sm tabular-nums">
                    ${d.total.toFixed(2)}
                  </span>
                </div>
                <div className="h-3 sm:h-3.5 w-full rounded-full bg-slate-800/70 border border-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-400 relative"
                    aria-label={`${d.category}: $${d.total.toFixed(2)}`}
                    style={{
                      width: `${pct}%`,
                      boxShadow:
                        "0 0 12px rgba(52, 211, 153, 0.9), inset 0 0 6px rgba(16, 185, 129, 0.6)",
                    }}
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
              </div>
            );
          })}
          <div className="mt-2 text-xs text-slate-400">
            Tip: Hover over bars for details. Values are totals per category.
          </div>
        </div>
      )}
    </section>
  );
}

export default SpendingChart;
