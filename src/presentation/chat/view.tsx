import { ChatComposer } from "./components/ChatComposer";
import { ChatGenerating } from "./components/ChatGenerating";
import { useChat } from "./hooks";

interface ChatViewProps {
	chatId: string;
	initialPrompt?: string;
}

export function ChatView({ chatId, initialPrompt }: ChatViewProps) {
	const {
		prompt,
		composerValue,
		setComposerValue,
		canSubmitComposer,
		handleSubmitComposer,
	} = useChat({ chatId, initialPrompt });

	return (
		<div className="-m-6 flex min-h-[calc(100svh-3rem)] items-center justify-center px-6 py-16 lg:-m-10 lg:min-h-[calc(100svh-1rem)] lg:px-10">
			{prompt === null ? (
				<ChatComposer
					value={composerValue}
					onChange={setComposerValue}
					canSubmit={canSubmitComposer}
					onSubmit={handleSubmitComposer}
				/>
			) : (
				<ChatGenerating prompt={prompt} />
			)}
		</div>
	);
}
