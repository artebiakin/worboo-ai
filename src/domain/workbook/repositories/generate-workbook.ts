import { createServerFn } from "@tanstack/react-start";
import { getAiModel } from "#/infrastructure/ai";
import type { GenerateWorkbookInput } from "../prompts/workbook-generation";
import { generateWorkbookWithModel } from "./generate-workbook-with-model";

/**
 * Server function that generates a Workbook from a teacher's chat input.
 * Runs on the server only — the Gateway API key never ships to the client.
 *
 * Usage from a client hook:
 *   const workbook = await generateWorkbook({ data: input });
 */
export const generateWorkbook = createServerFn({ method: "POST" })
	.inputValidator((data: GenerateWorkbookInput) => data)
	.handler(async ({ data }) => generateWorkbookWithModel(getAiModel(), data));
