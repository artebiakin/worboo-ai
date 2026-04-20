import { History, Settings, SquarePen } from "lucide-react";
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
					<InboxMenu />
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
