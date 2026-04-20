import { useState } from "react";

export function useChat({
	chatId,
	initialPrompt,
}: {
	chatId: string;
	initialPrompt?: string;
}) {
	const [composerValue, setComposerValue] = useState("");
	const [submittedPrompt, setSubmittedPrompt] = useState<string | null>(
		initialPrompt ?? null,
	);

	function handleSubmitComposer(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = composerValue.trim();
		if (!trimmed) return;
		setSubmittedPrompt(trimmed);
		setComposerValue("");
	}

	return {
		chatId,
		prompt: submittedPrompt,
		composerValue,
		setComposerValue,
		canSubmitComposer: composerValue.trim().length > 0,
		handleSubmitComposer,
	};
}
