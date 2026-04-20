import { createFileRoute } from "@tanstack/react-router";
import { ChatsView } from "#/presentation/chats/view";

export const Route = createFileRoute("/dashboard/chats")({
	component: ChatsView,
});
