import {
	AlertTriangle,
	ArrowRight,
	Info,
	Lightbulb,
	Sparkles,
} from "lucide-react";
import { useState } from "react";
import type {
	ClarificationQuestion,
	ClarificationQuestionKind,
} from "#/domain/workbook";
import { Button } from "#/presentation/components/catalyst/button";

const SKIP_VALUE = "__skip__";

type DisplayKind = "required" | "conflict" | "optional";

export interface ClarificationAnswer {
	question: ClarificationQuestion;
	selectedValue: string;
	selectedLabel: string;
}

interface ChatQuestionsProps {
	questions: ClarificationQuestion[];
	isGenerating: boolean;
	onSubmit: (answers: ClarificationAnswer[]) => void;
}

export function ChatQuestions({
	questions,
	isGenerating,
	onSubmit,
}: ChatQuestionsProps) {
	const [answers, setAnswers] = useState<Record<number, string>>({});

	const blockingIndexes = questions
		.map((q, i) => ({ q, i }))
		.filter(({ q }) => !q.skippable)
		.map(({ i }) => i);
	const allBlockingAnswered = blockingIndexes.every((i) => answers[i]);
	const answeredCount = Object.values(answers).filter(
		(v) => v && v !== SKIP_VALUE,
	).length;

	function setAnswer(index: number, value: string) {
		setAnswers((prev) => ({ ...prev, [index]: value }));
	}

	function submit() {
		const resolved: ClarificationAnswer[] = [];
		questions.forEach((question, i) => {
			const value = answers[i];
			if (!value || value === SKIP_VALUE) return;
			const option = question.options.find((o) => o.value === value);
			if (!option) return;
			resolved.push({
				question,
				selectedValue: value,
				selectedLabel: option.label,
			});
		});
		onSubmit(resolved);
	}

	return (
		<div className="space-y-6">
			<InfoBanner />

			{questions.map((question, index) => (
				<QuestionCard
					// Questions are model-generated and have no stable id;
					// `text` isn't guaranteed unique across a batch. Using
					// the index is the pragmatic stable key here.
					// biome-ignore lint/suspicious/noArrayIndexKey: see above
					key={index}
					question={question}
					answer={answers[index] ?? null}
					onAnswer={(value) => setAnswer(index, value)}
				/>
			))}

			<QuestionsFooter
				answered={answeredCount}
				total={questions.length}
				canSubmit={allBlockingAnswered && !isGenerating}
				isGenerating={isGenerating}
				onGenerate={submit}
			/>
		</div>
	);
}

function displayKind(kind: ClarificationQuestionKind): DisplayKind {
	if (kind === "required") return "required";
	if (kind === "conflict") return "conflict";
	return "optional";
}

function InfoBanner() {
	return (
		<div className="flex items-start gap-3 rounded-lg border border-dashed border-zinc-950/15 bg-zinc-950/2.5 px-4 py-3 dark:border-white/15 dark:bg-white/5">
			<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-950/5 dark:bg-white/10">
				<Info className="size-3.5 text-zinc-500 dark:text-zinc-400" />
			</div>
			<p className="text-sm text-zinc-700 dark:text-zinc-300">
				A few quick questions and Worboo will generate your lesson. Tap an
				answer — no typing needed.
			</p>
		</div>
	);
}

