import { createFileRoute } from "@tanstack/react-router";
import { AppHomeView } from "#/presentation/app-home/view";

export const Route = createFileRoute("/dashboard/")({
	component: AppHomeView,
});
