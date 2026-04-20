import { Link as TSRLink } from "@tanstack/react-router";
import clsx from "clsx";

type LogoProps = {
	className?: string;
	linkClassName?: string;
};

export default function Logo({ className, linkClassName }: LogoProps) {
	return (
		<TSRLink
			to="/"
			aria-label="Worboo home"
			className={clsx("group inline-flex items-center gap-2", linkClassName)}
		>
			<span
				className={clsx(
					"font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-white",
					className,
				)}
			>
				Worboo
			</span>
		</TSRLink>
	);
}
