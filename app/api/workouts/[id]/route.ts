// app/api/workouts/[id]/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/src/lib/supabaseServer";

// GET /api/workouts/[id]  -> get specific workout
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const { data, error } = await supabase
    .from("workouts")
    .select(`
      *,
      clients (
        id,
        name,
        email
      ),
      credits (
        id,
        package_name
      )
    `)
    .eq("id", resolvedParams.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ workout: data });
}

// PUT /api/workouts/[id]  -> update workout
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { workout_date, workout_type, start_time, end_time, notes, status } = body ?? {};

  const resolvedParams = await params;
  const { data, error } = await supabase
    .from("workouts")
    .update({ 
      workout_date, 
      workout_type, 
      start_time, 
      end_time, 
      notes,
      status 
    })
    .eq("id", resolvedParams.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ workout: data });
}

// DELETE /api/workouts/[id]  -> delete workout
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", resolvedParams.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: "Workout deleted successfully" });
}
