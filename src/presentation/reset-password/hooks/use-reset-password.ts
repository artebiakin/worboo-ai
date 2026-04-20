import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { updatePassword } from "#/domain/auth";
import { logger } from "#/logger";
import { resetPasswordSchema } from "../schema";

const log = logger.scope("reset-password");

export function useResetPassword() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		defaultValues: { password: "", confirm: "" },
		validators: { onSubmit: resetPasswordSchema },
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			try {
				await updatePassword({ newPassword: value.password });
				await navigate({ to: "/login" });
			} catch (err) {
				log.error("update password failed", err);
				toast.error(
					err instanceof Error ? err.message : "Could not update password.",
				);
				setIsSubmitting(false);
			}
		},
	});

	return { form, isSubmitting };
}
