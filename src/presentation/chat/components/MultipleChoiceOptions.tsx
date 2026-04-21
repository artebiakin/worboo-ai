import type { MultipleChoiceOption } from "#/domain/workbook";
import { optionCardStyle } from "./option-card-style";

interface MultipleChoiceOptionsProps {
	name: string;
	options: MultipleChoiceOption[];
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
				const isSelected = selected === opt.text;
				return (
					<li key={opt.text}>
						<label
							className={`flex items-center gap-4 rounded-lg border px-5 py-3 ${optionCardStyle(isSelected)}`}
						>
							<input
								type="radio"
								name={name}
								className="size-4 accent-violet-600"
								checked={isSelected}
								onChange={() => onSelect(opt.text)}
							/>
							<span className="w-4 text-xs font-medium text-zinc-400 dark:text-zinc-500">
								{letter}
							</span>
							<span>{opt.text}</span>
						</label>
					</li>
				);
			})}
		</ul>
	);
}
