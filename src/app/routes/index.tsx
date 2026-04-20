import { createFileRoute } from "@tanstack/react-router";
import { MarketingView } from "#/presentation/marketing/view";

export const Route = createFileRoute("/")({ component: MarketingView });
