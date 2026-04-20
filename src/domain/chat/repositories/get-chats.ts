import { supabase } from "#/infrastructure/supabase";
import type { Chat } from "../models/Chat";

export async function getChats(): Promise<Chat[]> {
	const { data, error } = await supabase
		.from("chats")
		.select("id, user_id, title, created_at, updated_at")
		.order("updated_at", { ascending: false });

	if (error) throw error;

	return data.map((row) => ({
		id: row.id,
		userId: row.user_id,
		title: row.title,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	}));
}
