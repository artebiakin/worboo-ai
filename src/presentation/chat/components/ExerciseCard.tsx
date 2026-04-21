import type { ReactNode } from "react";
import type { Exercise } from "#/domain/workbook";

type ExerciseKind = Exercise["kind"];

const KIND_LABEL: Record<ExerciseKind, string> = {
	reading: "Reading",
	multipleChoice: "Multiple choice",
	trueFalse: "True or false",
	fillBlank: "Fill in the blank",
	matching: "Matching",
};

export const KIND_DEFAULT_INSTRUCTIONS: Record<ExerciseKind, string> = {
	reading: "Read the text and answer the questions below.",
	multipleChoice: "Choose the correct answer.",
	trueFalse: "Decide whether the statement is true or false.",
	fillBlank: "Complete the sentence with the correct word.",
	matching: "Match each item on the left to the correct item on the right.",
};

interface ExerciseCardProps {
	id: number;
	kind: ExerciseKind;
	instructions?: string;
	headerRight?: ReactNode;
	children: ReactNode;
}

export function ExerciseCard({
	id,
	kind,
	instructions,
	headerRight,
	children,
}: ExerciseCardProps) {
	const displayInstructions = instructions ?? KIND_DEFAULT_INSTRUCTIONS[kind];
	return (
		<div className="rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
			<div className="flex items-start justify-between gap-4">
				<p className="exercise-label">
					Exercise {id.toString().padStart(2, "0")} · {KIND_LABEL[kind]}
				</p>
				{headerRight}
			</div>
			<p className="exercise-instructions mt-2">{displayInstructions}</p>
			<div className="mt-2">{children}</div>
		</div>
	);
}
