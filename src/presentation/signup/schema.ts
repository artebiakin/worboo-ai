import { z } from "zod";

export const signupSchema = z.object({
	name: z.string().trim().min(1, "Tell us your name."),
	email: z.email("Enter a valid email."),
	password: z.string().min(8, "Password must be at least 8 characters."),
	acceptTerms: z
		.boolean()
		.refine((v) => v, "Please accept the Terms and Privacy Policy."),
});

export type SignupInput = z.infer<typeof signupSchema>;
