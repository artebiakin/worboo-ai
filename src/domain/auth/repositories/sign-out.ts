import { supabase } from "#/infrastructure/supabase";

export async function signOut(): Promise<void> {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}
