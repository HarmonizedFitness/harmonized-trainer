// app/api/credits/[id]/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";

// GET /api/credits/[id]  -> get specific credit
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ credit: data });
}

// PUT /api/credits/[id]  -> update credit
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { package_name, total_sessions, used_sessions, price, expires_at, is_active } = body ?? {};

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
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ credit: data });
}

// DELETE /api/credits/[id]  -> delete credit
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("credits")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: "Credit deleted successfully" });
}
