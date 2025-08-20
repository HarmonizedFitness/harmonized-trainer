// app/api/workouts/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/src/lib/supabaseServer";
import { requireTrainerOrRedirect } from "@/src/lib/authz";

// POST /api/workouts
// { client_id, performed_at?, notes?, sets: [{ exercise_id, reps?, weight?, rir?, duration_seconds?, side? }] }
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

	const payload = await req.json();
	const { client_id, performed_at, notes, sets } = payload || {};
	if (!client_id || !Array.isArray(sets) || sets.length === 0) {
		return NextResponse.json({ error: "client_id and non-empty sets[] required" }, { status: 400 });
	}

	// Get trainer profile
	const { data: trainer, error: trainerError } = await supabase
		.from("trainers")
		.select("id")
		.eq("user_id", user.id)
		.single();
	if (trainerError || !trainer) {
		return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
	}

	// Create workout
	const { data: workout, error: wErr } = await supabase
		.from("workouts")
		.insert({ client_id, trainer_id: trainer.id, performed_at, notes })
		.select("*")
		.single();
	if (wErr) return NextResponse.json({ error: wErr.message }, { status: 400 });

	// Insert sets with the new workout_id
	const rows = sets.map((s: any) => ({
		workout_id: workout.id,
		exercise_id: s.exercise_id,
		reps: s.reps ?? null,
		weight: s.weight ?? null,
		rir: s.rir ?? null,
		duration_seconds: s.duration_seconds ?? null,
		side: s.side ?? null,
	}));

	const { data: inserted, error: sErr } = await supabase.from("workout_sets").insert(rows).select("*");
	if (sErr) return NextResponse.json({ error: sErr.message }, { status: 400 });

	return NextResponse.json({ workout, sets: inserted }, { status: 201 });
}
