// app/api/credits/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { requireTrainerOrRedirect } from "@/lib/authz";

// POST /api/credits  -> { client_id, delta } add/subtract credits
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

	const { client_id, delta } = await req.json();
	if (!client_id || typeof delta !== "number") {
		return NextResponse.json({ error: "client_id and numeric delta required" }, { status: 400 });
	}

	// Ensure the client belongs to this trainer (RLS will also enforce)
	const { data: client, error: cErr } = await supabase
		.from("clients")
		.select("id")
		.eq("id", client_id)
		.single();
	if (cErr || !client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

	const { data, error } = await supabase
		.rpc("adjust_credits", { p_client_id: client_id, p_delta: delta });

	if (error) return NextResponse.json({ error: error.message }, { status: 400 });
	return NextResponse.json({ credits: data });
}
