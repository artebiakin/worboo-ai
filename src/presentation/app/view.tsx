import { Outlet } from "@tanstack/react-router";
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
			<Outlet />
		</SidebarLayout>
	);
}
