import { useRouterState } from "@tanstack/react-router";
import { History, House, MessageSquare } from "lucide-react";
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
import { InboxMenu } from "./InboxMenu";

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
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	return (
		<Sidebar>
			<SidebarHeader>
				<Logo />
			</SidebarHeader>

			<SidebarBody>
				<SidebarSection>
					<SidebarItem href="/dashboard" current={pathname === "/dashboard"}>
						<House data-slot="icon" />
						<SidebarLabel>Home</SidebarLabel>
					</SidebarItem>
					<SidebarItem
						href="/dashboard/chats"
						current={pathname.startsWith("/dashboard/chats")}
					>
						<MessageSquare data-slot="icon" />
						<SidebarLabel>Chats</SidebarLabel>
					</SidebarItem>
					<SidebarItem
						href="/dashboard/history"
						current={pathname.startsWith("/dashboard/history")}
					>
						<History data-slot="icon" />
						<SidebarLabel>History</SidebarLabel>
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
					<InboxMenu />
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
