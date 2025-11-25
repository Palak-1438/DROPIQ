import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Churn Overview</h2>
        <p className="mt-2 text-sm text-slate-300">
          High-level churn risk, revenue at risk, and customer cohorts.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">Customers</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">MRR at Risk</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-400">High-Risk Customers</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
        </div>
      </section>
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Customers</h3>
          <Link href="/customers" className="text-xs text-sky-400 hover:underline">
            View all
          </Link>
        </div>
        <p className="mt-2 text-xs text-slate-400">Connect the API to see live churn scores.</p>
      </section>
    </main>
  );
}
