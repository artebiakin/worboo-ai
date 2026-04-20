import { useEffect, useState } from "react";

export type ChatPhase = "composer" | "progress" | "questions";

export function useChat({
	chatId,
	initialPrompt,
}: {
	chatId: string;
	initialPrompt?: string;
}) {
	const [composerValue, setComposerValue] = useState("");
	const [prompt, setPrompt] = useState<string | null>(initialPrompt ?? null);
	const progress = useFakeProgress(prompt !== null);

	const phase: ChatPhase =
		prompt === null ? "composer" : progress >= 100 ? "questions" : "progress";

	function handleSubmitComposer(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = composerValue.trim();
		if (!trimmed) return;
		setPrompt(trimmed);
		setComposerValue("");
	}

	return {
		chatId,
		phase,
		prompt,
		progress,
		composerValue,
		setComposerValue,
		canSubmitComposer: composerValue.trim().length > 0,
		handleSubmitComposer,
	};
}

function useFakeProgress(active: boolean): number {
	const [percent, setPercent] = useState(0);

	useEffect(() => {
		if (!active) return;
		const id = setInterval(() => {
			setPercent((p) => {
				if (p >= 100) {
					clearInterval(id);
					return p;
				}
				return p + 1;
			});
		}, 150);
		return () => clearInterval(id);
	}, [active]);

	return percent;
}
