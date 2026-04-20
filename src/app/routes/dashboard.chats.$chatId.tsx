import { createFileRoute, useLocation } from "@tanstack/react-router";
import { ChatView } from "#/presentation/chat/view";

export const Route = createFileRoute("/dashboard/chats/$chatId")({
	component: ChatRoute,
});

function ChatRoute() {
	const { chatId } = Route.useParams();
	const { state } = useLocation();
	return <ChatView chatId={chatId} initialPrompt={state.initialPrompt} />;
}
