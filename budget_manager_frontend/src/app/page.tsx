"use client";

import Navbar from "@/components/Navbar";
import SummaryCards from "@/components/SummaryCards";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <SummaryCards />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TransactionForm />
          <TransactionList />
        </div>
      </main>
    </div>
  );
}
