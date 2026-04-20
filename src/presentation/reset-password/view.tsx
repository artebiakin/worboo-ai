import { Link as TSRLink } from "@tanstack/react-router";
import { Button } from "#/presentation/components/catalyst/button";
import {
	ErrorMessage,
	Field,
	Label,
} from "#/presentation/components/catalyst/fieldset";
import { Heading } from "#/presentation/components/catalyst/heading";
import { Input } from "#/presentation/components/catalyst/input";
import { Text } from "#/presentation/components/catalyst/text";
import Logo from "#/presentation/components/Logo";
import { useResetPassword } from "./hooks";

export function ResetPasswordView() {
	const { form, isSubmitting } = useResetPassword();

	return (
		<main className="grid min-h-dvh lg:grid-cols-2">
			<section className="relative flex items-center justify-center px-6 py-24 sm:py-28 lg:px-12">
				<div className="absolute top-3 left-6 sm:top-4 sm:left-8 lg:left-12">
					<Logo />
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="w-full max-w-sm space-y-6"
					noValidate
				>
					<div className="space-y-1">
						<Heading>Set a new password</Heading>
						<Text>Pick something you'll remember. At least 8 characters.</Text>
					</div>

					<div className="space-y-5">
						<form.Field name="password">
							{(field) => (
								<Field>
									<Label>New password</Label>
									<Input
										type="password"
										name={field.name}
										autoComplete="new-password"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										invalid={field.state.meta.errors.length > 0}
									/>
									{field.state.meta.errors.length > 0 ? (
										<ErrorMessage>
											{field.state.meta.errors[0]?.message}
										</ErrorMessage>
									) : null}
								</Field>
							)}
						</form.Field>

						<form.Field name="confirm">
							{(field) => (
								<Field>
									<Label>Confirm password</Label>
									<Input
										type="password"
										name={field.name}
										autoComplete="new-password"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										invalid={field.state.meta.errors.length > 0}
									/>
									{field.state.meta.errors.length > 0 ? (
										<ErrorMessage>
											{field.state.meta.errors[0]?.message}
										</ErrorMessage>
									) : null}
								</Field>
							)}
						</form.Field>
					</div>

					<Button
						type="submit"
						color="violet"
						disabled={isSubmitting}
						className="w-full"
					>
						{isSubmitting ? "Updating…" : "Update password"}
					</Button>

					<Text className="text-center">
						<TSRLink
							to="/login"
							className="font-medium text-zinc-950 underline decoration-zinc-950/50 hover:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:hover:decoration-white"
						>
							Back to sign in
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
							One more step and you're back in.
						</p>
						<Text>
							For safety, this link only works once. If it expires, just request
							a new reset email.
						</Text>
					</div>

					<ul className="grid gap-3 text-sm text-zinc-700 dark:text-zinc-300">
						<li>· Minimum 8 characters</li>
						<li>· Use a passphrase you'll remember</li>
						<li>· Other signed-in devices stay signed in</li>
					</ul>
				</div>
			</aside>
		</main>
	);
}
