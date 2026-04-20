import { History, Inbox, Settings, SquarePen } from "lucide-react";
import {
	Sidebar,
	SidebarBody,
	SidebarFooter,
	SidebarHeader,
	SidebarItem,
	SidebarLabel,
	SidebarSection,
} from "#/presentation/components/catalyst/sidebar";
import Logo from "#/presentation/components/Logo";
import { AccountMenu } from "./AccountMenu";

interface AppSidebarProps {
	email: string;
	fullName: string | null;
	isSigningOut: boolean;
	onSignOut: () => void;
}

export function AppSidebar({
	email,
	fullName,
	isSigningOut,
	onSignOut,
}: AppSidebarProps) {
	return (
		<Sidebar>
			<SidebarHeader>
				<Logo />
			</SidebarHeader>

			<SidebarBody>
				<SidebarSection>
					<SidebarItem href="/app" current>
						<SquarePen data-slot="icon" />
						<SidebarLabel>New workbook</SidebarLabel>
					</SidebarItem>
					<SidebarItem href="/app">
						<History data-slot="icon" />
						<SidebarLabel>History</SidebarLabel>
					</SidebarItem>
					<SidebarItem href="/app">
						<Settings data-slot="icon" />
						<SidebarLabel>Settings</SidebarLabel>
					</SidebarItem>
				</SidebarSection>
			</SidebarBody>

			<SidebarFooter>
				<div className="flex items-center justify-between gap-2">
					<AccountMenu
						email={email}
						fullName={fullName}
						isSigningOut={isSigningOut}
						onSignOut={onSignOut}
					/>
					<button
						type="button"
						aria-label="Inbox"
						className="inline-flex size-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-950/5 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
					>
						<Inbox className="size-5" />
					</button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
