export function optionCardStyle(selected: boolean): string {
	if (selected) {
		return "border-violet-500 bg-violet-50 text-zinc-950 transition-colors focus-within:ring-2 focus-within:ring-violet-500/40 dark:border-violet-400 dark:bg-violet-950/30 dark:text-white";
	}
	return "border-zinc-950/10 bg-white text-zinc-700 transition-colors hover:bg-zinc-950/2.5 focus-within:ring-2 focus-within:ring-violet-500/40 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5";
}
