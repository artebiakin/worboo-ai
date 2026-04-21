import type { Workbook } from "#/domain/workbook";

interface WorkbookIntroProps {
	workbook: Workbook;
}

export function WorkbookIntro({ workbook }: WorkbookIntroProps) {
	return (
		<div className="space-y-5 rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
			<p className="text-zinc-700 dark:text-zinc-300">{workbook.intro}</p>

			<div className="space-y-2 border-t border-zinc-950/10 pt-5 dark:border-white/10">
				<p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
					Learning objectives
				</p>
				<ul className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
					{workbook.objectives.map((objective) => (
						<li key={objective}>{objective}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
