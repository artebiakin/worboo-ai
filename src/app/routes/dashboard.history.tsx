import { createFileRoute } from "@tanstack/react-router";
import { AppHistoryView } from "#/presentation/app-history/view";

export const Route = createFileRoute("/dashboard/history")({
	component: AppHistoryView,
});
