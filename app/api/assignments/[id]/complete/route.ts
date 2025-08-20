import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { getCurrentTrainer } from "@/lib/trainer";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const supabase = createSupabaseServer();
  const { trainer } = await getCurrentTrainer();
  if (!trainer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("workout_assignments")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("trainer_id", trainer.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
