import { Link as TSRLink } from "@tanstack/react-router";
import { Button } from "#/presentation/components/catalyst/button";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
	return (
		<header className="absolute inset-x-0 top-0 z-50 bg-transparent">
			<nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:py-4">
				<TSRLink
					to="/"
					aria-label="Worboo home"
					className="group inline-flex items-center gap-2"
				>
					<span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-sm transition-transform group-hover:-rotate-6 group-hover:scale-110 group-active:scale-95 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100 motion-reduce:group-active:scale-100">
						W
					</span>
					<span className="font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
						Worboo
					</span>
				</TSRLink>

				<div className="ml-auto flex items-center gap-1 sm:gap-2">
					<ThemeToggle />
					<Button plain href="/">
						Log in
					</Button>
					<Button color="violet" href="/">
						Get started
					</Button>
				</div>
			</nav>
		</header>
	);
}
