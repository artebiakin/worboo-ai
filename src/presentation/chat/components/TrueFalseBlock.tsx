import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Exercise } from "#/domain/workbook";
import { ExerciseCard } from "./ExerciseCard";
import { ExplanationPanel } from "./ExplanationPanel";
import type { ReportScore } from "./exercise-reveal";
import { optionCardStyle } from "./option-card-style";

type TrueFalseExercise = Extract<Exercise, { kind: "trueFalse" }>;

interface TrueFalseBlockProps {
	exercise: TrueFalseExercise;
	revealed: boolean;
	onScoreChange?: ReportScore;
}

export function TrueFalseBlock({
	exercise,
	revealed,
	onScoreChange,
}: TrueFalseBlockProps) {
	const [answer, setAnswer] = useState<boolean | null>(null);
	const correct = answer !== null && answer === exercise.correctAnswer ? 1 : 0;

	useEffect(() => {
		onScoreChange?.(exercise.id, { correct, total: 1 });
	}, [exercise.id, correct, onScoreChange]);

	return (
		<ExerciseCard
			id={exercise.id}
			kind={exercise.kind}
			instructions={exercise.instructions}
		>
			<div className="space-y-5">
				<p className="exercise-focal">“{exercise.statement}”</p>
				<div className="grid grid-cols-2 gap-3">
					<TrueFalseOption
						label="True"
						icon={<Check className="size-4" />}
						isCorrect={revealed && exercise.correctAnswer === true}
						selected={
							revealed ? exercise.correctAnswer === true : answer === true
						}
						disabled={revealed}
						onClick={() => setAnswer(true)}
					/>
					<TrueFalseOption
						label="False"
						icon={<X className="size-4" />}
						isCorrect={revealed && exercise.correctAnswer === false}
						selected={
							revealed ? exercise.correctAnswer === false : answer === false
						}
						disabled={revealed}
						onClick={() => setAnswer(false)}
					/>
				</div>
			</div>
			{revealed ? (
				<ExplanationPanel>
					<dl className="space-y-2">
						<ChoiceLine
							label="If True"
							isCorrect={exercise.correctAnswer === true}
							text={exercise.explanationIfTrueChosen}
						/>
						<ChoiceLine
							label="If False"
							isCorrect={exercise.correctAnswer === false}
							text={exercise.explanationIfFalseChosen}
						/>
					</dl>
				</ExplanationPanel>
			) : null}
		</ExerciseCard>
	);
}

function TrueFalseOption({
	label,
	icon,
	isCorrect,
	selected,
	disabled,
	onClick,
}: {
	label: string;
	icon: React.ReactNode;
	isCorrect: boolean;
	selected: boolean;
	disabled?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={disabled ? undefined : onClick}
			aria-pressed={selected}
			aria-disabled={disabled}
			className={`flex items-center justify-center gap-2 rounded-lg border px-5 py-4 text-base font-medium focus-visible:outline-none ${optionCardStyle(selected, isCorrect)} ${disabled ? "pointer-events-none" : ""}`}
		>
			{icon}
			{label}
		</button>
	);
}

function ChoiceLine({
	label,
	isCorrect,
	text,
}: {
	label: string;
	isCorrect?: boolean;
	text: string;
}) {
	return (
		<div className="flex gap-3">
			<dt
				className={`shrink-0 text-xs font-medium ${
					isCorrect
						? "text-emerald-700 dark:text-emerald-400"
						: "text-zinc-500 dark:text-zinc-400"
				}`}
			>
				{label}
			</dt>
			<dd>{text}</dd>
		</div>
	);
}
