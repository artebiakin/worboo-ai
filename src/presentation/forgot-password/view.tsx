import { Link as TSRLink } from "@tanstack/react-router";
import { Button } from "#/presentation/components/catalyst/button";
import { Field, Label } from "#/presentation/components/catalyst/fieldset";
import { Heading } from "#/presentation/components/catalyst/heading";
import { Input } from "#/presentation/components/catalyst/input";
import { Text } from "#/presentation/components/catalyst/text";
import Logo from "#/presentation/components/Logo";
import { useForgotPassword } from "./hooks";

export function ForgotPasswordView() {
	const { email, setEmail, isSubmitted, canSubmit, handleSubmit } =
		useForgotPassword();

	return (
		<main className="grid min-h-dvh lg:grid-cols-2">
			<section className="relative flex items-center justify-center px-6 py-24 sm:py-28 lg:px-12">
				<div className="absolute top-3 left-6 sm:top-4 sm:left-8 lg:left-12">
					<Logo />
				</div>

				{isSubmitted ? (
					<div className="w-full max-w-sm space-y-6 text-center">
						<div className="space-y-2">
							<Heading>Check your inbox</Heading>
							<Text>
								If an account exists for <strong>{email}</strong>, we just sent
								a link to reset your password.
							</Text>
						</div>
						<Text>
							Didn’t get it? Check spam, or{" "}
							<TSRLink
								to="/login"
								className="font-medium text-zinc-950 underline decoration-zinc-950/50 hover:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:hover:decoration-white"
							>
								try a different email
							</TSRLink>
							.
						</Text>
					</div>
				) : (
					<form
						onSubmit={handleSubmit}
						className="w-full max-w-sm space-y-6"
						noValidate
					>
						<div className="space-y-1">
							<Heading>Reset your password</Heading>
							<Text>
								Enter the email tied to your account and we’ll send a reset
								link.
							</Text>
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
						</div>

						<Button
							type="submit"
							color="violet"
							disabled={!canSubmit}
							className="w-full"
						>
							Send reset link
						</Button>

						<Text className="text-center">
							Remembered it?{" "}
							<TSRLink
								to="/login"
								className="font-medium text-zinc-950 underline decoration-zinc-950/50 hover:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:hover:decoration-white"
							>
								Back to sign in
							</TSRLink>
						</Text>
					</form>
				)}
			</section>

			<aside className="relative hidden overflow-hidden bg-hero-gradient lg:block">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_55%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
				<div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
					<span className="font-display text-sm font-semibold tracking-wide text-zinc-700 uppercase dark:text-zinc-300">
						Worboo for teachers
					</span>

					<div className="max-w-md space-y-6">
						<p className="font-display text-3xl leading-tight font-bold tracking-tight text-zinc-950 xl:text-4xl dark:text-white">
							Back to building lessons in a minute or two.
						</p>
						<Text>
							We’ll send a one-time link to your inbox. It expires in an hour
							for safety.
						</Text>
					</div>

					<ul className="grid gap-3 text-sm text-zinc-700 dark:text-zinc-300">
						<li>· Single-use, time-limited reset link</li>
						<li>· Existing workbooks stay untouched</li>
						<li>· Sessions on other devices stay signed in</li>
					</ul>
				</div>
			</aside>
		</main>
	);
}
