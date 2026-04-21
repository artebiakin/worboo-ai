import { useState } from "react";
import { ExerciseCard } from "./ExerciseCard";
import type { Exercise } from "./mock-workbook";
import { StatusPill } from "./StatusPill";

type FillBlankExercise = Extract<Exercise, { kind: "fill-blank" }>;

interface FillBlankBlockProps {
	exercise: FillBlankExercise;
}

export function FillBlankBlock({ exercise }: FillBlankBlockProps) {
	const [value, setValue] = useState("");
	const isFilled = value.trim().length > 0;

	return (
		<ExerciseCard
			number={exercise.number}
			type={exercise.type}
			instructions={exercise.instructions}
			headerRight={<StatusPill answered={isFilled} />}
		>
			<p className="text-xl leading-relaxed text-zinc-950 dark:text-white">
				{exercise.prefix ? `${exercise.prefix} ` : null}
				<input
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className="mx-1 inline-block w-40 border-b border-zinc-400 bg-transparent text-center text-zinc-950 focus:border-violet-500 focus:outline-none dark:border-zinc-500 dark:text-white dark:focus:border-violet-400"
				/>
				<span className="ml-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
					({exercise.hint})
				</span>{" "}
				{exercise.suffix}
			</p>
		</ExerciseCard>
	);
}
