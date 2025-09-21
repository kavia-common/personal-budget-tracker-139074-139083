"use client";

import Navbar from "@/components/Navbar";
import SummaryCards from "@/components/SummaryCards";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import SpendingChart from "@/components/SpendingChart";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        <header className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">
            <span className="text-white">Dashboard</span>{" "}
            <span className="text-emerald-400">Overview</span>
          </h1>
          <p className="text-sm text-slate-400">
            Track your income and expenses, review recent activity, and visualize your spending.
          </p>
        </header>

        <section aria-labelledby="kpis" className="space-y-4">
          <h2 id="kpis" className="text-base sm:text-lg font-semibold text-slate-200">
            Summary
          </h2>
          <SummaryCards />
        </section>

        <section aria-labelledby="insights" className="space-y-4">
          <h2 id="insights" className="text-base sm:text-lg font-semibold text-slate-200">
            Insights
          </h2>
          <SpendingChart />
        </section>

        <section aria-labelledby="manage" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 id="manage" className="text-base sm:text-lg font-semibold text-slate-200">
              Add Transaction
            </h2>
            <TransactionForm />
          </div>
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-slate-200">
              Recent Transactions
            </h2>
            <TransactionList />
          </div>
        </section>
      </main>
    </div>
  );
}
