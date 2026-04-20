import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { createChat, getChats } from "#/domain/chat";
import { logger } from "#/logger";

const log = logger.scope("chats");

export function useChats() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [isCreating, setIsCreating] = useState(false);

	const {
		data: chats,
		isLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["chats"],
		queryFn: getChats,
	});

	async function handleCreateChat() {
		if (isCreating) return;
		setIsCreating(true);
		try {
			const chat = await createChat();
			await queryClient.invalidateQueries({ queryKey: ["chats"] });
			await navigate({
				to: "/dashboard/chats/$chatId",
				params: { chatId: chat.id },
			});
		} catch (err) {
			log.error("create chat failed", err);
			toast.error(
				err instanceof Error ? err.message : "Could not create chat.",
			);
			setIsCreating(false);
		}
	}

	return {
		chats: chats ?? [],
		isLoading,
		error,
		isRefetching,
		handleRetry: () => refetch(),
		isCreating,
		handleCreateChat,
	};
}
