import type { ReactNode } from "react";

interface ExplanationPanelProps {
	label?: string;
	children: ReactNode;
}

export function ExplanationPanel({
	label = "Answer key",
	children,
}: ExplanationPanelProps) {
	return (
		<div className="mt-5 rounded-md border border-violet-500/20 bg-violet-50/60 px-4 py-3 dark:border-violet-400/20 dark:bg-violet-950/20">
			<p className="text-xs font-medium tracking-wider text-violet-700 uppercase dark:text-violet-300">
				{label}
			</p>
			<div className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
				{children}
			</div>
		</div>
	);
}

export function CorrectBadge() {
	return (
		<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
			Correct
		</span>
	);
}
