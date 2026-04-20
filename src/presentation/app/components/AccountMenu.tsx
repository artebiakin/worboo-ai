import { LogOut, User } from "lucide-react";
import { Avatar } from "#/presentation/components/catalyst/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/presentation/components/shadcn/dropdown-menu";
import { ThemeMenu } from "./ThemeMenu";

interface AccountMenuProps {
	email: string;
	fullName: string | null;
	isSigningOut: boolean;
	onSignOut: () => void;
}

export function AccountMenu({
	email,
	fullName,
	isSigningOut,
	onSignOut,
}: AccountMenuProps) {
	const displayName = fullName ?? email.split("@")[0] ?? "Account";
	const initials = initialsFor(fullName, email);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label={`Account: ${displayName}`}
					className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
				>
					<Avatar
						initials={initials}
						className="size-8 bg-violet-600 text-white"
					/>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="top" className="w-56">
				<div className="flex items-center gap-3 px-2.5 py-2">
					<Avatar
						initials={initials}
						className="size-10 bg-violet-600 text-white"
					/>
					<div className="min-w-0 flex-1">
						<div className="truncate text-sm font-semibold text-zinc-950 dark:text-white">
							{displayName}
						</div>
						<div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
							{email}
						</div>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<User />
					Profile
				</DropdownMenuItem>
				<ThemeMenu />
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onSelect={onSignOut}
					disabled={isSigningOut}
				>
					<LogOut />
					{isSigningOut ? "Signing out…" : "Sign out"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function initialsFor(fullName: string | null, email: string): string {
	if (fullName) {
		const parts = fullName.trim().split(/\s+/);
		const first = parts[0]?.[0] ?? "";
		const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
		const result = (first + last).toUpperCase();
		if (result) return result;
	}
	const local = email.split("@")[0] ?? "";
	return local.slice(0, 2).toUpperCase() || "?";
}
