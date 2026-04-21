import { useState } from "react";
import { ExerciseCard } from "./ExerciseCard";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import type { Exercise, ReadingQuestion } from "./mock-workbook";
import { optionCardStyle } from "./option-card-style";
import { StatusPill } from "./StatusPill";

type ReadingExercise = Extract<Exercise, { kind: "reading" }>;

interface ReadingBlockProps {
	exercise: ReadingExercise;
}

export function ReadingBlock({ exercise }: ReadingBlockProps) {
	return (
		<ExerciseCard
			number={exercise.number}
			type={exercise.type}
			instructions={exercise.instructions}
		>
			<blockquote className="space-y-3 border-l-4 border-zinc-950/20 pl-6 dark:border-white/20">
				<h3 className="font-display text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
					{exercise.title}
				</h3>
				<p className="text-lg leading-relaxed text-zinc-950 dark:text-white">
					"{exercise.text}"
				</p>
			</blockquote>

			<ol className="divide-y divide-zinc-950/10 dark:divide-white/10">
				{exercise.questions.map((q, i) => {
					const letter = String.fromCharCode(65 + i);
					const label = `Question ${Number.parseInt(exercise.number, 10)}${letter}`;
					return (
						<li
							key={`${label}-${q.prompt}`}
							className="py-6 first:pt-0 last:pb-0"
						>
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
		question.kind === "multiple-choice" ? "Multiple Choice" : "True / False";

	return (
		<div className="space-y-5">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 space-y-1">
					<p className="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
						{label} · {typeLabel}
					</p>
					<p className="text-lg text-zinc-950 dark:text-white">
						{question.prompt}
					</p>
				</div>
				{answer !== null ? <StatusPill answered /> : null}
			</div>

			{question.kind === "multiple-choice" ? (
				<MultipleChoiceOptions
					name={label}
					options={question.options}
					selected={answer}
					onSelect={setAnswer}
				/>
			) : (
				<TrueFalseOptions
					name={label}
					statement={question.statement}
					selected={answer}
					onSelect={setAnswer}
				/>
			)}
		</div>
	);
}

function TrueFalseOptions({
	name,
	statement,
	selected,
	onSelect,
}: {
	name: string;
	statement: string;
	selected: string | null;
	onSelect: (value: string) => void;
}) {
	return (
		<div className="space-y-4">
			<p className="text-zinc-700 italic dark:text-zinc-300">“{statement}”</p>
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
		</div>
	);
}
