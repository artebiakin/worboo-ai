import { useState } from "react";

const SUGGESTIONS = [
	"English past simple, A2 level",
	"Spanish present tense workbook, B1",
	"Reading comprehension: short dialogues",
	"Vocabulary: travel & transportation",
];

export function useMarketing() {
	const [prompt, setPrompt] = useState("");

	return {
		prompt,
		setPrompt,
		suggestions: SUGGESTIONS,
		canSubmit: prompt.trim().length > 0,
		applySuggestion: (s: string) => setPrompt(s),
		handleSubmit: (e: React.FormEvent) => e.preventDefault(),
	};
}
