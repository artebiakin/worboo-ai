import { Fragment, useEffect, useState } from "react";
import { type Exercise, FILL_BLANK_PLACEHOLDER } from "#/domain/workbook";
import { ExerciseCard } from "./ExerciseCard";
import { ExplanationPanel } from "./ExplanationPanel";
import { normalizeBlank, type ReportScore } from "./exercise-reveal";

type FillBlankExercise = Extract<Exercise, { kind: "fillBlank" }>;

interface FillBlankBlockProps {
	exercise: FillBlankExercise;
	revealed: boolean;
	onScoreChange?: ReportScore;
}

export function FillBlankBlock({
	exercise,
	revealed,
	onScoreChange,
}: FillBlankBlockProps) {
	const [values, setValues] = useState<string[]>(() =>
		exercise.blanks.map(() => ""),
	);

	const segments = exercise.sentence.split(FILL_BLANK_PLACEHOLDER);
	const correct = exercise.blanks.reduce((acc, blank, i) => {
		const normalized = normalizeBlank(values[i] ?? "");
		if (!normalized) return acc;
		const accepted = blank.acceptedAnswers.map(normalizeBlank);
		return accepted.includes(normalized) ? acc + 1 : acc;
	}, 0);
	const total = exercise.blanks.length;

	useEffect(() => {
		onScoreChange?.(exercise.id, { correct, total });
	}, [exercise.id, correct, total, onScoreChange]);

	function setValue(i: number, v: string) {
		setValues((prev) => {
			const next = prev.slice();
			next[i] = v;
			return next;
		});
	}

	return (
		<ExerciseCard
			id={exercise.id}
			kind={exercise.kind}
			instructions={exercise.instructions}
		>
			<p className="exercise-focal">
				{segments.map((segment, i) => {
					const blank = exercise.blanks[i];
					const value = revealed
						? (blank?.acceptedAnswers[0] ?? "")
						: (values[i] ?? "");
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: segments are positional slices of a fixed sentence template; order never changes
						<Fragment key={i}>
							{segment}
							{blank ? (
								<>
									<input
										type="text"
										value={value}
										onChange={(e) => setValue(i, e.target.value)}
										disabled={revealed}
										className={`mx-1 inline-block w-40 border-b bg-transparent text-center focus:outline-none ${
											revealed
												? "cursor-default border-emerald-500 font-medium text-emerald-700 disabled:opacity-100 dark:border-emerald-400 dark:text-emerald-300"
												: "border-zinc-400 text-zinc-950 focus:border-violet-500 dark:border-zinc-500 dark:text-white dark:focus:border-violet-400"
										}`}
									/>
									<span className="ml-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
										({blank.hint})
									</span>
								</>
							) : null}
						</Fragment>
					);
				})}
			</p>
			{revealed ? (
				<ExplanationPanel>
					<ol className="space-y-3">
						{exercise.blanks.map((blank, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: blanks are positional and stable per exercise
							<li key={i} className="space-y-1">
								<div className="flex flex-wrap items-baseline gap-x-2">
									<span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
										Blank {i + 1} ({blank.hint})
									</span>
									<span className="font-medium text-zinc-900 dark:text-zinc-100">
										{blank.acceptedAnswers.join(" / ")}
									</span>
								</div>
								<p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
									{blank.explanation}
								</p>
							</li>
						))}
					</ol>
				</ExplanationPanel>
			) : null}
		</ExerciseCard>
	);
}
