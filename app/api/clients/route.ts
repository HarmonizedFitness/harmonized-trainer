// app/api/clients/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { requireTrainerOrRedirect } from "@/lib/authz";

// GET /api/clients  -> list my clients
export async function GET() {
	// Ensure trainer
	try {
		await requireTrainerOrRedirect();
	} catch {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const supabase = await createSupabaseServer();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { data, error } = await supabase
		.from("clients")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) return NextResponse.json({ error: error.message }, { status: 400 });
	return NextResponse.json({ clients: data ?? [] });
}

// POST /api/clients  -> { name, email? } create client under me (trainer)
export async function POST(req: Request) {
	// Ensure trainer
	try {
		await requireTrainerOrRedirect();
	} catch {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const supabase = await createSupabaseServer();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await req.json();
	const { name, email } = body ?? {};
	if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

	const { data, error } = await supabase
		.from("clients")
		.insert({ name, email, trainer_id: user.id })
		.select("*")
		.single();

	if (error) return NextResponse.json({ error: error.message }, { status: 400 });
	return NextResponse.json({ client: data }, { status: 201 });
}
