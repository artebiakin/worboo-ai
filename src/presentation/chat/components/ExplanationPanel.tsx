import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";

interface ExplanationPanelProps {
	label?: string;
	children: ReactNode;
	defaultOpen?: boolean;
}

export function ExplanationPanel({
	label = "Show explanation",
	children,
	defaultOpen = true,
}: ExplanationPanelProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	return (
		<details
			open={isOpen}
			onToggle={(e) => setIsOpen(e.currentTarget.open)}
			className="group mt-5 overflow-hidden rounded-lg border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900"
		>
			<summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-950/2.5 dark:text-white dark:hover:bg-white/5 [&::-webkit-details-marker]:hidden">
				<span>{label}</span>
				<ChevronDown className="size-4 text-zinc-500 transition-transform group-open:rotate-180 dark:text-zinc-400" />
			</summary>
			<div className="border-t border-zinc-950/10 px-4 py-3 text-sm leading-relaxed text-zinc-700 dark:border-white/10 dark:text-zinc-300">
				{children}
			</div>
		</details>
	);
}
