import { useEffect, useState } from "react";
import type { Exercise } from "#/domain/workbook";
import { ExerciseCard } from "./ExerciseCard";
import { ExplanationPanel } from "./ExplanationPanel";
import type { ReportScore } from "./exercise-reveal";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import { StatusPill } from "./StatusPill";

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

	useEffect(() => {
		onScoreChange?.(exercise.id, { correct, total: 1 });
	}, [exercise.id, correct, onScoreChange]);

	return (
		<ExerciseCard
			id={exercise.id}
			kind={exercise.kind}
			headerRight={<StatusPill answered={answer !== null} />}
		>
			<div className="space-y-5">
				<p className="exercise-focal">{exercise.prompt}</p>
				<MultipleChoiceOptions
					name={`mc-${exercise.id}`}
					options={exercise.options}
					selected={answer}
					onSelect={setAnswer}
					revealCorrect={revealed}
				/>
			</div>
			{revealed ? (
				<ExplanationPanel>{exercise.canonicalExplanation}</ExplanationPanel>
			) : null}
		</ExerciseCard>
	);
}
