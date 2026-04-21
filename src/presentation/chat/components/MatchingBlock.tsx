import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "#/domain/workbook";
import { ExerciseCard } from "./ExerciseCard";
import { ExplanationPanel } from "./ExplanationPanel";
import type { ReportScore } from "./exercise-reveal";
import { StatusPill } from "./StatusPill";

type MatchingExercise = Extract<Exercise, { kind: "matching" }>;

interface MatchingBlockProps {
	exercise: MatchingExercise;
	revealed: boolean;
	onScoreChange?: ReportScore;
}

export function MatchingBlock({
	exercise,
	revealed,
	onScoreChange,
}: MatchingBlockProps) {
	const [answers, setAnswers] = useState<Record<number, string>>({});
	const answeredCount = Object.values(answers).filter((v) => v !== "").length;
	const allAnswered = answeredCount === exercise.pairs.length;
	const rightOptions = useMemo(
		() =>
			shuffleDeterministic(
				exercise.pairs.map((p) => p.right),
				String(exercise.id),
			),
		[exercise.pairs, exercise.id],
	);
	const correct = exercise.pairs.reduce((acc, pair, i) => {
		return answers[i] === pair.right ? acc + 1 : acc;
	}, 0);
	const total = exercise.pairs.length;

	useEffect(() => {
		onScoreChange?.(exercise.id, { correct, total });
	}, [exercise.id, correct, total, onScoreChange]);

	function setAnswer(index: number, value: string) {
		setAnswers((prev) => ({ ...prev, [index]: value }));
	}

	return (
		<ExerciseCard
			id={exercise.id}
			kind={exercise.kind}
			instructions={exercise.instructions}
			headerRight={<StatusPill answered={allAnswered} />}
		>
			<div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:gap-x-10">
				<p className="exercise-label border-b border-zinc-950/10 pb-2 dark:border-white/10">
					{exercise.leftLabel}
				</p>
				<p className="exercise-label border-b border-zinc-950/10 pb-2 dark:border-white/10">
					{exercise.rightLabel}
				</p>

				{exercise.pairs.map((pair, i) => (
					<div key={pair.left} className="contents">
						<div className="flex items-center gap-3 py-1">
							<span className="text-xs font-medium text-zinc-400 tabular-nums dark:text-zinc-500">
								{pad2(i + 1)}
							</span>
							<span className="exercise-supporting">{pair.left}</span>
							<ArrowRight className="size-4 text-zinc-400 dark:text-zinc-500" />
						</div>
						<div className="py-1">
							<div className="relative">
								<select
									value={answers[i] ?? ""}
									onChange={(e) => setAnswer(i, e.target.value)}
									className="w-full appearance-none rounded-lg border border-zinc-950/10 bg-white px-3 py-2 pr-9 text-zinc-950 transition-colors hover:bg-zinc-950/2.5 focus:border-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-white/5 dark:focus:border-violet-400"
								>
									<option value="" disabled>
										Select…
									</option>
									{rightOptions.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
								<ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
							</div>
						</div>
					</div>
				))}
			</div>
			{revealed ? (
				<ExplanationPanel>
					<ul className="space-y-1">
						{exercise.pairs.map((pair) => (
							<li
								key={pair.left}
								className="flex flex-wrap items-center gap-2 text-sm"
							>
								<span>{pair.left}</span>
								<ArrowRight className="size-3.5 text-zinc-400 dark:text-zinc-500" />
								<span className="font-medium text-zinc-900 dark:text-zinc-100">
									{pair.right}
								</span>
							</li>
						))}
					</ul>
					<p className="mt-3 border-t border-violet-500/20 pt-3 dark:border-violet-400/20">
						{exercise.canonicalExplanation}
					</p>
				</ExplanationPanel>
			) : null}
		</ExerciseCard>
	);
}

function pad2(n: number): string {
	return n.toString().padStart(2, "0");
}

function shuffleDeterministic<T>(items: T[], seed: string): T[] {
	return items
		.map((item, i) => ({ item, key: fnv1a(`${seed}:${i}`) }))
		.sort((a, b) => a.key - b.key)
		.map(({ item }) => item);
}

function fnv1a(s: string): number {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
