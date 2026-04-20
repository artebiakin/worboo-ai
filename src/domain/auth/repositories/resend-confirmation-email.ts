import { supabase } from "#/infrastructure/supabase";

export async function resendConfirmationEmail({
	email,
}: {
	email: string;
}): Promise<void> {
	const { error } = await supabase.auth.resend({
		type: "signup",
		email,
		options: {
			emailRedirectTo:
				typeof window !== "undefined"
					? `${window.location.origin}/`
					: undefined,
		},
	});
	if (error) throw error;
}
