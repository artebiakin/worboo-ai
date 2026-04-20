import { z } from "zod";

export const resetPasswordSchema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters."),
		confirm: z.string().min(1, "Confirm your password."),
	})
	.refine((v) => v.password === v.confirm, {
		message: "Passwords don't match.",
		path: ["confirm"],
	});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
