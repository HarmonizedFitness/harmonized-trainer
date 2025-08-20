import { requireTrainerOrRedirect } from "@/lib/authz";

export default async function DashboardPage() {
	const user = await requireTrainerOrRedirect();

	return (
		<main className="min-h-screen bg-neutral-950 text-neutral-100">
			<div className="max-w-3xl mx-auto p-6">
				<header className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Dashboard</h1>
				</header>
				<section className="mt-6 rounded-2xl border border-neutral-800 p-6 bg-neutral-900">
					<p className="text-neutral-300">Signed in as <span className="font-medium">{user.email}</span></p>
				</section>
			</div>
		</main>
	);
}
