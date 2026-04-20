import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { createChat } from "#/domain/chat";
import { logger } from "#/logger";

const log = logger.scope("app-home");

export function useAppHome() {
	const navigate = useNavigate();
	const [prompt, setPrompt] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = prompt.trim();
		if (!trimmed || isSubmitting) return;
		setIsSubmitting(true);
		try {
			const chat = await createChat();
			await navigate({
				to: "/dashboard/chats/$chatId",
				params: { chatId: chat.id },
				state: { initialPrompt: trimmed },
			});
		} catch (err) {
			log.error("create chat from home failed", err);
			toast.error(
				err instanceof Error ? err.message : "Could not start a new chat.",
			);
			setIsSubmitting(false);
		}
	}

	return {
		prompt,
		setPrompt,
		canSubmit: prompt.trim().length > 0 && !isSubmitting,
		isSubmitting,
		handleSubmit,
	};
}
