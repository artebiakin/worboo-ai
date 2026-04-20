import { createFileRoute } from "@tanstack/react-router";
import { HomeView } from "#/presentation/home/view";

export const Route = createFileRoute("/")({ component: HomeView });
