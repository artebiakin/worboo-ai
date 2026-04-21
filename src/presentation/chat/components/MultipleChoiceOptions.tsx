import type { MultipleChoiceOption } from "#/domain/workbook";
import { CorrectBadge } from "./ExplanationPanel";
import { optionCardStyle } from "./option-card-style";

interface MultipleChoiceOptionsProps {
	name: string;
	options: MultipleChoiceOption[];
	selected: string | null;
	onSelect: (value: string) => void;
	revealCorrect: boolean;
}

export function MultipleChoiceOptions({
	name,
	options,
	selected,
	onSelect,
	revealCorrect,
}: MultipleChoiceOptionsProps) {
	return (
		<ul className="space-y-2">
			{options.map((opt, i) => {
				const letter = String.fromCharCode(65 + i);
				const isSelected = selected === opt.text;
				return (
					<li key={opt.text}>
						<label
							className={`flex items-start gap-4 rounded-lg border px-5 py-3 ${optionCardStyle(isSelected)}`}
						>
							<input
								type="radio"
								name={name}
								className="mt-1 size-4 accent-violet-600"
								checked={isSelected}
								onChange={() => onSelect(opt.text)}
							/>
							<span className="mt-0.5 w-4 text-xs font-medium text-zinc-400 dark:text-zinc-500">
								{letter}
							</span>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<span>{opt.text}</span>
									{revealCorrect && opt.isCorrect ? <CorrectBadge /> : null}
								</div>
								{revealCorrect ? (
									<p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
										{opt.explanationIfChosen}
									</p>
								) : null}
							</div>
						</label>
					</li>
				);
			})}
		</ul>
	);
}
