import { useState } from "react";
import type { Exercise } from "#/domain/workbook";
import { ExerciseCard } from "./ExerciseCard";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import { StatusPill } from "./StatusPill";

type MultipleChoiceExercise = Extract<Exercise, { kind: "multipleChoice" }>;

interface MultipleChoiceBlockProps {
	exercise: MultipleChoiceExercise;
}

export function MultipleChoiceBlock({ exercise }: MultipleChoiceBlockProps) {
	const [answer, setAnswer] = useState<string | null>(null);

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
				/>
			</div>
		</ExerciseCard>
	);
}
