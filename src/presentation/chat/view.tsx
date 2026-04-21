import { ChatComposer } from "./components/ChatComposer";
import { ChatProgress, type ProgressStep } from "./components/ChatProgress";
import { ChatQuestions } from "./components/ChatQuestions";
import { MOCK_WORKBOOK } from "./components/mock-workbook";
import { PromptCard } from "./components/PromptCard";
import { WorkbookPreview } from "./components/WorkbookPreview";
import { useChat } from "./hooks";

const ANALYSIS_STEPS: readonly ProgressStep[] = [
	{ id: "understanding", label: "Understanding your request" },
	{ id: "planning", label: "Planning exercises" },
];

const BUILD_STEPS: readonly ProgressStep[] = [
	{ id: "writing", label: "Writing content" },
	{ id: "explaining", label: "Adding explanations" },
];

interface ChatViewProps {
	chatId: string;
	initialPrompt?: string;
}

export function ChatView({ chatId, initialPrompt }: ChatViewProps) {
	const {
		phase,
		prompt,
		analysisPercent,
		buildPercent,
		composerValue,
		setComposerValue,
		canSubmitComposer,
		handleSubmitComposer,
		handleGenerate,
	} = useChat({ chatId, initialPrompt });

	if (phase === "preview") {
		return <WorkbookPreview workbook={MOCK_WORKBOOK} />;
	}

	return (
		<div className="-m-6 flex min-h-[calc(100svh-3rem)] items-center justify-center px-6 py-16 lg:-m-10 lg:min-h-[calc(100svh-1rem)] lg:px-10">
			{phase === "composer" || prompt === null ? (
				<ChatComposer
					value={composerValue}
					onChange={setComposerValue}
					canSubmit={canSubmitComposer}
					onSubmit={handleSubmitComposer}
				/>
			) : (
				<div className="mx-auto w-full max-w-3xl space-y-6">
					<PromptCard prompt={prompt} />
					{phase === "analyzing" ? (
						<ChatProgress
							percent={analysisPercent}
							steps={ANALYSIS_STEPS}
							footerText="Analysing your prompt. Just a moment…"
						/>
					) : phase === "building" ? (
						<ChatProgress
							percent={buildPercent}
							steps={BUILD_STEPS}
							footerText="Building your workbook. This usually takes 10–20 seconds."
						/>
					) : (
						<ChatQuestions onGenerate={handleGenerate} />
					)}
				</div>
			)}
		</div>
	);
}
