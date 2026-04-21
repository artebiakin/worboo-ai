import { useEffect, useState } from "react";

export type ChatPhase =
	| "composer"
	| "analyzing"
	| "questions"
	| "building"
	| "preview";

export function useChat({
	chatId,
	initialPrompt,
}: {
	chatId: string;
	initialPrompt?: string;
}) {
	const [composerValue, setComposerValue] = useState("");
	const [prompt, setPrompt] = useState<string | null>(initialPrompt ?? null);
	const [generateStarted, setGenerateStarted] = useState(false);

	const analysisPercent = useFakeProgress(prompt !== null && !generateStarted);
	const buildPercent = useFakeProgress(generateStarted);

	const phase = derivePhase({
		prompt,
		generateStarted,
		analysisPercent,
		buildPercent,
	});

	function handleSubmitComposer(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = composerValue.trim();
		if (!trimmed) return;
		setPrompt(trimmed);
		setComposerValue("");
	}

	function handleGenerate() {
		setGenerateStarted(true);
	}

	return {
		chatId,
		phase,
		prompt,
		analysisPercent,
		buildPercent,
		composerValue,
		setComposerValue,
		canSubmitComposer: composerValue.trim().length > 0,
		handleSubmitComposer,
		handleGenerate,
	};
}

function derivePhase({
	prompt,
	generateStarted,
	analysisPercent,
	buildPercent,
}: {
	prompt: string | null;
	generateStarted: boolean;
	analysisPercent: number;
	buildPercent: number;
}): ChatPhase {
	if (prompt === null) return "preview";
	if (!generateStarted)
		return analysisPercent >= 100 ? "questions" : "analyzing";
	return buildPercent >= 100 ? "preview" : "building";
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
		}, 50);
		return () => clearInterval(id);
	}, [active]);

	return percent;
}
