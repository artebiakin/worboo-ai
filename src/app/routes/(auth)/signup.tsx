import { createFileRoute } from "@tanstack/react-router";
import { SignupView } from "#/presentation/signup/view";

export const Route = createFileRoute("/(auth)/signup")({ component: SignupView });
