import { Bookmark, Download, Eye, RefreshCw, X } from "lucide-react";
import { useCallback, useState } from "react";
import type { Exercise, Workbook } from "#/domain/workbook";
import { Button } from "#/presentation/components/catalyst/button";
import { Dialog } from "#/presentation/components/catalyst/dialog";
import type { Score } from "./exercise-reveal";
import { FillBlankBlock } from "./FillBlankBlock";
import { MatchingBlock } from "./MatchingBlock";
import { MultipleChoiceBlock } from "./MultipleChoiceBlock";
import { ReadingBlock } from "./ReadingBlock";
import { TrueFalseBlock } from "./TrueFalseBlock";
import { WorkbookHeader } from "./WorkbookHeader";
import { WorkbookIntro } from "./WorkbookIntro";

interface WorkbookPreviewProps {
	workbook: Workbook;
}

export function WorkbookPreview({ workbook }: WorkbookPreviewProps) {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	return (
		<div className="mx-auto w-full max-w-3xl space-y-6">
			<WorkbookActions onPreview={() => setIsPreviewOpen(true)} />

			<WorkbookHeader workbook={workbook} />

			<WorkbookIntro workbook={workbook} />

			{workbook.exercises.map((exercise) => (
				<ExerciseBlock key={exercise.id} exercise={exercise} revealed={true} />
			))}

			<PreviewDialog
				workbook={workbook}
				open={isPreviewOpen}
				onClose={() => setIsPreviewOpen(false)}
			/>
		</div>
	);
}

function ExerciseBlock({
	exercise,
	revealed,
	onScoreChange,
}: {
	exercise: Exercise;
	revealed: boolean;
	onScoreChange?: (id: number, score: Score) => void;
}) {
	switch (exercise.kind) {
		case "reading":
			return (
				<ReadingBlock
					exercise={exercise}
					revealed={revealed}
					onScoreChange={onScoreChange}
				/>
			);
		case "multipleChoice":
			return (
				<MultipleChoiceBlock
					exercise={exercise}
					revealed={revealed}
					onScoreChange={onScoreChange}
				/>
			);
		case "trueFalse":
			return (
				<TrueFalseBlock
					exercise={exercise}
					revealed={revealed}
					onScoreChange={onScoreChange}
				/>
			);
		case "fillBlank":
			return (
				<FillBlankBlock
					exercise={exercise}
					revealed={revealed}
					onScoreChange={onScoreChange}
				/>
			);
		case "matching":
			return (
				<MatchingBlock
					exercise={exercise}
					revealed={revealed}
					onScoreChange={onScoreChange}
				/>
			);
		default: {
			const _exhaustive: never = exercise;
			return _exhaustive;
		}
	}
}

function WorkbookActions({ onPreview }: { onPreview: () => void }) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-4">
			<div className="flex flex-wrap items-center gap-2">
				<Button type="button" outline onClick={onPreview}>
					<Eye data-slot="icon" />
					Preview
				</Button>
				<Button type="button" outline>
					<RefreshCw data-slot="icon" />
					Regenerate
				</Button>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Button type="button" outline>
					<Bookmark data-slot="icon" />
					Save to collection
				</Button>
				<Button type="button">
					<Download data-slot="icon" />
					Download
				</Button>
			</div>
		</div>
	);
}

function PreviewDialog({
	workbook,
	open,
	onClose,
}: {
	workbook: Workbook;
	open: boolean;
	onClose: () => void;
}) {
	const [isChecked, setIsChecked] = useState(false);
	const [scores, setScores] = useState<Record<number, Score>>({});

	const reportScore = useCallback((exerciseId: number, score: Score) => {
		setScores((prev) => {
			const current = prev[exerciseId];
			if (
				current &&
				current.correct === score.correct &&
				current.total === score.total
			) {
				return prev;
			}
			return { ...prev, [exerciseId]: score };
		});
	}, []);

	const totalCorrect = Object.values(scores).reduce(
		(sum, s) => sum + s.correct,
		0,
	);
	const totalQuestions = Object.values(scores).reduce(
		(sum, s) => sum + s.total,
		0,
	);

	return (
		<Dialog size="4xl" open={open} onClose={onClose}>
			<div className="flex items-center justify-between">
				<p className="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
					Student preview
				</p>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close preview"
					className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
				>
					<X className="size-5" />
				</button>
			</div>
			<div className="mt-4 space-y-6">
				<WorkbookHeader
					workbook={workbook}
					score={
						isChecked
							? { correct: totalCorrect, total: totalQuestions }
							: undefined
					}
				/>
				<WorkbookIntro workbook={workbook} />
				{workbook.exercises.map((exercise) => (
					<ExerciseBlock
						key={exercise.id}
						exercise={exercise}
						revealed={isChecked}
						onScoreChange={reportScore}
					/>
				))}
				{!isChecked ? (
					<div className="flex justify-center pt-2">
						<Button type="button" onClick={() => setIsChecked(true)}>
							Check answers
						</Button>
					</div>
				) : null}
			</div>
		</Dialog>
	);
}
