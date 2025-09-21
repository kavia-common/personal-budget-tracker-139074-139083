"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useBudgetData } from "./useBudgetData";

type BudgetContextValue = ReturnType<typeof useBudgetData>;

const BudgetDataContext = createContext<BudgetContextValue | null>(null);

/**
 * PUBLIC_INTERFACE
 * BudgetDataProvider hosts a single instance of the budget data hook and exposes it
 * through React Context so all consuming components share the same reactive state.
 */
export function BudgetDataProvider({ children }: { children: React.ReactNode }) {
  const value = useBudgetData();

  // Memoize the context value to avoid unnecessary re-renders of consumers
  const memo = useMemo(() => value, [value]);

  return (
    <BudgetDataContext.Provider value={memo}>
      {children}
    </BudgetDataContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * useBudget is the public hook for accessing shared budget data and actions.
 * Must be used within BudgetDataProvider.
 */
export function useBudget(): BudgetContextValue {
  const ctx = useContext(BudgetDataContext);
  if (!ctx) {
    throw new Error("useBudget must be used within a BudgetDataProvider");
  }
  return ctx;
}

export default BudgetDataProvider;
