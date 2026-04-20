import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "auto";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";

function readInitialMode(): ThemeMode {
	if (typeof window === "undefined") return "auto";
	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === "light" || stored === "dark" || stored === "auto") {
		return stored;
	}
	return "auto";
}

function readResolved(): ResolvedTheme {
	if (typeof document === "undefined") return "light";
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyThemeMode(mode: ThemeMode) {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved: ResolvedTheme =
		mode === "auto" ? (prefersDark ? "dark" : "light") : mode;

	const root = document.documentElement;
	root.classList.remove("light", "dark");
	root.classList.add(resolved);
	if (mode === "auto") {
		root.removeAttribute("data-theme");
	} else {
		root.setAttribute("data-theme", mode);
	}
	root.style.colorScheme = resolved;
}

export function useTheme() {
	const [mode, setModeState] = useState<ThemeMode>("auto");
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

	useEffect(() => {
		const initial = readInitialMode();
		setModeState(initial);
		applyThemeMode(initial);
		setResolvedTheme(readResolved());
	}, []);

	useEffect(() => {
		const root = document.documentElement;
		const update = () => setResolvedTheme(readResolved());
		const observer = new MutationObserver(update);
		observer.observe(root, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (mode !== "auto") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyThemeMode("auto");
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, [mode]);

	function setMode(next: ThemeMode) {
		setModeState(next);
		applyThemeMode(next);
		window.localStorage.setItem(STORAGE_KEY, next);
	}

	return { mode, resolvedTheme, setMode };
}
