import { Button } from "#/presentation/components/catalyst/button";

type Provider = "google" | "apple";

interface OAuthButtonsProps {
	onProvider: (provider: Provider) => void;
	disabled?: boolean;
}

export function OAuthButtons({ onProvider, disabled }: OAuthButtonsProps) {
	return (
		<div className="grid gap-3">
			<Button
				type="button"
				outline
				disabled={disabled}
				onClick={() => onProvider("google")}
				className="w-full"
			>
				<GoogleMark />
				Continue with Google
			</Button>
			<Button
				type="button"
				outline
				disabled={disabled}
				onClick={() => onProvider("apple")}
				className="w-full"
			>
				<AppleMark />
				Continue with Apple
			</Button>
		</div>
	);
}

function GoogleMark() {
	return (
		<svg
			data-slot="icon"
			viewBox="0 0 24 24"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill="#4285F4"
				d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.39 3.57v2.97h3.86c2.26-2.08 3.58-5.15 3.58-8.78z"
			/>
			<path
				fill="#34A853"
				d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.97c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.11C3.26 21.3 7.31 24 12 24z"
			/>
			<path
				fill="#FBBC05"
				d="M5.27 14.31A7.21 7.21 0 0 1 4.88 12c0-.8.14-1.58.39-2.31V6.58H1.29A11.99 11.99 0 0 0 0 12c0 1.94.46 3.78 1.29 5.42l3.98-3.11z"
			/>
			<path
				fill="#EA4335"
				d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.98 3.11C6.22 6.86 8.87 4.75 12 4.75z"
			/>
		</svg>
	);
}

function AppleMark() {
	return (
		<svg
			data-slot="icon"
			viewBox="0 0 24 24"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
		>
			<path d="M17.05 12.64c-.03-3.12 2.54-4.62 2.66-4.69-1.45-2.12-3.71-2.41-4.51-2.44-1.92-.19-3.75 1.13-4.73 1.13-.99 0-2.49-1.1-4.09-1.07-2.1.03-4.04 1.22-5.12 3.1-2.19 3.79-.56 9.4 1.57 12.48 1.04 1.51 2.28 3.2 3.9 3.14 1.57-.06 2.16-1.01 4.06-1.01 1.9 0 2.43 1.01 4.09.98 1.69-.03 2.76-1.53 3.79-3.05 1.2-1.75 1.69-3.44 1.72-3.53-.04-.02-3.3-1.27-3.34-5.04zM14.62 3.8c.86-1.04 1.44-2.48 1.28-3.92-1.24.05-2.75.83-3.64 1.87-.8.92-1.5 2.4-1.31 3.8 1.39.11 2.8-.71 3.67-1.75z" />
		</svg>
	);
}
