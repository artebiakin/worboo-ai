import { supabase } from "#/infrastructure/supabase";
import type { Workbook } from "../models/Workbook";

export async function getWorkbooks(): Promise<Workbook[]> {
	const { data, error } = await supabase
		.from("workbooks")
		.select("id, prompt, html, created_at")
		.order("created_at", { ascending: false });

	if (error) throw error;

	return data.map((row) => ({
		id: row.id,
		prompt: row.prompt,
		html: row.html,
		createdAt: row.created_at,
	}));
}
