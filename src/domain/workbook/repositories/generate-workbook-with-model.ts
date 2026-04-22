import { generateObject, type LanguageModel } from "ai";
import type { Workbook } from "../models/Workbook";
import { workbookSchema } from "../models/workbook-schema";
import {
	buildSystemPrompt,
	buildUserPrompt,
	type GenerateWorkbookInput,
} from "../prompts/workbook-generation";

/**
 * Generates a Workbook against any AI SDK `LanguageModel`. Provider-agnostic
 * by design: pass a Gateway model in production, a mock model in tests, or a
 * direct-provider model for benchmarks. See `./generate-workbook.ts` for the
 * server-fn wrapper that plugs in the real model.
 */
export async function generateWorkbookWithModel(
	model: LanguageModel,
	input: GenerateWorkbookInput,
): Promise<Workbook> {
	const { object } = await generateObject({
		model,
		schema: workbookSchema,
		system: buildSystemPrompt(),
		prompt: buildUserPrompt(input),
	});
	return object;
}
