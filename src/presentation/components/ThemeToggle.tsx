import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "#/presentation/components/catalyst/button";
import { type ThemeMode, useTheme } from "#/presentation/hooks";

export default function ThemeToggle() {
	const { mode, setMode } = useTheme();

	function toggleMode() {
		const next: ThemeMode =
			mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";
		setMode(next);
	}

	const label =
		mode === "auto"
			? "Theme: auto. Click to switch to light."
			: `Theme: ${mode}. Click to change.`;

	const Icon = mode === "auto" ? Monitor : mode === "dark" ? Moon : Sun;

	return (
		<Button plain aria-label={label} title={label} onClick={toggleMode}>
			<Icon data-slot="icon" />
		</Button>
	);
}
