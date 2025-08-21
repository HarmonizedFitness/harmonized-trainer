"use client";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function SignUpPage() {
  const [email, setEmail]   = useState("");
  const [password, setPwd]  = useState("");
  const [err, setErr]       = useState<string|null>(null);
  const [ok, setOk]         = useState<string|null>(null);
  const [loading, setLoad]  = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setOk(null); setLoad(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoad(false);
    if (error) return setErr(error.message);
    setOk("Check your email to confirm your account.");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-950 text-neutral-100">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-neutral-900 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <input className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
               type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
               type="password" placeholder="Password" value={password} onChange={(e)=>setPwd(e.target.value)} required />
        {err && <p className="text-sm text-red-400">{err}</p>}
        {ok && <p className="text-sm text-green-400">{ok}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-orange-500 px-4 py-2 font-medium hover:bg-orange-600 disabled:opacity-50">
          {loading ? "Creating…" : "Sign up"}
        </button>
        <p className="text-sm text-neutral-400">Have an account? <a href="/signin" className="underline hover:text-neutral-200">Sign in</a></p>
      </form>
    </main>
  );
}
