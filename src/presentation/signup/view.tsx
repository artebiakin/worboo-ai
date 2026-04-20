import { Link as TSRLink } from "@tanstack/react-router";
import { Button } from "#/presentation/components/catalyst/button";
import {
	Checkbox,
	CheckboxField,
} from "#/presentation/components/catalyst/checkbox";
import {
	ErrorMessage,
	Field,
	Label,
} from "#/presentation/components/catalyst/fieldset";
import { Heading } from "#/presentation/components/catalyst/heading";
import { Input } from "#/presentation/components/catalyst/input";
import { Text } from "#/presentation/components/catalyst/text";
import Logo from "#/presentation/components/Logo";
import { OAuthButtons } from "#/presentation/components/OAuthButtons";
import { useSignup } from "./hooks";

export function SignupView() {
	const {
		form,
		isSubmitting,
		handleOAuth,
		isAwaitingConfirmation,
		confirmationEmail,
		resendCooldown,
		isResending,
		canResend,
		handleResend,
	} = useSignup();

	return (
		<main className="grid min-h-dvh lg:grid-cols-2">
			<section className="relative flex items-center justify-center px-6 py-24 sm:py-28 lg:px-12">
				<div className="absolute top-3 left-6 sm:top-4 sm:left-8 lg:left-12">
					<Logo />
				</div>

				{isAwaitingConfirmation ? (
					<div className="w-full max-w-sm space-y-6 text-center">
						<div className="space-y-2">
							<Heading>Check your inbox</Heading>
							<Text>
								We sent a confirmation link to{" "}
								<strong>{confirmationEmail}</strong>. Click it to finish
								creating your account.
							</Text>
						</div>

						<Button
							type="button"
							color="violet"
							disabled={!canResend}
							onClick={handleResend}
							className="w-full"
						>
							{isResending
								? "Sending…"
								: resendCooldown > 0
									? `Resend in ${resendCooldown}s`
									: "Resend confirmation email"}
						</Button>

						<Text className="text-center">
							Wrong email?{" "}
							<TSRLink
								to="/signup"
								className="font-medium text-zinc-950 underline decoration-zinc-950/50 hover:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:hover:decoration-white"
								onClick={() => window.location.reload()}
							>
								Start over
							</TSRLink>
						</Text>
					</div>
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
						className="w-full max-w-sm space-y-6"
						noValidate
					>
						<div className="space-y-1">
							<Heading>Create your account</Heading>
							<Text>
								Start turning lesson ideas into ready-to-share workbooks.
							</Text>
						</div>

						<OAuthButtons onProvider={handleOAuth} disabled={isSubmitting} />

						<div className="flex items-center gap-4">
							<div className="h-px flex-1 bg-zinc-950/10 dark:bg-white/10" />
							<Text className="text-xs uppercase tracking-wide">
								or sign up with email
							</Text>
							<div className="h-px flex-1 bg-zinc-950/10 dark:bg-white/10" />
						</div>

						<div className="space-y-5">
							<form.Field name="name">
								{(field) => (
									<Field>
										<Label>Your name</Label>
										<Input
											type="text"
											name={field.name}
											autoComplete="name"
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

							<form.Field name="email">
								{(field) => (
									<Field>
										<Label>Email</Label>
										<Input
											type="email"
											name={field.name}
											autoComplete="email"
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

							<form.Field name="password">
								{(field) => (
									<Field>
										<Label>Password</Label>
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

							<form.Field name="acceptTerms">
								{(field) => (
									<Field>
										<CheckboxField>
											<Checkbox
												name={field.name}
												checked={field.state.value}
												onChange={field.handleChange}
											/>
											<Label>
												I agree to the{" "}
												<TSRLink
													to="/"
													className="underline decoration-zinc-950/40 hover:decoration-zinc-950 dark:decoration-white/40 dark:hover:decoration-white"
												>
													Terms
												</TSRLink>{" "}
												and{" "}
												<TSRLink
													to="/"
													className="underline decoration-zinc-950/40 hover:decoration-zinc-950 dark:decoration-white/40 dark:hover:decoration-white"
												>
													Privacy Policy
												</TSRLink>
												.
											</Label>
										</CheckboxField>
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
							{isSubmitting ? "Creating account…" : "Create account"}
						</Button>

						<Text className="text-center">
							Already have an account?{" "}
							<TSRLink
								to="/login"
								className="font-medium text-zinc-950 underline decoration-zinc-950/50 hover:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:hover:decoration-white"
							>
								Sign in
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
							Build your first interactive workbook in under 90 seconds.
						</p>
						<Text>
							Free while in beta. No credit card. Cancel any time once we
							launch.
						</Text>
					</div>

					<ul className="grid gap-3 text-sm text-zinc-700 dark:text-zinc-300">
						<li>· Unlimited prompt-to-workbook drafts</li>
						<li>· Self-grading exercises out of the box</li>
						<li>· Export a single offline HTML file</li>
					</ul>
				</div>
			</aside>
		</main>
	);
}
