import { useState } from "react";
import { ExerciseCard } from "./ExerciseCard";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import type { Exercise } from "./mock-workbook";
import { StatusPill } from "./StatusPill";

type MultipleChoiceExercise = Extract<Exercise, { kind: "multiple-choice" }>;

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
				<p className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
					{exercise.prompt}
				</p>
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
