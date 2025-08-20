// app/api/credits/[id]/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/src/lib/supabaseServer";

// GET /api/credits/[id]  -> get specific credit
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const { data, error } = await supabase
    .from("credits")
    .select(`
      *,
      clients (
        id,
        name,
        email
      )
    `)
    .eq("id", resolvedParams.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ credit: data });
}

// PUT /api/credits/[id]  -> update credit
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { package_name, total_sessions, used_sessions, price, expires_at, is_active } = body ?? {};

  const resolvedParams = await params;
  const { data, error } = await supabase
    .from("credits")
    .update({ 
      package_name, 
      total_sessions, 
      used_sessions, 
      price, 
      expires_at,
      is_active 
    })
    .eq("id", resolvedParams.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ credit: data });
}

// DELETE /api/credits/[id]  -> delete credit
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const { error } = await supabase
    .from("credits")
    .delete()
    .eq("id", resolvedParams.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: "Credit deleted successfully" });
}
