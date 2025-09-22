"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useBudget } from "@/hooks/BudgetDataContext";
import type { CategoryType } from "@/lib/types";

/**
 * PUBLIC_INTERFACE
 * TransactionForm allows users to add income or expense entries.
 * Integrates with shared budget context to persist and update summaries immediately.
 */
export default function TransactionForm() {
  const { addTransaction, categories } = useBudget();

  const [type, setType] = useState<CategoryType>("expense");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  // Allowed category names per transaction type (canonical labels)
  const EXPENSE_CATEGORIES = useMemo(
    () => ["food", "shopping", "grocer", "gifts", "personal", "other"],
    []
  );
  const INCOME_CATEGORIES = useMemo(
    () => ["salary", "bonus", "gift", "other"],
    []
  );

  // Utility: normalize text for robust matching
  const norm = (s: string) => s.trim().toLowerCase();

  // Predicate: check if a category record is of requested kind and name is allowed.
  // - Case-insensitive kind check
  // - Name supports partial/variant matches (e.g., "groceries" matches "grocer")
  const isCategoryAllowedForType = useCallback(
    (catKind: string, catName: string, txType: CategoryType) => {
      const kindMatch = norm(catKind) === norm(txType);
      const allowedBases = txType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

      const n = norm(catName);
      // Allow if name equals or contains one of the allowed base tokens or vice versa
      const nameMatch = allowedBases.some((base) => {
        const b = norm(base);
        return n === b || n.includes(b) || b.includes(n);
      });

      return kindMatch && nameMatch;
    },
    [EXPENSE_CATEGORIES, INCOME_CATEGORIES]
  );

  // Build filtered list with improved matching and ensure we never exclude valid categories
  const filteredCategories = useMemo(() => {
    const list = categories
      .filter((c) => isCategoryAllowedForType(String(c.kind ?? ""), String(c.name ?? ""), type))
      .sort((a, b) => a.name.localeCompare(b.name));

    // If nothing matched due to unexpected naming, relax to all categories of the same kind (case-insensitive)
    if (list.length === 0) {
      const relaxed = categories
        .filter((c) => norm(String(c.kind ?? "")) === norm(type))
        .sort((a, b) => a.name.localeCompare(b.name));
      return relaxed;
    }
    return list;
  }, [categories, type, isCategoryAllowedForType]);

  // Ensure valid category selection when type changes or categories update
  useEffect(() => {
    if (filteredCategories.length > 0) {
      // If current selection is invalid or empty, select first available category
      const isCurrentValid = categoryId && filteredCategories.some((c) => c.id === categoryId);
      if (!isCurrentValid) {
        setCategoryId(filteredCategories[0].id);
      }
    } else {
      // No categories to choose from; clear selection
      if (categoryId) setCategoryId("");
    }
    // Only react to changes in type and filtered categories; categoryId is used for validation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, filteredCategories]);

  const isValid = useMemo(() => {
    const value = parseFloat(amount);
    return (
      !isNaN(value) &&
      value > 0 &&
      description.trim().length > 0 &&
      filteredCategories.some((c) => c.id === categoryId)
    );
  }, [amount, description, categoryId, filteredCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;

    // Verify category is valid before submission
    if (!filteredCategories.some((c) => c.id === categoryId)) return;

    addTransaction({
      amount: value,
      type,
      description: description.trim(),
      date: new Date().toISOString(),
      categoryId,
    });

    // Reset form state while retaining type selection; auto-select first available category
    setAmount("");
    setDescription("");
    setCategoryId(filteredCategories[0]?.id || "");
  };

  return (
    <section className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 sm:p-6 ring-1 ring-emerald-500/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-extrabold tracking-wide text-emerald-300">
          Add Transaction
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold uppercase text-slate-400">
              Type
            </label>
            <div className="inline-flex overflow-hidden rounded-lg border border-slate-700/80">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`px-3 py-2 text-xs font-bold transition ${
                  type === "expense"
                    ? "bg-rose-500/30 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700/80"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`px-3 py-2 text-xs font-bold transition ${
                  type === "income"
                    ? "bg-emerald-500/30 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700/80"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">
              Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-800/70 px-3 py-2 text-slate-100 outline-none ring-1 ring-transparent transition placeholder:text-slate-500 focus:ring-emerald-500/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g., Grocery shopping"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-800/70 px-3 py-2 text-slate-100 outline-none ring-1 ring-transparent transition placeholder:text-slate-500 focus:ring-emerald-500/40"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-400">
              Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700/60 bg-slate-800/70 px-3 py-2 text-slate-100 outline-none ring-1 ring-transparent transition focus:ring-emerald-500/40"
            >
              {filteredCategories.length === 0 ? (
                <option value="" disabled>
                  No categories available
                </option>
              ) : (
                <>
                  {/* Always ensure at least one option is present; if none selected, show the first as selected by effect */}
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
              Available categories:{" "}
              {type === "expense"
                ? ["Food", "Shopping", "Groceries", "Gifts", "Personal", "Other"].join(", ")
                : ["Salary", "Bonus", "Gift", "Other"].join(", ")}
            </p>
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={!isValid}
            className="relative inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-extrabold text-emerald-200 ring-1 ring-emerald-400 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="absolute -inset-1 -z-10 rounded-xl bg-emerald-500/10 blur-md" />
            Add
          </button>
        </div>
      </form>
    </section>
  );
}
