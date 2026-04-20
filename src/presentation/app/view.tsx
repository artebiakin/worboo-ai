import {
	Navbar,
	NavbarSpacer,
} from "#/presentation/components/catalyst/navbar";
import { SidebarLayout } from "#/presentation/components/catalyst/sidebar-layout";
import Logo from "#/presentation/components/Logo";
import { AppSidebar } from "./components/AppSidebar";
import { useApp } from "./hooks";

export function AppView() {
	const { session, isLoading, isSigningOut, handleSignOut } = useApp();

	if (isLoading || !session) {
		return (
			<div className="flex min-h-dvh items-center justify-center bg-white dark:bg-zinc-900">
				<output
					aria-label="Loading"
					className="size-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-950 dark:border-zinc-700 dark:border-t-white"
				/>
			</div>
		);
	}

	return (
		<SidebarLayout
			sidebar={
				<AppSidebar
					email={session.email}
					fullName={session.fullName}
					isSigningOut={isSigningOut}
					onSignOut={handleSignOut}
				/>
			}
			navbar={
				<Navbar>
					<Logo />
					<NavbarSpacer />
				</Navbar>
			}
		>
			<div className="space-y-8">
				<div className="space-y-1">
					<h1 className="font-display text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
						Welcome back
					</h1>
					<p className="text-zinc-600 dark:text-zinc-400">
						Describe a lesson. Get an interactive, self-grading workbook.
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<section className="rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
						<h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-white">
							New workbook
						</h2>
						<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
							Start from a prompt. Get a self-contained HTML file in under 90
							seconds.
						</p>
					</section>

					<section className="rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
						<h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-white">
							Recent activity
						</h2>
						<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
							Your recent workbooks will appear here.
						</p>
					</section>
				</div>
			</div>
		</SidebarLayout>
	);
}
