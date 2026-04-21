interface StatusPillProps {
	answered: boolean;
}

export function StatusPill({ answered }: StatusPillProps) {
	if (answered) {
		return (
			<span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-violet-500 bg-violet-50 px-3 py-1 text-xs font-medium tracking-wider text-violet-700 uppercase dark:border-violet-400 dark:bg-violet-950/40 dark:text-violet-300">
				<span className="size-2 rounded-full bg-violet-500 dark:bg-violet-400" />
				Answered
			</span>
		);
	}
	return (
		<span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-950/10 bg-white px-3 py-1 text-xs font-medium tracking-wider text-zinc-500 uppercase dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400">
			<span className="size-2 rounded-full border border-zinc-400 dark:border-zinc-500" />
			Unanswered
		</span>
	);
}
