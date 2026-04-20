import { useState } from "react";

export function useAppHome() {
	const [prompt, setPrompt] = useState("");

	return {
		prompt,
		setPrompt,
		canSubmit: prompt.trim().length > 0,
		handleSubmit: (e: React.FormEvent) => e.preventDefault(),
	};
}
