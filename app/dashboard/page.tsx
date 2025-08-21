import { requireTrainerOrRedirect } from "@/src/lib/authz";
import SignOutButton from "./SignOutButton";

export default async function DashboardPage() {
	const { user, trainer } = await requireTrainerOrRedirect();

	return (
		<main className="min-h-screen bg-neutral-950 text-neutral-100">
			<div className="max-w-3xl mx-auto p-6">
				<header className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Trainer Dashboard</h1>
					<SignOutButton />
				</header>
				<section className="mt-6 rounded-2xl border border-neutral-800 p-6 bg-neutral-900">
					<h2 className="text-xl font-medium mb-4">Welcome, {trainer.name || 'Trainer'}</h2>
					<p className="text-neutral-300">Signed in as <span className="font-medium">{user.email}</span></p>
					<div className="mt-4 pt-4 border-t border-neutral-800">
						<p className="text-sm text-neutral-400">Trainer ID: {trainer.id}</p>
					</div>
				</section>
			</div>
		</main>
	);
}
