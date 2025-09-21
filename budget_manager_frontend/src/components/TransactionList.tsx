"use client";

import React, { useMemo, useState } from "react";
import { useBudgetData } from "@/hooks/useBudgetData";
import CategoryBadge from "@/components/CategoryBadge";

/**
 * PUBLIC_INTERFACE
 * TransactionList renders the history of transactions with filtering and deletion.
 */
export default function TransactionList() {
  const { transactions, deleteTransaction, categories } = useBudgetData();
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of categories) map.set(c.id, c.name);
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    if (filter === "all") return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  const formatCurrency = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD" });

  return (
    <section className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 sm:p-5 ring-1 ring-emerald-500/20">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-wide text-slate-200">
          Transactions
        </h2>
        <div className="inline-flex overflow-hidden rounded-lg border border-slate-700/80">
          {["all", "expense", "income"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t as "all" | "income" | "expense")}
              className={`px-3 py-2 text-xs font-bold capitalize transition ${
                filter === t
                  ? "bg-emerald-500/30 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700/80"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-400">No transactions yet.</p>
      ) : (
        <ul className="divide-y divide-slate-700/70">
          {filtered.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold ring-1 ${
                    t.type === "income"
                      ? "bg-emerald-500/20 text-emerald-200 ring-emerald-400/40"
                      : "bg-rose-500/20 text-rose-200 ring-rose-400/40"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-100">
                    {t.description}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <CategoryBadge
                      name={
                        t.categoryId
                          ? categoryNameById.get(t.categoryId) ?? "Uncategorized"
                          : "Uncategorized"
                      }
                    />
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">
                      {new Date(t.date).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p
                  className={`text-sm font-extrabold ${
                    t.type === "income" ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </p>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-xs font-bold text-rose-200 ring-1 ring-rose-400/30 transition hover:bg-rose-500/20"
                  aria-label="Delete transaction"
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
