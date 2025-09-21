"use client";

import SummaryCards from "@/components/SummaryCards";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import SpendingChart from "@/components/SpendingChart";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <SummaryCards />
        </div>

        <div className="mb-6">
          <SpendingChart />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TransactionForm />
          <TransactionList />
        </div>
      </main>
    </div>
  );
}
