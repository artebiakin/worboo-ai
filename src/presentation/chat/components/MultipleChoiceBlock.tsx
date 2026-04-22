import { useEffect, useState } from "react";
import type { Exercise } from "#/domain/workbook";
import { ExerciseCard } from "./ExerciseCard";
import { ExplanationPanel } from "./ExplanationPanel";
import type { ReportScore } from "./exercise-reveal";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";

type MultipleChoiceExercise = Extract<Exercise, { kind: "multipleChoice" }>;

interface MultipleChoiceBlockProps {
	exercise: MultipleChoiceExercise;
	revealed: boolean;
	onScoreChange?: ReportScore;
}

export function MultipleChoiceBlock({
	exercise,
	revealed,
	onScoreChange,
}: MultipleChoiceBlockProps) {
	const [answer, setAnswer] = useState<string | null>(null);
	const selected = exercise.options.find((o) => o.text === answer);
	const correct = selected?.isCorrect ? 1 : 0;
	const correctText = exercise.options.find((o) => o.isCorrect)?.text ?? null;
	const displayedAnswer = revealed ? correctText : answer;

	useEffect(() => {
		onScoreChange?.(exercise.id, { correct, total: 1 });
	}, [exercise.id, correct, onScoreChange]);

	return (
		<ExerciseCard id={exercise.id} kind={exercise.kind}>
			<div className="space-y-5">
				<p className="exercise-focal">{exercise.prompt}</p>
				<MultipleChoiceOptions
					name={`mc-${exercise.id}`}
					options={exercise.options}
					selected={displayedAnswer}
					onSelect={setAnswer}
					revealCorrect={revealed}
					disabled={revealed}
				/>
			</div>
			{revealed ? (
				<ExplanationPanel>
					<ol className="space-y-3">
						{exercise.options.map((opt) => {
							return (
								<li key={opt.text} className="space-y-1">
									<p className="text-sm">
										<span className="mr-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
											{opt.label}
										</span>
										<span
											className={
												opt.isCorrect
													? "font-medium text-emerald-700 dark:text-emerald-400"
													: ""
											}
										>
											{opt.text}
										</span>
									</p>
									<p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
										{opt.explanationIfChosen}
									</p>
								</li>
							);
						})}
					</ol>
				</ExplanationPanel>
			) : null}
		</ExerciseCard>
	);
}
