import { useState } from "react";
import type { Exercise, ReadingQuestion } from "#/domain/workbook";
import { ExerciseCard, KIND_DEFAULT_INSTRUCTIONS } from "./ExerciseCard";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import { optionCardStyle } from "./option-card-style";
import { StatusPill } from "./StatusPill";

type ReadingExercise = Extract<Exercise, { kind: "reading" }>;

interface ReadingBlockProps {
	exercise: ReadingExercise;
}

export function ReadingBlock({ exercise }: ReadingBlockProps) {
	return (
		<ExerciseCard
			id={exercise.id}
			kind={exercise.kind}
			instructions={exercise.instructions}
		>
			<blockquote className="space-y-3 border-l-4 border-zinc-950/20 pl-6 dark:border-white/20">
				<h3 className="font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
					{exercise.title}
				</h3>
				<p className="exercise-focal">“{exercise.text}”</p>
			</blockquote>

			<ol className="mt-6 divide-y divide-zinc-950/10 border-t border-zinc-950/10 pt-6 dark:divide-white/10 dark:border-white/10">
				{exercise.questions.map((q, i) => {
					const letter = String.fromCharCode(65 + i);
					const label = `Question ${exercise.id}${letter}`;
					return (
						<li key={label} className="py-6 first:pt-0 last:pb-0">
							<QuestionContent question={q} label={label} />
						</li>
					);
				})}
			</ol>
		</ExerciseCard>
	);
}

function QuestionContent({
	question,
	label,
}: {
	question: ReadingQuestion;
	label: string;
}) {
	const [answer, setAnswer] = useState<string | null>(null);
	const typeLabel =
		question.kind === "multipleChoice" ? "Multiple Choice" : "True / False";

	return (
		<div className="space-y-5">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<p className="exercise-label">
						{label} · {typeLabel}
					</p>
					<p className="exercise-instructions mt-2">
						{KIND_DEFAULT_INSTRUCTIONS[question.kind]}
					</p>
					<p className="exercise-focal mt-2">
						{question.kind === "multipleChoice"
							? question.prompt
							: `“${question.statement}”`}
					</p>
				</div>
				{answer !== null ? <StatusPill answered /> : null}
			</div>

			{question.kind === "multipleChoice" ? (
				<MultipleChoiceOptions
					name={label}
					options={question.options}
					selected={answer}
					onSelect={setAnswer}
				/>
			) : (
				<TrueFalseOptions
					name={label}
					selected={answer}
					onSelect={setAnswer}
				/>
			)}
		</div>
	);
}

function TrueFalseOptions({
	name,
	selected,
	onSelect,
}: {
	name: string;
	selected: string | null;
	onSelect: (value: string) => void;
}) {
	return (
		<div className="grid grid-cols-2 gap-3">
			{["True", "False"].map((choice) => {
				const isSelected = selected === choice;
				return (
					<label
						key={choice}
						className={`flex items-center gap-3 rounded-lg border px-5 py-4 ${optionCardStyle(isSelected)}`}
					>
						<input
							type="radio"
							name={name}
							className="size-4 accent-violet-600"
							checked={isSelected}
							onChange={() => onSelect(choice)}
						/>
						<span>{choice}</span>
					</label>
				);
			})}
		</div>
	);
}
