import type { LucideIcon } from "lucide-react";

interface InboxEmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
}

export function InboxEmptyState({
	icon: Icon,
	title,
	description,
}: InboxEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center text-center">
			<Icon
				aria-hidden="true"
				className="size-6 text-zinc-500 dark:text-zinc-400"
			/>
			<h3 className="mt-4 text-base font-semibold text-zinc-950 dark:text-white">
				{title}
			</h3>
			<p className="mt-1 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
				{description}
			</p>
		</div>
	);
}
