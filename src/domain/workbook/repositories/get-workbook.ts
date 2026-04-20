import { supabase } from "#/infrastructure/supabase";
import type { Workbook } from "../models/Workbook";

export async function getWorkbook(id: string): Promise<Workbook | null> {
	const { data, error } = await supabase
		.from("workbooks")
		.select("id, prompt, html, created_at")
		.eq("id", id)
		.maybeSingle();

	if (error) throw error;
	if (!data) return null;

	return {
		id: data.id,
		prompt: data.prompt,
		html: data.html,
		createdAt: data.created_at,
	};
}
