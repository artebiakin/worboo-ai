import { supabase } from "#/infrastructure/supabase";
import type { Chat } from "../models/Chat";

export async function createChat(
	input: { title?: string | null } = {},
): Promise<Chat> {
	const { data, error } = await supabase
		.from("chats")
		.insert({ title: input.title ?? null })
		.select("id, user_id, title, created_at, updated_at")
		.single();

	if (error) throw error;

	return {
		id: data.id,
		userId: data.user_id,
		title: data.title,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};
}
