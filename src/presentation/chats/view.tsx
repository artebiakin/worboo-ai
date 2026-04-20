import { Link } from "@tanstack/react-router";
import { AlertCircle, MessageSquare, Plus } from "lucide-react";
import { Button } from "#/presentation/components/catalyst/button";
import { useChats } from "./hooks";

export function ChatsView() {
	const {
		chats,
		isLoading,
		error,
		isRefetching,
		handleRetry,
		isCreating,
		handleCreateChat,
	} = useChats();

	return (
		<div className="space-y-8">
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<h1 className="font-display text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
						Chats
					</h1>
					<p className="text-zinc-600 dark:text-zinc-400">
						Build a workbook by chatting through the details.
					</p>
				</div>
				<Button
					type="button"
					color="violet"
					disabled={isCreating}
					onClick={handleCreateChat}
				>
					<Plus data-slot="icon" />
					New chat
				</Button>
			</div>

			{isLoading ? (
				<ChatsSkeleton />
			) : error ? (
				<ChatsError
					message={
						error instanceof Error ? error.message : "Could not load chats."
					}
					isRetrying={isRefetching}
					onRetry={handleRetry}
				/>
			) : chats.length === 0 ? (
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
			) : (
				<ul className="divide-y divide-zinc-950/5 rounded-lg border border-zinc-950/10 dark:divide-white/5 dark:border-white/10">
					{chats.map((chat) => (
						<li key={chat.id}>
							<Link
								to="/dashboard/chats/$chatId"
								params={{ chatId: chat.id }}
								className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-zinc-950/2.5 dark:hover:bg-white/5"
							>
								<span className="truncate font-medium text-zinc-950 dark:text-white">
									{chat.title ?? "Untitled chat"}
								</span>
								<span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
									{new Date(chat.updatedAt).toLocaleDateString()}
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

function ChatsSkeleton() {
	return (
		<ul
			aria-hidden
			className="divide-y divide-zinc-950/5 rounded-lg border border-zinc-950/10 dark:divide-white/5 dark:border-white/10"
		>
			{Array.from({ length: 4 }).map((_, i) => (
				<li
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
					key={i}
					className="flex items-center justify-between gap-4 px-4 py-3"
				>
					<span className="h-4 w-48 animate-pulse rounded bg-zinc-950/5 dark:bg-white/5" />
					<span className="h-3 w-16 animate-pulse rounded bg-zinc-950/5 dark:bg-white/5" />
				</li>
			))}
		</ul>
	);
}

function ChatsError({
	message,
	isRetrying,
	onRetry,
}: {
	message: string;
	isRetrying: boolean;
	onRetry: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-red-500/30 px-6 py-16 text-center dark:border-red-400/30">
			<AlertCircle className="size-8 text-red-600 dark:text-red-400" />
			<p className="font-medium text-zinc-950 dark:text-white">
				Couldn't load chats
			</p>
			<p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
				{message}
			</p>
			<Button type="button" outline disabled={isRetrying} onClick={onRetry}>
				{isRetrying ? "Retrying…" : "Try again"}
			</Button>
		</div>
	);
}
