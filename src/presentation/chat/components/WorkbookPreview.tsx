import { Bookmark, Download, Eye, RefreshCw } from "lucide-react";
import { Button } from "#/presentation/components/catalyst/button";
import { FillBlankBlock } from "./FillBlankBlock";
import { MatchingBlock } from "./MatchingBlock";
import { MultipleChoiceBlock } from "./MultipleChoiceBlock";
import type { Exercise, Workbook } from "./mock-workbook";
import { ReadingBlock } from "./ReadingBlock";
import { TrueFalseBlock } from "./TrueFalseBlock";
import { WorkbookHeader } from "./WorkbookHeader";
import { WorkbookIntro } from "./WorkbookIntro";

interface WorkbookPreviewProps {
	workbook: Workbook;
}

export function WorkbookPreview({ workbook }: WorkbookPreviewProps) {
	return (
		<div className="mx-auto w-full max-w-3xl space-y-6">
			<WorkbookActions />

			<WorkbookHeader workbook={workbook} />

			<WorkbookIntro workbook={workbook} />

			{workbook.exercises.map((exercise) => (
				<ExerciseBlock key={exercise.number} exercise={exercise} />
			))}
		</div>
	);
}

function ExerciseBlock({ exercise }: { exercise: Exercise }) {
	switch (exercise.kind) {
		case "reading":
			return <ReadingBlock exercise={exercise} />;
		case "multiple-choice":
			return <MultipleChoiceBlock exercise={exercise} />;
		case "true-false":
			return <TrueFalseBlock exercise={exercise} />;
		case "fill-blank":
			return <FillBlankBlock exercise={exercise} />;
		case "matching":
			return <MatchingBlock exercise={exercise} />;
		default: {
			const _exhaustive: never = exercise;
			return _exhaustive;
		}
	}
}

function WorkbookActions() {
	return (
		<div className="flex flex-wrap items-center justify-between gap-4">
			<div className="flex flex-wrap items-center gap-2">
				<Button type="button" outline>
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
