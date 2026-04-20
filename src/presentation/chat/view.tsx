import { useChat } from "./hooks";

interface ChatViewProps {
	chatId: string;
}

export function ChatView({ chatId }: ChatViewProps) {
	const { chatId: id } = useChat({ chatId });

	return (
		<div className="space-y-8">
			<div className="space-y-1">
				<h1 className="font-display text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
					New chat
				</h1>
				<p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
					{id}
				</p>
			</div>

			<div className="rounded-lg border border-dashed border-zinc-950/10 px-6 py-16 text-center dark:border-white/10">
				<p className="text-sm text-zinc-600 dark:text-zinc-400">
					The conversation surface lands in a follow-up.
				</p>
			</div>
		</div>
	);
}
