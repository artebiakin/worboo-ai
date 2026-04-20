import { BookOpen } from "lucide-react";

interface PromptCardProps {
	prompt: string;
}

export function PromptCard({ prompt }: PromptCardProps) {
	return (
		<div className="flex flex-col items-center gap-3 rounded-lg border border-zinc-950/10 bg-white p-6 text-center dark:border-white/10 dark:bg-zinc-900">
			<div className="flex size-10 items-center justify-center rounded-md bg-zinc-950/5 dark:bg-white/5">
				<BookOpen className="size-5 text-zinc-500 dark:text-zinc-400" />
			</div>
			<div>
				<p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
					Your prompt
				</p>
				<p className="mt-1 text-zinc-950 dark:text-white">{prompt}</p>
			</div>
		</div>
	);
}
