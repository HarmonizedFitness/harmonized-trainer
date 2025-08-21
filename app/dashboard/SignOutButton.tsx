"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        // Clear any client-side state
        router.refresh();
        router.replace("/signin");
      } else {
        console.error("Sign out error:", error);
      }
    } catch (error) {
      console.error("Unexpected sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 hover:text-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}