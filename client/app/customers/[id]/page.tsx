'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface ShapExplanationProps {
  explanation: any;
}

function ShapExplanationPanel({ explanation }: ShapExplanationProps) {
  if (!explanation) return <p className="text-xs text-slate-500">No explanation available.</p>;

  return (
    <div className="mt-3 rounded border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200">
      <h3 className="mb-1 text-xs font-semibold text-slate-300">Why is this customer at risk?</h3>
      <pre className="whitespace-pre-wrap break-words text-[10px] text-slate-400">
        {JSON.stringify(explanation, null, 2)}
      </pre>
    </div>
  );
}

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const [shap, setShap] = useState<any | null>(null);

  useEffect(() => {
    // Placeholder: in a real app fetch latest churn score + SHAP from API
    setShap({ feature_importances: { tenure: -0.3, nps: -0.2, logins_7d: -0.1 } });
  }, [params.id]);

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-semibold">Customer {params.id}</h1>
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm">
        <p className="text-xs text-slate-400">Churn probability and revenue at risk will appear here.</p>
        <ShapExplanationPanel explanation={shap} />
      </section>
    </main>
  );
}
