import { Check, Contrast, Monitor, Moon, Sun } from "lucide-react";
import {
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "#/presentation/components/shadcn/dropdown-menu";
import { type ThemeMode, useTheme } from "#/presentation/hooks";

const THEME_OPTIONS: Array<{
	mode: ThemeMode;
	label: string;
	Icon: typeof Sun;
}> = [
	{ mode: "light", label: "Light", Icon: Sun },
	{ mode: "dark", label: "Dark", Icon: Moon },
	{ mode: "auto", label: "System", Icon: Monitor },
];

export function ThemeMenu() {
	const { mode, setMode } = useTheme();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<Contrast />
				Appearance
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="w-40">
				<DropdownMenuLabel>Theme</DropdownMenuLabel>
				{THEME_OPTIONS.map(({ mode: optionMode, label, Icon }) => (
					<DropdownMenuItem
						key={optionMode}
						onSelect={() => setMode(optionMode)}
					>
						<Icon />
						<span className="flex-1">{label}</span>
						{mode === optionMode ? (
							<Check className="text-zinc-500 dark:text-zinc-400" />
						) : null}
					</DropdownMenuItem>
				))}
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
