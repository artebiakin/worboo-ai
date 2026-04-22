import { ChatComposer } from "./components/ChatComposer";
import { ChatProgress, type ProgressStep } from "./components/ChatProgress";
import { ChatQuestions } from "./components/ChatQuestions";
import { PromptCard } from "./components/PromptCard";
import { WorkbookPreview } from "./components/WorkbookPreview";
import { useChat } from "./hooks";

const BUILD_STEPS: readonly ProgressStep[] = [
	{ id: "planning", label: "Planning exercises" },
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
		workbook,
		clarificationQuestions,
		buildPercent,
		composerValue,
		setComposerValue,
		canSubmitComposer,
		handleSubmitComposer,
		handleSubmitAnswers,
		isGenerating,
	} = useChat({ chatId, initialPrompt });

	if (phase === "preview" && workbook) {
		return <WorkbookPreview workbook={workbook} />;
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
			) : phase === "questions" && clarificationQuestions ? (
				<div className="mx-auto w-full max-w-3xl space-y-6">
					<PromptCard prompt={prompt} />
					<ChatQuestions
						questions={clarificationQuestions}
						isGenerating={isGenerating}
						onSubmit={handleSubmitAnswers}
					/>
				</div>
			) : (
				<div className="mx-auto w-full max-w-3xl space-y-6">
					<PromptCard prompt={prompt} />
					<ChatProgress
						percent={buildPercent}
						steps={BUILD_STEPS}
						footerText="Building your workbook. This usually takes 10–20 seconds."
					/>
				</div>
			)}
		</div>
	);
}
