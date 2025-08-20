import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { getCurrentTrainer } from "@/lib/trainer";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { trainer } = await getCurrentTrainer();
  if (!trainer) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createSupabaseServer();
  const { error } = await supabase.rpc("complete_assignment", { p_assignment_id: params.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ status: "completed" });
}