function QuestionCard({
	question,
	answer,
	onAnswer,
}: {
	question: ClarificationQuestion;
	answer: string | null;
	onAnswer: (value: string) => void;
}) {
	const gridCols =
		question.options.length >= 4
			? "sm:grid-cols-2 md:grid-cols-4"
			: "sm:grid-cols-2 md:grid-cols-3";

	return (
		<div className="space-y-4 rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
			<div className="space-y-2">
				<KindBadge kind={displayKind(question.kind)} />
				<h3 className="text-lg font-bold text-zinc-950 dark:text-white">
					{question.text}
				</h3>
			</div>

			<div className={`grid gap-3 ${gridCols}`}>
				{question.options.map((opt) => (
					<OptionCard
						key={opt.value}
						label={opt.label}
						selected={answer === opt.value}
						onSelect={() => onAnswer(opt.value)}
					/>
				))}
			</div>

			{question.skippable ? (
				<div>
					<button
						type="button"
						onClick={() => onAnswer(SKIP_VALUE)}
						aria-pressed={answer === SKIP_VALUE}
						className={
							answer === SKIP_VALUE
								? "inline-flex items-center gap-1.5 rounded-full border border-dashed border-violet-500 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 transition-colors dark:border-violet-400 dark:bg-violet-950/30 dark:text-violet-200"
								: "inline-flex items-center gap-1.5 rounded-full border border-dashed border-zinc-950/20 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-950/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:border-white/20 dark:text-zinc-300 dark:hover:bg-white/5"
						}
					>
						<Sparkles className="size-3.5" />
						Let Worboo decide
					</button>
				</div>
			) : null}
		</div>
	);
}

function KindBadge({ kind }: { kind: DisplayKind }) {
	if (kind === "required") {
		return (
			<div className="flex items-center gap-2">
				<span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-950/5 px-2 py-0.5 text-xs font-medium text-zinc-950 dark:bg-white/10 dark:text-white">
					<AlertTriangle className="size-3.5" />
					Required
				</span>
				<span className="text-xs text-zinc-500 dark:text-zinc-400">
					Needed to continue
				</span>
			</div>
		);
	}
	if (kind === "conflict") {
		return (
			<div className="flex items-center gap-2">
				<span className="inline-flex items-center gap-1.5 rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">
					<AlertTriangle className="size-3.5" />
					Conflict
				</span>
				<span className="text-xs text-zinc-500 dark:text-zinc-400">
					Please resolve
				</span>
			</div>
		);
	}
	return (
		<div className="flex items-center gap-2">
			<span className="inline-flex items-center gap-1.5 rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300">
				<Lightbulb className="size-3.5" />
				Optional
			</span>
			<span className="text-xs text-zinc-500 dark:text-zinc-400">
				Improves the lesson
			</span>
		</div>
	);
}

function OptionCard({
	label,
	selected,
	onSelect,
}: {
	label: string;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={selected}
			className={
				selected
					? "flex items-start gap-3 rounded-lg border border-violet-500 bg-violet-50 p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:border-violet-400 dark:bg-violet-950/30"
					: "flex items-start gap-3 rounded-lg border border-zinc-950/10 bg-white p-3 text-left transition-colors hover:bg-zinc-950/2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-white/5"
			}
		>
			<span
				className={
					selected
						? "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-violet-500 transition-colors dark:border-violet-400"
						: "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-zinc-300 transition-colors dark:border-zinc-600"
				}
			>
				{selected ? (
					<span className="size-2 rounded-full bg-violet-500 dark:bg-violet-400" />
				) : null}
			</span>
			<div className="min-w-0">
				<p className="text-sm font-medium text-zinc-950 dark:text-white">
					{label}
				</p>
			</div>
		</button>
	);
}

function QuestionsFooter({
	answered,
	total,
	canSubmit,
	isGenerating,
	onGenerate,
}: {
	answered: number;
	total: number;
	canSubmit: boolean;
	isGenerating: boolean;
	onGenerate: () => void;
}) {
	return (
		<div className="flex items-center justify-between gap-4 border-t border-zinc-950/10 pt-4 dark:border-white/10">
			<p className="text-sm text-zinc-500 dark:text-zinc-400">
				{answered}/{total} answered
				{canSubmit ? null : (
					<>
						{" · "}
						<span className="text-red-600 dark:text-red-400">
							required questions pending
						</span>
					</>
				)}
			</p>
			<Button
				type="button"
				color="violet"
				disabled={!canSubmit}
				onClick={onGenerate}
			>
				{isGenerating ? "Generating…" : "Generate workbook"}
				<ArrowRight data-slot="icon" />
			</Button>
		</div>
	);
}
