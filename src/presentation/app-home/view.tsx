import { ArrowUp } from "lucide-react";
import { Button } from "#/presentation/components/catalyst/button";
import { Textarea } from "#/presentation/components/catalyst/textarea";
import { useAppHome } from "./hooks";

export function AppHomeView() {
	const { prompt, setPrompt, canSubmit, handleSubmit } = useAppHome();

	return (
		<>
			<div
				aria-hidden="true"
				className="pointer-events-none fixed inset-x-0 top-14 bottom-0 z-0 bg-hero-gradient lg:inset-2 lg:left-64 lg:rounded-lg"
			/>
			<div className="relative z-10 -m-6 flex min-h-[calc(100svh-3rem)] items-center justify-center px-6 py-16 lg:-m-10 lg:min-h-[calc(100svh-1rem)] lg:px-10">
				<div className="w-full max-w-4xl text-center">
					<h1 className="mx-auto max-w-3xl font-display text-4xl leading-tight font-bold tracking-tight text-zinc-950 sm:text-6xl dark:text-white">
						Welcome back
					</h1>
					<p className="mx-auto mt-5 max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
						Describe a lesson. Get an interactive, self-grading workbook.
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
				</div>
			</div>
		</>
	);
}
