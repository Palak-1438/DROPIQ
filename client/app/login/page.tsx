'use client';

import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      await axios.post(`${baseUrl}/api/auth/login`, { email, password });
      // In a real app, store JWTs and redirect
    } catch (err: any) {
      setError('Login failed');
    }
  };

  return (
    <main className="mx-auto mt-24 max-w-sm rounded-lg border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-lg font-semibold">Login</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-sm">
        <div>
          <label className="block text-xs text-slate-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded bg-slate-950 px-2 py-1 text-sm outline-none ring-1 ring-slate-800 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded bg-slate-950 px-2 py-1 text-sm outline-none ring-1 ring-slate-800 focus:ring-sky-500"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          className="mt-2 w-full rounded bg-sky-500 py-1 text-sm font-medium text-slate-950 hover:bg-sky-400"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
