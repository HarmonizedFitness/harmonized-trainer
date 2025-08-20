import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { getCurrentTrainer } from "@/lib/trainer";

function normalizeId(params: Record<string, string | string[] | undefined>): string {
  const raw = params?.id;
  return Array.isArray(raw) ? raw[0] : (raw ?? "");
}

export async function POST(req: NextRequest, { params }: { params: Record<string, string | string[]> }) {
  const id = normalizeId(params);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createSupabaseServer();
  const { trainer } = await getCurrentTrainer();
  if (!trainer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("workout_assignments")
    .update({ status: "in_progress", started_at: new Date().toISOString() })
    .eq("id", id)
    .eq("trainer_id", trainer.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
