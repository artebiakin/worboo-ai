import { ArrowUp } from "lucide-react";
import { Button } from "#/presentation/components/catalyst/button";
import { Textarea } from "#/presentation/components/catalyst/textarea";
import Header from "./components/Header";
import { SuggestionChip } from "./components/SuggestionChip";
import { useMarketing } from "./hooks";

export function MarketingView() {
	const {
		prompt,
		setPrompt,
		suggestions,
		canSubmit,
		applySuggestion,
		handleSubmit,
	} = useMarketing();

	return (
		<>
			<Header />
			<main className="flex h-screen w-full flex-col items-center justify-center bg-hero-gradient">
				<div className="w-full max-w-3xl text-center">
					<h1 className="mt-6 font-display text-4xl leading-tight font-bold tracking-tight text-zinc-950 sm:text-6xl dark:text-white">
						Create something teachers love
					</h1>

					<p className="mx-auto mt-5 max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
						Describe your lesson. Get an interactive, self-grading workbook.
					</p>

					<form onSubmit={handleSubmit} className="mx-auto mt-10 text-left">
						<div className="relative">
							<Textarea
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
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
									aria-label="Generate workbook"
								>
									<ArrowUp data-slot="icon" />
								</Button>
							</span>
						</div>
					</form>

					<div className="mt-6 flex flex-wrap items-center justify-center gap-2">
						{suggestions.map((s) => (
							<SuggestionChip key={s} label={s} onSelect={applySuggestion} />
						))}
					</div>
				</div>
			</main>
		</>
	);
}
