"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [err, setErr] = useState<string|null>(null);
  const [loading, setLoad] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already authenticated when component mounts
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // User is already signed in, redirect to dashboard
          router.replace("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoad(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        setErr(error.message);
        return;
      }

      if (data.user) {
        // Wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Force refresh to update server-side session
        router.refresh();
        
        // Navigate to dashboard
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setErr("An unexpected error occurred. Please try again.");
    } finally {
      setLoad(false);
    }
  };

  // Show loading spinner while checking authentication
  if (checkingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-950 text-neutral-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-neutral-400">Checking authentication...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-950 text-neutral-100">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-neutral-900 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <input 
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          disabled={loading}
        />
        <input 
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPwd(e.target.value)} 
          required 
          disabled={loading}
        />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button 
          disabled={loading} 
          className="w-full rounded-xl bg-orange-500 px-4 py-2 font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-sm text-neutral-400">
          No account? <a href="/signup" className="text-orange-400 underline hover:text-orange-300">Sign up</a>
        </p>
      </form>
    </main>
  );
}
