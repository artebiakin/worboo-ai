import { Button } from "#/presentation/components/catalyst/button";
import Logo from "#/presentation/components/Logo";
import ThemeToggle from "#/presentation/components/ThemeToggle";

export default function Header() {
	return (
		<>
			<div className="absolute top-3 left-6 z-50 sm:top-4 sm:left-8 lg:left-12">
				<Logo />
			</div>
			<div className="absolute top-3 right-6 z-50 flex items-center gap-1 sm:top-4 sm:right-8 sm:gap-2 lg:right-12">
				<ThemeToggle />
				<Button plain href="/login">
					Log in
				</Button>
				<Button color="violet" href="/">
					Get started
				</Button>
			</div>
		</>
	);
}
