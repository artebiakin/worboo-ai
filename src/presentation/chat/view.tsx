import { ChatComposer } from "./components/ChatComposer";
import { ChatProgress } from "./components/ChatProgress";
import { ChatQuestions } from "./components/ChatQuestions";
import { PromptCard } from "./components/PromptCard";
import { useChat } from "./hooks";

interface ChatViewProps {
	chatId: string;
	initialPrompt?: string;
}

export function ChatView({ chatId, initialPrompt }: ChatViewProps) {
	const {
		phase,
		prompt,
		progress,
		composerValue,
		setComposerValue,
		canSubmitComposer,
		handleSubmitComposer,
	} = useChat({ chatId, initialPrompt });

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
					{phase === "progress" ? (
						<ChatProgress percent={progress} />
					) : (
						<ChatQuestions />
					)}
				</div>
			)}
		</div>
	);
}
