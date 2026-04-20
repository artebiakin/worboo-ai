import { createFileRoute } from "@tanstack/react-router";
import { AppView } from "#/presentation/app/view";

export const Route = createFileRoute("/app")({
	ssr: false,
	component: AppView,
});
