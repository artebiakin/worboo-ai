import { Fragment, useState } from "react";
import { type Exercise, FILL_BLANK_PLACEHOLDER } from "#/domain/workbook";
import { ExerciseCard } from "./ExerciseCard";
import { StatusPill } from "./StatusPill";

type FillBlankExercise = Extract<Exercise, { kind: "fillBlank" }>;

interface FillBlankBlockProps {
	exercise: FillBlankExercise;
}

export function FillBlankBlock({ exercise }: FillBlankBlockProps) {
	const [values, setValues] = useState<string[]>(() =>
		exercise.blanks.map(() => ""),
	);

	const allFilled = values.every((v) => v.trim().length > 0);
	const segments = exercise.sentence.split(FILL_BLANK_PLACEHOLDER);

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
			headerRight={<StatusPill answered={allFilled} />}
		>
			<p className="text-xl leading-relaxed text-zinc-950 dark:text-white">
				{segments.map((segment, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: segments are positional slices of a fixed sentence template; order never changes
					<Fragment key={i}>
						{segment}
						{exercise.blanks[i] ? (
							<>
								<input
									type="text"
									value={values[i] ?? ""}
									onChange={(e) => setValue(i, e.target.value)}
									className="mx-1 inline-block w-40 border-b border-zinc-400 bg-transparent text-center text-zinc-950 focus:border-violet-500 focus:outline-none dark:border-zinc-500 dark:text-white dark:focus:border-violet-400"
								/>
								<span className="ml-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
									({exercise.blanks[i].hint})
								</span>
							</>
						) : null}
					</Fragment>
				))}
			</p>
		</ExerciseCard>
	);
}
