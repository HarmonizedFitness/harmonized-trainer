import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServer } from "@/src/lib/supabaseServer";
import { getCurrentTrainer } from "@/src/lib/trainer";

const createSchema = z.object({
  client_id: z.string().uuid(),
  template_id: z.string().uuid().optional(),
  name: z.string().min(1).max(120).optional(),
  notes: z.string().max(2000).optional(),
  due_at: z.string().datetime().optional(),
});

export async function GET(req: Request) {
  const supabase = await createSupabaseServer();
  const { trainer } = await getCurrentTrainer();
  if (!trainer) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("client_id");

  let q = supabase.from("assigned_workouts")
    .select("*")
    .eq("trainer_id", trainer.id)
    .order("created_at", { ascending: false })
    .limit(25);

  if (clientId) q = q.eq("client_id", clientId);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const { trainer } = await getCurrentTrainer();
  if (!trainer) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { client_id, template_id, name, notes, due_at } = parsed.data;

  const { data, error } = await supabase
    .from("assigned_workouts")
    .insert({
      trainer_id: trainer.id,
      client_id,
      template_id: template_id ?? null,
      name: name ?? null,
      notes: notes ?? null,
      due_at: due_at ?? null,
      status: "assigned",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
