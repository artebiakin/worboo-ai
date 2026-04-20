interface SuggestionChipProps {
	label: string;
	onSelect: (label: string) => void;
}

export function SuggestionChip({ label, onSelect }: SuggestionChipProps) {
	return (
		<button
			type="button"
			onClick={() => onSelect(label)}
			className="rounded-full border border-zinc-950/10 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-zinc-600 backdrop-blur transition-[transform,color,border-color] hover:-translate-y-0.5 hover:border-violet-400 hover:text-zinc-950 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 sm:text-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-white"
		>
			{label}
		</button>
	);
}
