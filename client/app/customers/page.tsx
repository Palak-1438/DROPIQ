export default function CustomersPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-semibold">Customers</h1>
      <p className="text-xs text-slate-400">
        This table will show customers with churn scores and revenue at risk once the API is wired.
      </p>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs text-slate-400">
        No data yet. Connect the backend and ML service to see live churn scores.
      </div>
    </main>
  );
}
