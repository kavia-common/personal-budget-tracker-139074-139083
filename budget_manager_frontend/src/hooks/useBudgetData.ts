import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDB, isStorageAvailable, setDB } from "../lib/storage";
import type { Category, Transaction } from "../lib/types";

/**
 * PUBLIC_INTERFACE
 * useBudgetData hook provides state and actions for managing transactions and categories
 * with localStorage persistence and SSR safety. It exposes:
 * - State: transactions, categories
 * - Actions:
 *    addTransaction, deleteTransaction
 *    addCategory, deleteCategory, resetData
 * - Derived summaries:
 *    totalIncome, totalExpenses, balance, totalsByCategory
 * The hook ensures data are synced to localStorage on changes and lazy-loads from localStorage on client mount.
 */
export function useBudgetData() {
  // Core states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Track initial hydration to avoid writing defaults over existing localStorage before load
  const hasHydrated = useRef(false);

  // On client mount, load data from storage (SSR safe)
  useEffect(() => {
    if (!isStorageAvailable()) return;

    const db = getDB();
    setTransactions(Array.isArray(db.transactions) ? db.transactions : []);
    setCategories(Array.isArray(db.categories) ? db.categories : []);

    hasHydrated.current = true;
  }, []);

  // Persist transactions to localStorage when changed (after hydration)
  useEffect(() => {
    if (!isStorageAvailable() || !hasHydrated.current) return;
    try {
      const db = getDB();
      setDB({ ...db, transactions });
    } catch {
      // no-op: storage may be unavailable (private mode, etc.)
    }
  }, [transactions]);

  // Persist categories to localStorage when changed (after hydration)
  useEffect(() => {
    if (!isStorageAvailable() || !hasHydrated.current) return;
    try {
      const db = getDB();
      setDB({ ...db, categories });
    } catch {
      // no-op
    }
  }, [categories]);

  // Helpers
  const generateId = useCallback(() => {
    // Simple collision-resistant id based on time + random
    return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }, []);

  // PUBLIC_INTERFACE
  const addTransaction = useCallback(
    (tx: Omit<Transaction, "id">) => {
      setTransactions((prev) => {
        const newTx: Transaction = {
          ...tx,
          id: generateId(),
          // Ensure date is present; if not provided, default to now.
          date: (tx as Transaction).date ?? new Date().toISOString(),
        };
        return [newTx, ...prev];
      });
    },
    [generateId]
  );

  // PUBLIC_INTERFACE
  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // PUBLIC_INTERFACE
  const addCategory = useCallback((name: string, kind: Category["kind"] = "expense") => {
    setCategories((prev) => {
      // Avoid duplicates by case-insensitive name match
      const exists = prev.some(
        (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (exists) return prev;

      const newCat: Category = {
        id: generateId(),
        name: name.trim(),
        kind,
      };
      return [...prev, newCat];
    });
  }, [generateId]);

  // PUBLIC_INTERFACE
  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Also remove category from transactions by setting to "Uncategorized"
    setTransactions((prev) =>
      prev.map((t) =>
        t.categoryId === id ? { ...t, categoryId: undefined } : t
      )
    );
  }, []);

  // PUBLIC_INTERFACE
  const resetData = useCallback(() => {
    setTransactions([]);
    setCategories([]);
    if (isStorageAvailable()) {
      try {
        const db = getDB();
        setDB({ ...db, transactions: [], categories: [] });
      } catch {
        // ignore storage errors
      }
    }
  }, []);

  // Derived summaries
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.max(0, t.amount), 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.max(0, t.amount), 0);
  }, [transactions]);

  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  /**
   * Build a map of categoryId to totals (income, expenses, net) and include
   * an "uncategorized" bucket for transactions without category.
   */
  const totalsByCategory = useMemo(() => {
    type Totals = { income: number; expenses: number; net: number; category?: Category };
    const map = new Map<string, Totals>();

    // Prepare map with existing categories
    for (const c of categories) {
      map.set(c.id, { income: 0, expenses: 0, net: 0, category: c });
    }

    // Special key for uncategorized
    const UNCATEGORIZED_KEY = "__uncategorized__";
    map.set(UNCATEGORIZED_KEY, { income: 0, expenses: 0, net: 0 });

    const clampAmount = (a: number) => (Number.isFinite(a) && a > 0 ? a : 0);

    for (const t of transactions) {
      const key = t.categoryId && map.has(t.categoryId) ? t.categoryId : UNCATEGORIZED_KEY;
      const bucket = map.get(key)!;
      const amt = clampAmount(t.amount);

      if (t.type === "income") {
        bucket.income += amt;
      } else {
        bucket.expenses += amt;
      }
      bucket.net = bucket.income - bucket.expenses;
    }

    // Convert to array with a readable name (default label for uncategorized)
    const result = Array.from(map.entries()).map(([key, totals]) => ({
      key,
      name:
        key === "__uncategorized__"
          ? "Uncategorized"
          : totals.category?.name ?? "Uncategorized",
      ...totals,
    }));

    // Optional: sort by highest expenses desc
    result.sort((a, b) => b.expenses - a.expenses);
    return result;
  }, [transactions, categories]);

  return {
    // state
    transactions,
    categories,

    // actions
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    resetData,

    // summaries
    totalIncome,
    totalExpenses,
    balance,
    totalsByCategory,
  };
}

export default useBudgetData;
