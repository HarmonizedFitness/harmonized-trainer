import { requireUserOrRedirect } from "@/src/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function DashboardPage() {
	const { user } = await requireUserOrRedirect();

	return (
		<main className="min-h-screen bg-neutral-950 text-neutral-100">
			<div className="max-w-4xl mx-auto p-6">
				<header className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<SignOutButton />
				</header>
				
				<div className="grid gap-6">
					{/* Welcome Section */}
					<section className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900">
						<h2 className="text-2xl font-semibold mb-4 text-orange-400">Welcome!</h2>
						<p className="text-neutral-300 text-lg">
							Hello! You're successfully signed in to the Harmonized Trainer platform.
						</p>
					</section>

					{/* User Information */}
					<section className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900">
						<h3 className="text-xl font-semibold mb-4 text-neutral-200">Your Account Information</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between py-2 border-b border-neutral-800">
								<span className="text-neutral-400 font-medium">Email:</span>
								<span className="text-neutral-100 font-mono">{user.email}</span>
							</div>
							<div className="flex items-center justify-between py-2 border-b border-neutral-800">
								<span className="text-neutral-400 font-medium">User ID:</span>
								<span className="text-neutral-100 font-mono text-sm break-all">{user.id}</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-neutral-400 font-medium">Account Created:</span>
								<span className="text-neutral-100">
									{new Date(user.created_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
								</span>
							</div>
						</div>
					</section>

					{/* Session Information */}
					<section className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900">
						<h3 className="text-xl font-semibold mb-4 text-neutral-200">Session Details</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between py-2 border-b border-neutral-800">
								<span className="text-neutral-400 font-medium">Last Sign In:</span>
								<span className="text-neutral-100">
									{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									}) : 'N/A'}
								</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-neutral-400 font-medium">Authentication Method:</span>
								<div className="flex items-center gap-2">
									<span className="text-neutral-100">Email & Password</span>
									<span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
										Verified
									</span>
								</div>
							</div>
						</div>
					</section>

					{/* Action Items */}
					<section className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900">
						<h3 className="text-xl font-semibold mb-4 text-neutral-200">Quick Actions</h3>
						<div className="grid gap-3 sm:grid-cols-2">
							<a 
								href="/test" 
								className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
							>
								<span className="text-neutral-300">Test Connection</span>
								<span className="text-orange-400">→</span>
							</a>
							<button 
								className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-left"
								disabled
							>
								<span className="text-neutral-500">More features coming soon...</span>
								<span className="text-neutral-600">⚡</span>
							</button>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
