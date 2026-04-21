import type { ReactNode } from "react";
import type { Exercise } from "./mock-workbook";

type ExerciseKind = Exercise["kind"];

const KIND_LABEL: Record<ExerciseKind, string> = {
	reading: "Reading",
	multipleChoice: "Multiple choice",
	trueFalse: "True or false",
	fillBlank: "Fill in the blank",
	matching: "Matching",
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
	return (
		<div className="space-y-6 rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
			<header className="space-y-2">
				<div className="flex items-start justify-between gap-4">
					<p className="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
						Exercise {id.toString().padStart(2, "0")} · {KIND_LABEL[kind]}
					</p>
					{headerRight}
				</div>
				{instructions ? (
					<p className="text-lg text-zinc-950 dark:text-white">
						{instructions}
					</p>
				) : null}
			</header>
			{children}
		</div>
	);
}
