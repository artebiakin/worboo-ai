import { supabase } from "#/infrastructure/supabase";

export async function sendPasswordReset({
	email,
}: {
	email: string;
}): Promise<void> {
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo:
			typeof window !== "undefined"
				? `${window.location.origin}/auth/reset-password`
				: undefined,
	});
	if (error) throw error;
}
