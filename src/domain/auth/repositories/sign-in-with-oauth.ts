import { supabase } from "#/infrastructure/supabase";

export type OAuthProvider = "google" | "apple";

export async function signInWithOAuth({
	provider,
}: {
	provider: OAuthProvider;
}): Promise<void> {
	const { error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo:
				typeof window !== "undefined"
					? `${window.location.origin}/auth/callback`
					: undefined,
		},
	});
	if (error) throw error;
}
