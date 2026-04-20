import { supabase } from "#/infrastructure/supabase";

export async function signInWithPassword({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<void> {
	const { error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw error;
}
