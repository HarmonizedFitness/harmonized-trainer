"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail]   = useState("");
  const [password, setPwd]  = useState("");
  const [err, setErr]       = useState<string|null>(null);
  const [loading, setLoad]  = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoad(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoad(false);
    if (error) return setErr(error.message);
    // Use refresh to ensure the server-side session is updated
    router.refresh();
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-950 text-neutral-100">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-neutral-900 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <input className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
               type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
               type="password" placeholder="Password" value={password} onChange={(e)=>setPwd(e.target.value)} required />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-orange-500 px-4 py-2 font-medium hover:bg-orange-600 disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-sm text-neutral-400">No account? <a href="/signup" className="underline hover:text-neutral-200">Sign up</a></p>
      </form>
    </main>
  );
}
