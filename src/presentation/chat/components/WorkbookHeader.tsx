import { BookOpen } from "lucide-react";
import type { Workbook } from "#/domain/workbook";
import type { Score } from "./exercise-reveal";

interface WorkbookHeaderProps {
	workbook: Workbook;
	score?: Score;
}

export function WorkbookHeader({ workbook, score }: WorkbookHeaderProps) {
	return (
		<div className="flex flex-col items-center gap-3 rounded-lg border border-zinc-950/10 bg-white p-6 text-center dark:border-white/10 dark:bg-zinc-900">
			{score && score.total > 0 ? (
				<ScoreBadge correct={score.correct} total={score.total} />
			) : (
				<div className="flex size-10 items-center justify-center rounded-md bg-zinc-950/5 dark:bg-white/5">
					<BookOpen className="size-5 text-zinc-500 dark:text-zinc-400" />
				</div>
			)}
			<div>
				<p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
					{workbook.topic} · {workbook.level} {workbook.targetLanguage}
				</p>
				<h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
					{workbook.title}
				</h1>
			</div>
			<ul className="flex flex-wrap justify-center gap-2">
				{workbook.tags.map((tag) => (
					<li
						key={tag}
						className="rounded-md border border-zinc-950/10 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400"
					>
						{tag}
					</li>
				))}
			</ul>
		</div>
	);
}

function scoreTone(correct: number, total: number) {
	const ratio = correct / total;
	if (ratio >= 0.7) {
		return {
			text: "text-emerald-700 dark:text-emerald-400",
			bg: "bg-emerald-500/10",
		};
	}
	if (ratio >= 0.4) {
		return {
			text: "text-amber-700 dark:text-amber-400",
			bg: "bg-amber-500/10",
		};
	}
	return {
		text: "text-rose-700 dark:text-rose-400",
		bg: "bg-rose-500/10",
	};
}

function ScoreBadge({ correct, total }: { correct: number; total: number }) {
	const tone = scoreTone(correct, total);
	return (
		<div
			className={`flex h-10 items-center justify-center rounded-md px-3 ${tone.bg}`}
		>
			<span className={`text-base font-semibold tabular-nums ${tone.text}`}>
				{correct} / {total}
			</span>
		</div>
	);
}
