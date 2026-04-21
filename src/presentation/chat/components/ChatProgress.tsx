import { Check, Loader2 } from "lucide-react";

export interface ProgressStep {
	id: string;
	label: string;
}

interface ChatProgressProps {
	percent: number;
	steps: readonly ProgressStep[];
	footerText: string;
}

export function ChatProgress({
	percent,
	steps,
	footerText,
}: ChatProgressProps) {
	const stepSize = 100 / steps.length;
	const currentIndex = Math.min(
		Math.floor(percent / stepSize),
		steps.length - 1,
	);
	const current = steps[currentIndex];

	return (
		<>
			<div className="space-y-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex min-w-0 items-center gap-2">
						<Loader2 className="size-4 shrink-0 animate-spin text-violet-600 motion-reduce:animate-none dark:text-violet-400" />
						<span className="truncate font-medium text-zinc-950 dark:text-white">
							{current.label}
						</span>
					</div>
					<span className="shrink-0 text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
						{Math.round(percent)}%
					</span>
				</div>

				<div className="h-1 w-full overflow-hidden rounded-full bg-zinc-950/5 dark:bg-white/5">
					<div
						className="h-full bg-violet-600 transition-[width] duration-150 ease-linear motion-reduce:transition-none dark:bg-violet-500"
						style={{ width: `${percent}%` }}
					/>
				</div>

				<ol className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold tracking-wider uppercase">
					{steps.map((step, i) => {
						const state = stepState(i, percent, stepSize);
						return (
							<li key={step.id} className="flex items-center gap-1.5">
								<StepMarker state={state} />
								<span
									className={
										state === "done"
											? "text-green-700 transition-colors dark:text-green-400"
											: state === "current"
												? "text-zinc-950 transition-colors dark:text-white"
												: "text-zinc-400 transition-colors dark:text-zinc-500"
									}
								>
									{step.label}
								</span>
							</li>
						);
					})}
				</ol>
			</div>

			<GeneratingPreview />

			<p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
				{footerText}
			</p>
		</>
	);
}

function stepState(
	i: number,
	percent: number,
	stepSize: number,
): "done" | "current" | "pending" {
	const start = i * stepSize;
	const end = (i + 1) * stepSize;
	if (percent >= end) return "done";
	if (percent >= start) return "current";
	return "pending";
}

function StepMarker({ state }: { state: "done" | "current" | "pending" }) {
	if (state === "done") {
		return <Check className="size-3.5 text-green-700 dark:text-green-400" />;
	}
	if (state === "current") {
		return (
			<span className="size-2 animate-pulse rounded-full bg-zinc-950 motion-reduce:animate-none dark:bg-white" />
		);
	}
	return (
		<span className="size-2 rounded-full border border-zinc-400 dark:border-zinc-500" />
	);
}

function GeneratingPreview() {
	return (
		<div className="rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
			<div className="space-y-3">
				<div className="h-5 w-1/2 animate-pulse rounded bg-zinc-950/5 dark:bg-white/5" />
				<div className="h-5 w-2/3 animate-pulse rounded bg-zinc-950/5 dark:bg-white/5" />
			</div>
			<div className="mt-6 space-y-2">
				<div className="h-3 w-4/5 animate-pulse rounded bg-zinc-950/5 dark:bg-white/5" />
				<div className="h-3 w-3/4 animate-pulse rounded bg-zinc-950/5 dark:bg-white/5" />
				<div className="h-3 w-2/3 animate-pulse rounded bg-zinc-950/5 dark:bg-white/5" />
			</div>
			<div className="mt-8 space-y-6">
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						className="flex gap-3 border-t border-dashed border-zinc-950/10 pt-4 dark:border-white/10"
					>
						<div className="size-6 shrink-0 animate-pulse rounded bg-zinc-950/5 dark:bg-white/5" />
						<div className="flex-1 space-y-2">
							<div className="h-4 w-2/3 animate-pulse rounded bg-zinc-950/5 dark:bg-white/5" />
							<div className="h-3 w-full animate-pulse rounded bg-zinc-950/5 dark:bg-white/5" />
							<div className="h-3 w-1/2 animate-pulse rounded bg-zinc-950/5 dark:bg-white/5" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
