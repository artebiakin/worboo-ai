import { Link as TSRLink } from "@tanstack/react-router";
import { Button } from "#/presentation/components/catalyst/button";
import {
	Checkbox,
	CheckboxField,
} from "#/presentation/components/catalyst/checkbox";
import { Field, Label } from "#/presentation/components/catalyst/fieldset";
import { Heading } from "#/presentation/components/catalyst/heading";
import { Input } from "#/presentation/components/catalyst/input";
import { Text } from "#/presentation/components/catalyst/text";
import Logo from "#/presentation/components/Logo";
import { useLogin } from "./hooks";

export function LoginView() {
	const {
		email,
		setEmail,
		password,
		setPassword,
		remember,
		setRemember,
		canSubmit,
		handleSubmit,
	} = useLogin();

	return (
		<main className="grid min-h-dvh lg:grid-cols-2">
			<section className="relative flex items-center justify-center px-6 py-24 sm:py-28 lg:px-12">
				<div className="absolute top-3 left-6 sm:top-4 sm:left-8 lg:left-12">
					<Logo />
				</div>
				<form
					onSubmit={handleSubmit}
					className="w-full max-w-sm space-y-6"
					noValidate
				>
					<div className="space-y-1">
						<Heading>Welcome back</Heading>
						<Text>Sign in to keep building workbooks for your class.</Text>
					</div>

					<div className="space-y-5">
						<Field>
							<Label>Email</Label>
							<Input
								type="email"
								name="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Field>

						<Field>
							<Label>Password</Label>
							<Input
								type="password"
								name="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Field>

						<div className="flex items-center justify-between">
							<CheckboxField>
								<Checkbox
									name="remember"
									checked={remember}
									onChange={setRemember}
								/>
								<Label>Remember me</Label>
							</CheckboxField>
							<TSRLink
								to="/forgot-password"
								className="text-sm text-zinc-600 underline decoration-zinc-950/30 hover:decoration-zinc-950 dark:text-zinc-400 dark:decoration-white/30 dark:hover:decoration-white"
							>
								Forgot password?
							</TSRLink>
						</div>
					</div>

					<Button
						type="submit"
						color="violet"
						disabled={!canSubmit}
						className="w-full"
					>
						Sign in
					</Button>

					<Text className="text-center">
						New to Worboo?{" "}
						<TSRLink
							to="/signup"
							className="font-medium text-zinc-950 underline decoration-zinc-950/50 hover:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:hover:decoration-white"
						>
							Create an account
						</TSRLink>
					</Text>
				</form>
			</section>

			<aside className="relative hidden overflow-hidden bg-hero-gradient lg:block">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_55%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
				<div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
					<span className="font-display text-sm font-semibold tracking-wide text-zinc-700 uppercase dark:text-zinc-300">
						Worboo for teachers
					</span>

					<div className="max-w-md space-y-6">
						<p className="font-display text-3xl leading-tight font-bold tracking-tight text-zinc-950 xl:text-4xl dark:text-white">
							“A week of worksheet prep, done before my coffee goes cold.”
						</p>
						<div className="text-sm text-zinc-700 dark:text-zinc-300">
							<p className="font-medium text-zinc-950 dark:text-white">
								Marta Álvarez
							</p>
							<p>English teacher · B1–B2 adults</p>
						</div>
					</div>

					<ul className="grid gap-3 text-sm text-zinc-700 dark:text-zinc-300">
						<li>· 90-second prompt-to-workbook</li>
						<li>· Offline-ready, single HTML file</li>
						<li>· CEFR-aware defaults out of the box</li>
					</ul>
				</div>
			</aside>
		</main>
	);
}
