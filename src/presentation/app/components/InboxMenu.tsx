import { Inbox, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "#/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/presentation/components/shadcn/popover";
import { InboxEmptyState } from "./InboxEmptyState";

type InboxTab = "inbox" | "whats-new";

export function InboxMenu() {
	const [tab, setTab] = useState<InboxTab>("inbox");

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label="Inbox"
					className="inline-flex size-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-950/5 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 data-[state=open]:bg-zinc-950/5 data-[state=open]:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white dark:data-[state=open]:bg-white/10 dark:data-[state=open]:text-white"
				>
					<Inbox className="size-5" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				side="right"
				sideOffset={24}
				className="flex h-128 w-md flex-col overflow-hidden p-0"
			>
				<div className="flex gap-1 p-1">
					<TabButton active={tab === "inbox"} onClick={() => setTab("inbox")}>
						Inbox
					</TabButton>
					<TabButton
						active={tab === "whats-new"}
						onClick={() => setTab("whats-new")}
					>
						What's new
					</TabButton>
				</div>
				<div className="flex flex-1 items-center justify-center px-6 pb-10">
					{tab === "inbox" ? (
						<InboxEmptyState
							icon={Mail}
							title="No messages or invites pending"
							description="Messages, workspace and project invitations will appear here"
						/>
					) : (
						<InboxEmptyState
							icon={Sparkles}
							title="Nothing new right now"
							description="Product updates and announcements will show up here"
						/>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

function TabButton({
	active,
	children,
	onClick,
}: {
	active: boolean;
	children: React.ReactNode;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
				active
					? "bg-zinc-950/5 text-zinc-950 dark:bg-white/10 dark:text-white"
					: "text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white",
			)}
		>
			{children}
		</button>
	);
}
