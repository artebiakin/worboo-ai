import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	type ClarificationQuestion,
	type GenerateWorkbookResult,
	generateWorkbook,
	type Workbook,
} from "#/domain/workbook";
import { logger } from "#/logger";
import type { ClarificationAnswer } from "../components/ChatQuestions";

const log = logger.scope("chat");

const FALLBACK_ERROR =
	"Could not generate the workbook. Check the server logs for details.";

export type ChatPhase = "composer" | "building" | "questions" | "preview";

export function useChat({
	chatId,
	initialPrompt,
}: {
	chatId: string;
	initialPrompt?: string;
}) {
	const [composerValue, setComposerValue] = useState("");
	const [prompt, setPrompt] = useState<string | null>(initialPrompt ?? null);
	const [workbook, setWorkbook] = useState<Workbook | null>(null);
	const [clarificationQuestions, setClarificationQuestions] = useState<
		ClarificationQuestion[] | null
	>(null);

	const mutation = useMutation<GenerateWorkbookResult, Error, string>({
		mutationFn: async (promptText) =>
			generateWorkbook({ data: { prompt: promptText } }),
		onSuccess: (result) => {
			if (result.type === "workbook") {
				log.info("generate workbook success", {
					type: result.type,
					exerciseCount: result.workbook.exercises.length,
				});
				setWorkbook(result.workbook);
				setClarificationQuestions(null);
				return;
			}
			log.info("generate workbook returned questions", {
				type: result.type,
				questionCount: result.questions.length,
			});
			if (result.questions.length === 0) {
				log.error("model returned questions envelope with empty array");
				toast.error(
					"Worboo didn't return any questions. Try rephrasing your prompt.",
				);
				setComposerValue(prompt ?? "");
				setPrompt(null);
				return;
			}
			setClarificationQuestions(result.questions);
			setWorkbook(null);
		},
		onError: (err) => {
			const message = err.message || FALLBACK_ERROR;
			log.error("generate workbook failed", err, { summary: message });
			toast.error(message);
			setComposerValue(prompt ?? "");
			setPrompt(null);
		},
	});

	// When the user arrives with an `initialPrompt` (e.g. they typed in the
	// home composer and navigated here), kick off the generation once on
	// mount. Guarded by a ref so strict-mode double-invocation and prop
	// changes can't fire a second request.
	const kickedOffRef = useRef(false);
	useEffect(() => {
		if (!initialPrompt || kickedOffRef.current) return;
		kickedOffRef.current = true;
		mutation.mutate(initialPrompt);
	}, [initialPrompt, mutation.mutate]);

	const buildPercent = useFakeProgress(mutation.isPending);

	const phase: ChatPhase = derivePhase({
		prompt,
		workbook,
		clarificationQuestions,
		isPending: mutation.isPending,
	});

	function handleSubmitComposer(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = composerValue.trim();
		if (!trimmed || mutation.isPending) return;
		setPrompt(trimmed);
		setComposerValue("");
		setWorkbook(null);
		setClarificationQuestions(null);
		mutation.mutate(trimmed);
	}

	function handleSubmitAnswers(answers: ClarificationAnswer[]) {
		if (prompt === null || mutation.isPending) return;
		const enriched = appendAnswersToPrompt(prompt, answers);
		setClarificationQuestions(null);
		mutation.mutate(enriched);
	}

	return {
		chatId,
		phase,
		prompt,
		workbook,
		clarificationQuestions,
		buildPercent,
		composerValue,
		setComposerValue,
		canSubmitComposer: composerValue.trim().length > 0 && !mutation.isPending,
		handleSubmitComposer,
		handleSubmitAnswers,
		isGenerating: mutation.isPending,
	};
}

function derivePhase({
	prompt,
	workbook,
	clarificationQuestions,
	isPending,
}: {
	prompt: string | null;
	workbook: Workbook | null;
	clarificationQuestions: ClarificationQuestion[] | null;
	isPending: boolean;
}): ChatPhase {
	if (prompt === null) return "composer";
	if (isPending) return "building";
	if (workbook) return "preview";
	if (clarificationQuestions && clarificationQuestions.length > 0) {
		return "questions";
	}
	// Nothing in flight, no workbook, no questions — fall back to the
	// composer instead of an indefinite "building" state. This covers the
	// brief window between `initialPrompt` being set and the kick-off
	// effect dispatching the mutation.
	return "composer";
}

function appendAnswersToPrompt(
	originalPrompt: string,
	answers: ClarificationAnswer[],
): string {
	if (answers.length === 0) return originalPrompt;
	const lines = answers.map((a) => `- ${a.question.text} → ${a.selectedLabel}`);
	return `${originalPrompt}\n\nAdditional details from the teacher:\n${lines.join("\n")}`;
}

/**
 * Asymptotic progress that approaches 95% but never reaches 100%. The bar
 * always moves while the request is in flight, so it doesn't sit pinned at a
 * fake 100% for 15+ seconds the way a linear ramp would. Real completion
 * transitions us out of the building screen, so the cap stays invisible.
 */
function useFakeProgress(active: boolean): number {
	const [percent, setPercent] = useState(0);

	useEffect(() => {
		if (!active) {
			setPercent(0);
			return;
		}
		const id = setInterval(() => {
			setPercent((p) => {
				const delta = (95 - p) * 0.08;
				return Math.min(95, p + Math.max(0.3, delta));
			});
		}, 400);
		return () => clearInterval(id);
	}, [active]);

	return Math.round(percent);
}
