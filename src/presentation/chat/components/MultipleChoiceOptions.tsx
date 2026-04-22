import type { MultipleChoiceOption } from "#/domain/workbook";
import { optionCardStyle } from "./option-card-style";

interface MultipleChoiceOptionsProps {
	name: string;
	options: MultipleChoiceOption[];
	selected: string | null;
	onSelect: (value: string) => void;
	revealCorrect: boolean;
	disabled?: boolean;
}

export function MultipleChoiceOptions({
	name,
	options,
	selected,
	onSelect,
	revealCorrect,
	disabled,
}: MultipleChoiceOptionsProps) {
	return (
		<ul className="space-y-2">
			{options.map((opt) => {
				const isSelected = selected === opt.text;
				const showCorrect = revealCorrect && opt.isCorrect;
				return (
					<li key={opt.text}>
						<label
							className={`flex items-start gap-4 rounded-lg border px-5 py-3 ${optionCardStyle(isSelected, showCorrect)}`}
						>
							<input
								type="radio"
								name={name}
								className={`mt-1 size-4 ${showCorrect ? "accent-emerald-600" : "accent-violet-600"}`}
								checked={isSelected}
								disabled={disabled}
								onChange={() => onSelect(opt.text)}
							/>
							<span className="mt-0.5 w-4 text-xs font-medium text-zinc-400 dark:text-zinc-500">
								{opt.label}
							</span>
							<span className="min-w-0 flex-1">{opt.text}</span>
						</label>
					</li>
				);
			})}
		</ul>
	);
}
