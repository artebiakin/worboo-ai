import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSession, signOut } from "#/domain/auth";
import { logger } from "#/logger";

const log = logger.scope("app");

export function useApp() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [isSigningOut, setIsSigningOut] = useState(false);

	const { data: session, isLoading } = useQuery({
		queryKey: ["session"],
		queryFn: getSession,
		staleTime: 60_000,
	});

	useEffect(() => {
		if (!isLoading && !session) {
			navigate({ to: "/login" });
		}
	}, [isLoading, session, navigate]);

	async function handleSignOut() {
		setIsSigningOut(true);
		try {
			await signOut();
			queryClient.clear();
			await navigate({ to: "/login" });
		} catch (err) {
			log.error("sign-out failed", err);
			toast.error(err instanceof Error ? err.message : "Could not sign out.");
			setIsSigningOut(false);
		}
	}

	return {
		session,
		isLoading,
		isSigningOut,
		handleSignOut,
	};
}
