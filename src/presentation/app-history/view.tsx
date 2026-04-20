import { History } from "lucide-react";
import { useAppHistory } from "./hooks";

export function AppHistoryView() {
	const { workbooks } = useAppHistory();

	return (
		<div className="space-y-8">
			<div className="space-y-1">
				<h1 className="font-display text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
					History
				</h1>
				<p className="text-zinc-600 dark:text-zinc-400">
					Every workbook you've generated, ready to re-open or share.
				</p>
			</div>

			{workbooks.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-950/10 px-6 py-16 text-center dark:border-white/10">
					<History className="size-8 text-zinc-400 dark:text-zinc-500" />
					<p className="font-medium text-zinc-950 dark:text-white">
						No workbooks yet
					</p>
					<p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
						Generate your first workbook from the Home screen and it'll show up
						here.
					</p>
				</div>
			) : null}
		</div>
	);
}
