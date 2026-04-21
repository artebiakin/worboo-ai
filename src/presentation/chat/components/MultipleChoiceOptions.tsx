import { optionCardStyle } from "./option-card-style";

interface MultipleChoiceOptionsProps {
	name: string;
	options: string[];
	selected: string | null;
	onSelect: (value: string) => void;
}

export function MultipleChoiceOptions({
	name,
	options,
	selected,
	onSelect,
}: MultipleChoiceOptionsProps) {
	return (
		<ul className="space-y-2">
			{options.map((opt, i) => {
				const letter = String.fromCharCode(65 + i);
				const isSelected = selected === opt;
				return (
					<li key={opt}>
						<label
							className={`flex items-center gap-4 rounded-lg border px-5 py-3 ${optionCardStyle(isSelected)}`}
						>
							<input
								type="radio"
								name={name}
								className="size-4 accent-violet-600"
								checked={isSelected}
								onChange={() => onSelect(opt)}
							/>
							<span className="w-4 text-xs font-medium text-zinc-400 dark:text-zinc-500">
								{letter}
							</span>
							<span>{opt}</span>
						</label>
					</li>
				);
			})}
		</ul>
	);
}
