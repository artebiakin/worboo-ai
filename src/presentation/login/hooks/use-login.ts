import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
	type OAuthProvider,
	signInWithOAuth,
	signInWithPassword,
} from "#/domain/auth";
import { logger } from "#/logger";
import { loginSchema } from "../schema";

const log = logger.scope("login");

export function useLogin() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onSubmit: loginSchema },
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			try {
				await signInWithPassword(value);
				await navigate({ to: "/" });
			} catch (err) {
				log.error("sign-in with password failed", err);
				toast.error(err instanceof Error ? err.message : "Could not sign in.");
				setIsSubmitting(false);
			}
		},
	});

	async function handleOAuth(provider: OAuthProvider) {
		setIsSubmitting(true);
		try {
			await signInWithOAuth({ provider });
		} catch (err) {
			log.error("oauth sign-in failed", err, { provider });
			toast.error(err instanceof Error ? err.message : "Could not sign in.");
			setIsSubmitting(false);
		}
	}

	return {
		form,
		isSubmitting,
		handleOAuth,
	};
}
