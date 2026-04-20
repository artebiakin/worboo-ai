import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	type OAuthProvider,
	resendConfirmationEmail,
	signInWithOAuth,
	signUpWithPassword,
} from "#/domain/auth";
import { logger } from "#/logger";
import { signupSchema } from "../schema";

const RESEND_COOLDOWN_SECONDS = 60;
const log = logger.scope("signup");

export function useSignup() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);
	const [confirmationEmail, setConfirmationEmail] = useState("");
	const [resendCooldown, setResendCooldown] = useState(0);
	const [isResending, setIsResending] = useState(false);

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (resendCooldown <= 0) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}
		if (intervalRef.current) return;
		intervalRef.current = setInterval(() => {
			setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
		}, 1000);
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [resendCooldown]);

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			acceptTerms: false,
		},
		validators: { onSubmit: signupSchema },
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			try {
				await signUpWithPassword({
					email: value.email,
					password: value.password,
					fullName: value.name,
				});
				setConfirmationEmail(value.email);
				setIsAwaitingConfirmation(true);
				setResendCooldown(RESEND_COOLDOWN_SECONDS);
			} catch (err) {
				log.error("sign-up with password failed", err);
				toast.error(
					err instanceof Error ? err.message : "Could not create account.",
				);
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	async function handleOAuth(provider: OAuthProvider) {
		setIsSubmitting(true);
		try {
			await signInWithOAuth({ provider });
		} catch (err) {
			log.error("oauth sign-up failed", err, { provider });
			toast.error(err instanceof Error ? err.message : "Could not sign up.");
			setIsSubmitting(false);
		}
	}

	async function handleResend() {
		if (resendCooldown > 0 || isResending) return;
		setIsResending(true);
		try {
			await resendConfirmationEmail({ email: confirmationEmail });
			setResendCooldown(RESEND_COOLDOWN_SECONDS);
			toast.success("Confirmation email sent.");
		} catch (err) {
			log.error("resend confirmation email failed", err);
			toast.error(
				err instanceof Error ? err.message : "Could not resend email.",
			);
		} finally {
			setIsResending(false);
		}
	}

	return {
		form,
		isSubmitting,
		handleOAuth,
		isAwaitingConfirmation,
		confirmationEmail,
		resendCooldown,
		isResending,
		canResend: resendCooldown === 0 && !isResending,
		handleResend,
	};
}
