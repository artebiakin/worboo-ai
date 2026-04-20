import { supabase } from "#/infrastructure/supabase";
import type { Session } from "../models/Session";

export async function getSession(): Promise<Session | null> {
	const { data, error } = await supabase.auth.getSession();
	if (error) throw error;
	const session = data.session;
	if (!session) return null;
	const fullName = session.user.user_metadata?.full_name;
	return {
		userId: session.user.id,
		email: session.user.email ?? "",
		fullName:
			typeof fullName === "string" && fullName.length > 0 ? fullName : null,
		emailConfirmedAt: session.user.email_confirmed_at ?? null,
	};
}
