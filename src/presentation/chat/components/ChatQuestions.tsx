import {
	AlertTriangle,
	ArrowRight,
	Info,
	Lightbulb,
	Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "#/presentation/components/catalyst/button";

type QuestionKind = "required" | "conflict" | "optional";

interface QuestionOption {
	id: string;
	title: string;
	detail?: string;
}

interface Question {
	id: string;
	kind: QuestionKind;
	title: string;
	description: string;
	options: QuestionOption[];
	letWorbooDecide?: boolean;
}

const QUESTIONS: Question[] = [
	{
		id: "level",
		kind: "required",
		title: "What level are your students?",
		description: "We'll match exercise difficulty and vocabulary range.",
		options: [
			{ id: "a1", title: "A1", detail: "Beginner" },
			{ id: "a2", title: "A2", detail: "Elementary" },
			{ id: "b1", title: "B1", detail: "Intermediate" },
			{ id: "b2", title: "B2", detail: "Upper-intermediate" },
		],
	},
	{
		id: "duration-vs-count",
		kind: "conflict",
		title:
			"You mentioned 20 minutes and 15 exercises. Which should take priority?",
		description:
			"Fifteen exercises usually needs at least 35 minutes for A2 learners.",
		options: [
			{
				id: "keep-20",
				title: "Keep it to 20 minutes",
				detail: "About 6–8 exercises",
			},
			{
				id: "keep-15",
				title: "Keep 15 exercises",
				detail: "Extend to ~40 minutes",
			},
			{
				id: "split",
				title: "Split across two lessons",
				detail: "20 min each",
			},
		],
	},
	{
		id: "theme",
		kind: "optional",
		title: "Would you like a theme to make the lesson more engaging?",
		description: "A theme ties exercises together with a shared context.",
		options: [
			{ id: "weekend", title: "Weekend activities" },
			{ id: "summer", title: "Last summer holiday" },
			{ id: "movies", title: "Favourite movies" },
		],
		letWorbooDecide: true,
	},
];

const BLOCKING_KINDS: QuestionKind[] = ["required", "conflict"];

interface ChatQuestionsProps {
	onGenerate: () => void;
}

export function ChatQuestions({ onGenerate }: ChatQuestionsProps) {
	const [answers, setAnswers] = useState<Record<string, string>>({});

	const blockingIds = QUESTIONS.filter((q) =>
		BLOCKING_KINDS.includes(q.kind),
	).map((q) => q.id);
	const allBlockingAnswered = blockingIds.every((id) => answers[id]);
	const answeredCount = Object.keys(answers).length;

	function setAnswer(questionId: string, optionId: string) {
		setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
	}

	return (
		<div className="space-y-6">
			<InfoBanner />

			{QUESTIONS.map((q) => (
				<QuestionCard
					key={q.id}
					question={q}
					answer={answers[q.id] ?? null}
					onAnswer={(optionId) => setAnswer(q.id, optionId)}
				/>
			))}

			<QuestionsFooter
				answered={answeredCount}
				total={QUESTIONS.length}
				canSubmit={allBlockingAnswered}
				onGenerate={onGenerate}
			/>
		</div>
	);
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
	question: Question;
	answer: string | null;
	onAnswer: (optionId: string) => void;
}) {
	const gridCols =
		question.options.length >= 4
			? "sm:grid-cols-2 md:grid-cols-4"
			: "sm:grid-cols-2 md:grid-cols-3";

	return (
		<div className="space-y-4 rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
			<div className="space-y-2">
				<KindBadge kind={question.kind} />
				<h3 className="text-lg font-bold text-zinc-950 dark:text-white">
					{question.title}
				</h3>
				<p className="text-sm text-zinc-600 dark:text-zinc-400">
					{question.description}
				</p>
			</div>

			<div className={`grid gap-3 ${gridCols}`}>
				{question.options.map((opt) => (
					<OptionCard
						key={opt.id}
						option={opt}
						selected={answer === opt.id}
						onSelect={() => onAnswer(opt.id)}
					/>
				))}
			</div>

			{question.letWorbooDecide ? (
				<div>
					<button
						type="button"
						className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-zinc-950/20 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-950/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:border-white/20 dark:text-zinc-300 dark:hover:bg-white/5"
					>
						<Sparkles className="size-3.5" />
						Let Worboo decide
					</button>
				</div>
			) : null}
		</div>
	);
}

function KindBadge({ kind }: { kind: QuestionKind }) {
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
	option,
	selected,
	onSelect,
}: {
	option: QuestionOption;
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
					{option.title}
				</p>
				{option.detail ? (
					<p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
						{option.detail}
					</p>
				) : null}
			</div>
		</button>
	);
}

function QuestionsFooter({
	answered,
	total,
	canSubmit,
	onGenerate,
}: {
	answered: number;
	total: number;
	canSubmit: boolean;
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
				Generate workbook
				<ArrowRight data-slot="icon" />
			</Button>
		</div>
	);
}
