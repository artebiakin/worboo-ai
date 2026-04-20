import { supabase } from "#/infrastructure/supabase";

export async function signUpWithPassword({
	email,
	password,
	fullName,
}: {
	email: string;
	password: string;
	fullName?: string;
}): Promise<void> {
	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: fullName ? { full_name: fullName } : undefined,
			emailRedirectTo:
				typeof window !== "undefined"
					? `${window.location.origin}/`
					: undefined,
		},
	});
	if (error) throw error;
}
