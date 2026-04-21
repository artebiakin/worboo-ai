import { Check, X } from "lucide-react";
import { useState } from "react";
import { ExerciseCard } from "./ExerciseCard";
import type { Exercise } from "./mock-workbook";
import { optionCardStyle } from "./option-card-style";
import { StatusPill } from "./StatusPill";

type TrueFalseExercise = Extract<Exercise, { kind: "true-false" }>;

interface TrueFalseBlockProps {
	exercise: TrueFalseExercise;
}

export function TrueFalseBlock({ exercise }: TrueFalseBlockProps) {
	const [answer, setAnswer] = useState<boolean | null>(null);

	return (
		<ExerciseCard
			id={exercise.id}
			type={exercise.type}
			instructions={exercise.instructions}
			headerRight={<StatusPill answered={answer !== null} />}
		>
			<div className="space-y-5">
				<p className="text-2xl text-zinc-950 italic dark:text-white">
					“{exercise.statement}”
				</p>
				<div className="grid grid-cols-2 gap-3">
					<TrueFalseOption
						label="True"
						icon={<Check className="size-4" />}
						selected={answer === true}
						onClick={() => setAnswer(true)}
					/>
					<TrueFalseOption
						label="False"
						icon={<X className="size-4" />}
						selected={answer === false}
						onClick={() => setAnswer(false)}
					/>
				</div>
			</div>
		</ExerciseCard>
	);
}

function TrueFalseOption({
	label,
	icon,
	selected,
	onClick,
}: {
	label: string;
	icon: React.ReactNode;
	selected: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={selected}
			className={`flex items-center justify-center gap-2 rounded-lg border px-5 py-4 text-base font-medium focus-visible:outline-none ${optionCardStyle(selected)}`}
		>
			{icon}
			{label}
		</button>
	);
}
