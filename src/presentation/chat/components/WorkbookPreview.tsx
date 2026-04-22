import { Bookmark, Download, Eye, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	type Exercise,
	type Workbook,
	workbookFilename,
	workbookInit,
	workbookMarkup,
	workbookStyles,
	workbookToHtml,
} from "#/domain/workbook";
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

	const handleDownload = useCallback(() => {
		const html = workbookToHtml(workbook);
		const blob = new Blob([html], { type: "text/html;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = workbookFilename(workbook);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		// Revoke on the next tick — synchronous revoke cancels the download in
		// some browsers (notably Safari).
		setTimeout(() => URL.revokeObjectURL(url), 0);
	}, [workbook]);

	return (
		<div className="mx-auto w-full max-w-3xl space-y-6">
			<WorkbookActions
				onPreview={() => setIsPreviewOpen(true)}
				onDownload={handleDownload}
			/>

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

function WorkbookActions({
	onPreview,
	onDownload,
}: {
	onPreview: () => void;
	onDownload: () => void;
}) {
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
				<Button type="button" onClick={onDownload}>
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
			{open ? <WorkbookShadow workbook={workbook} /> : null}
		</Dialog>
	);
}

function WorkbookShadow({ workbook }: { workbook: Workbook }) {
	const hostRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;
		const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
		root.innerHTML = `<style>${workbookStyles()}</style>${workbookMarkup(workbook)}`;
		workbookInit(root);
	}, [workbook]);

	return (
		<div
			ref={hostRef}
			className="my-6 py-6 overflow-hidden rounded-xl border border-zinc-950/10 dark:border-white/10"
		/>
	);
}
