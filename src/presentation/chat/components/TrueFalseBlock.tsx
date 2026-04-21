import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Exercise } from "#/domain/workbook";
import { ExerciseCard } from "./ExerciseCard";
import { CorrectBadge, ExplanationPanel } from "./ExplanationPanel";
import type { ReportScore } from "./exercise-reveal";
import { optionCardStyle } from "./option-card-style";
import { StatusPill } from "./StatusPill";

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
			headerRight={<StatusPill answered={answer !== null} />}
		>
			<div className="space-y-5">
				<p className="exercise-focal">“{exercise.statement}”</p>
				<div className="grid grid-cols-2 gap-3">
					<TrueFalseOption
						label="True"
						icon={<Check className="size-4" />}
						isCorrect={revealed && exercise.correctAnswer === true}
						selected={answer === true}
						onClick={() => setAnswer(true)}
					/>
					<TrueFalseOption
						label="False"
						icon={<X className="size-4" />}
						isCorrect={revealed && exercise.correctAnswer === false}
						selected={answer === false}
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
						{exercise.correctAnswer === false ? (
							<ChoiceLine label="Correction" text={exercise.correction} />
						) : null}
					</dl>
					<p className="mt-3 border-t border-violet-500/20 pt-3 dark:border-violet-400/20">
						{exercise.canonicalExplanation}
					</p>
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
	onClick,
}: {
	label: string;
	icon: React.ReactNode;
	isCorrect: boolean;
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
			{isCorrect ? <CorrectBadge /> : null}
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
			<dt className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
				{label}
				{isCorrect ? <CorrectBadge /> : null}
			</dt>
			<dd>{text}</dd>
		</div>
	);
}
