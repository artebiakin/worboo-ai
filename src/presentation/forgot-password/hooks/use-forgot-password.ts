import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { sendPasswordReset } from "#/domain/auth";
import { logger } from "#/logger";
import { forgotPasswordSchema } from "../schema";

const log = logger.scope("forgot-password");

export function useForgotPassword() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { email: "" },
		validators: { onSubmit: forgotPasswordSchema },
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			try {
				await sendPasswordReset({ email: value.email });
			} catch (err) {
				// Swallow to avoid account-enumeration leak — same confirmation view
				// whether or not the email exists. Log for dev visibility.
				log.warn("password reset request failed (suppressed)", {
					error: err,
				});
			} finally {
				setIsSubmitting(false);
				setSubmittedEmail(value.email);
			}
		},
	});

	return {
		form,
		isSubmitting,
		isSubmitted: submittedEmail !== null,
		submittedEmail: submittedEmail ?? "",
	};
}
