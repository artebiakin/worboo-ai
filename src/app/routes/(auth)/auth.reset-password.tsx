import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordView } from "#/presentation/reset-password/view";

export const Route = createFileRoute("/(auth)/auth/reset-password")({
	component: ResetPasswordView,
});
