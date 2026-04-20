import { supabase } from "#/infrastructure/supabase";

export async function updatePassword({
	newPassword,
}: {
	newPassword: string;
}): Promise<void> {
	const { error } = await supabase.auth.updateUser({ password: newPassword });
	if (error) throw error;
}
