import { useCallback, useEffect, useState } from "react";
import type { Exercise, ReadingQuestion } from "#/domain/workbook";
import { ExerciseCard, KIND_DEFAULT_INSTRUCTIONS } from "./ExerciseCard";
import { ExplanationPanel } from "./ExplanationPanel";
import type { ReportScore, Score } from "./exercise-reveal";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import { optionCardStyle } from "./option-card-style";
import { StatusPill } from "./StatusPill";

type ReadingExercise = Extract<Exercise, { kind: "reading" }>;

interface ReadingBlockProps {
	exercise: ReadingExercise;
	revealed: boolean;
	onScoreChange?: ReportScore;
}

export function ReadingBlock({
	exercise,
	revealed,
	onScoreChange,
}: ReadingBlockProps) {
	const [questionScores, setQuestionScores] = useState<Record<number, Score>>(
		{},
	);
	const reportQuestionScore = useCallback((index: number, score: Score) => {
		setQuestionScores((prev) => ({ ...prev, [index]: score }));
	}, []);
	const correct = Object.values(questionScores).reduce(
		(sum, s) => sum + s.correct,
		0,
	);
	const total = exercise.questions.length;

	useEffect(() => {
		onScoreChange?.(exercise.id, { correct, total });
	}, [exercise.id, correct, total, onScoreChange]);

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
							<QuestionContent
								question={q}
								label={label}
								revealed={revealed}
								index={i}
								reportScore={reportQuestionScore}
							/>
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
	revealed,
	index,
	reportScore,
}: {
	question: ReadingQuestion;
	label: string;
	revealed: boolean;
	index: number;
	reportScore: (index: number, score: Score) => void;
}) {
	const [answer, setAnswer] = useState<string | null>(null);
	const typeLabel =
		question.kind === "multipleChoice" ? "Multiple Choice" : "True / False";

	const correct = (() => {
		if (answer === null) return 0;
		if (question.kind === "multipleChoice") {
			const opt = question.options.find((o) => o.text === answer);
			return opt?.isCorrect ? 1 : 0;
		}
		const expected = question.correctAnswer ? "True" : "False";
		return answer === expected ? 1 : 0;
	})();

	useEffect(() => {
		reportScore(index, { correct, total: 1 });
	}, [index, correct, reportScore]);

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
					selected={
						revealed
							? (question.options.find((o) => o.isCorrect)?.text ?? null)
							: answer
					}
					onSelect={setAnswer}
					revealCorrect={revealed}
					disabled={revealed}
				/>
			) : (
				<TrueFalseOptions
					name={label}
					correctAnswer={question.correctAnswer}
					selected={
						revealed ? (question.correctAnswer ? "True" : "False") : answer
					}
					onSelect={setAnswer}
					revealCorrect={revealed}
					disabled={revealed}
				/>
			)}

			{revealed && question.kind === "trueFalse" ? (
				<ExplanationPanel>
					<dl className="space-y-2">
						<ChoiceLine
							label="If True"
							isCorrect={question.correctAnswer === true}
							text={question.explanationIfTrueChosen}
						/>
						<ChoiceLine
							label="If False"
							isCorrect={question.correctAnswer === false}
							text={question.explanationIfFalseChosen}
						/>
					</dl>
				</ExplanationPanel>
			) : null}
			{revealed && question.kind === "multipleChoice" ? (
				<ExplanationPanel>
					<ol className="space-y-3">
						{question.options.map((opt, i) => {
							const letter = String.fromCharCode(65 + i);
							return (
								<li key={opt.text} className="space-y-1">
									<p className="text-sm">
										<span className="mr-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
											{letter}
										</span>
										<span
											className={
												opt.isCorrect
													? "font-medium text-emerald-700 dark:text-emerald-400"
													: ""
											}
										>
											{opt.text}
										</span>
									</p>
									<p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
										{opt.explanationIfChosen}
									</p>
								</li>
							);
						})}
					</ol>
				</ExplanationPanel>
			) : null}
		</div>
	);
}

function TrueFalseOptions({
	name,
	correctAnswer,
	selected,
	onSelect,
	revealCorrect,
	disabled,
}: {
	name: string;
	correctAnswer: boolean;
	selected: string | null;
	onSelect: (value: string) => void;
	revealCorrect: boolean;
	disabled?: boolean;
}) {
	return (
		<div className="grid grid-cols-2 gap-3">
			{(["True", "False"] as const).map((choice) => {
				const isSelected = selected === choice;
				const isCorrect =
					(choice === "True" && correctAnswer) ||
					(choice === "False" && !correctAnswer);
				const showCorrect = revealCorrect && isCorrect;
				return (
					<label
						key={choice}
						className={`flex items-center gap-3 rounded-lg border px-5 py-4 ${optionCardStyle(isSelected, showCorrect)} ${disabled ? "pointer-events-none" : ""}`}
					>
						<input
							type="radio"
							name={name}
							className={`size-4 ${showCorrect ? "accent-emerald-600" : "accent-violet-600"}`}
							checked={isSelected}
							readOnly={disabled}
							onChange={disabled ? undefined : () => onSelect(choice)}
						/>
						<span>{choice}</span>
					</label>
				);
			})}
		</div>
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
