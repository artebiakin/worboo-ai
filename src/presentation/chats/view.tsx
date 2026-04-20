import { MessageSquare } from "lucide-react";
import { useChats } from "./hooks";

export function ChatsView() {
	const { chats } = useChats();

	return (
		<div className="space-y-8">
			<div className="space-y-1">
				<h1 className="font-display text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
					Chats
				</h1>
				<p className="text-zinc-600 dark:text-zinc-400">
					Build a workbook by chatting through the details.
				</p>
			</div>

			{chats.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-950/10 px-6 py-16 text-center dark:border-white/10">
					<MessageSquare className="size-8 text-zinc-400 dark:text-zinc-500" />
					<p className="font-medium text-zinc-950 dark:text-white">
						No chats yet
					</p>
					<p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
						Start a new chat to describe the workbook you want and we'll build
						it with you.
					</p>
				</div>
			) : null}
		</div>
	);
}
