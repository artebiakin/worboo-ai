import * as Headless from "@headlessui/react";
import { useRouter } from "@tanstack/react-router";
import type React from "react";
import { forwardRef } from "react";

function isExternalHref(href: string) {
	return (
		/^(https?:)?\/\//.test(href) ||
		href.startsWith("mailto:") ||
		href.startsWith("tel:") ||
		href.startsWith("#")
	);
}

export const Link = forwardRef(function Link(
	props: { href: string } & React.ComponentPropsWithoutRef<"a">,
	ref: React.ForwardedRef<HTMLAnchorElement>,
) {
	const { href, onClick, target, ...rest } = props;
	const router = useRouter();
	const external = isExternalHref(href) || target === "_blank";

	function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
		onClick?.(e);
		if (external || e.defaultPrevented) return;
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
			return;
		e.preventDefault();
		router.navigate({ to: href as unknown as "/" });
	}

	return (
		<Headless.DataInteractive>
			<a
				ref={ref}
				href={href}
				target={target}
				onClick={handleClick}
				{...rest}
			/>
		</Headless.DataInteractive>
	);
});
