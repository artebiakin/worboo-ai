import { createFileRoute } from "@tanstack/react-router";
import { LoginView } from "#/presentation/login/view";

export const Route = createFileRoute("/login")({ component: LoginView });
