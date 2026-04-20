import { ArrowUp } from "lucide-react";
import { Button } from "#/presentation/components/catalyst/button";
import { Textarea } from "#/presentation/components/catalyst/textarea";

interface ChatComposerProps {
	value: string;
	onChange: (value: string) => void;
	canSubmit: boolean;
	onSubmit: (e: React.FormEvent) => void;
}

export function ChatComposer({
	value,
	onChange,
	canSubmit,
	onSubmit,
}: ChatComposerProps) {
	return (
		<div className="mx-auto w-full max-w-3xl">
			<div className="space-y-1 text-center">
				<h1 className="font-display text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
					What should we build?
				</h1>
				<p className="text-zinc-600 dark:text-zinc-400">
					Describe the workbook — grammar focus, level, length.
				</p>
			</div>
			<form onSubmit={onSubmit} className="mt-8 text-left">
				<div className="relative">
					<Textarea
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder="e.g. English past simple, A2 level, 20 min lesson…"
						resizable={false}
						rows={4}
						className="[&_textarea]:min-h-32 [&_textarea]:pr-14 [&_textarea]:text-base"
					/>
					<span className="absolute right-2 bottom-2">
						<Button
							type="submit"
							color="violet"
							disabled={!canSubmit}
							aria-label="Send prompt"
						>
							<ArrowUp data-slot="icon" />
						</Button>
					</span>
				</div>
			</form>
		</div>
	);
}
