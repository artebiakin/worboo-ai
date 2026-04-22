import { createServerFn } from "@tanstack/react-start";
import { getAiModel } from "#/infrastructure/ai";
import { logger } from "#/logger";
import type { GenerateWorkbookInput } from "../prompts/workbook-generation";
import { generateWorkbookWithModel } from "./generate-workbook-with-model";

const log = logger.scope("workbook:generate:serverfn");

/**
 * Server function that generates a Workbook from a teacher's chat input.
 * Runs on the server only — the Gateway API key never ships to the client.
 *
 * Usage from a client hook:
 *   const workbook = await generateWorkbook({ data: input });
 */
export const generateWorkbook = createServerFn({ method: "POST" })
	.inputValidator((data: GenerateWorkbookInput) => data)
	.handler(async ({ data }) => {
		try {
			return await generateWorkbookWithModel(getAiModel(), data);
		} catch (err) {
			// Log the full error on the server — stack traces, nested causes, etc.
			log.error("generateWorkbook failed", err, { input: data });
			// Re-throw a plain Error so the `.message` crosses the server-fn
			// serialization boundary intact. Without this the client often sees
			// an empty `{}` because Error's own properties are non-enumerable.
			throw new Error(describeError(err));
		}
	});

function describeError(err: unknown): string {
	if (err instanceof Error) {
		const parts: string[] = [];
		if (err.name && err.name !== "Error") parts.push(err.name);
		parts.push(err.message || "(no message)");
		const causeMessage = extractCauseMessage(err.cause);
		if (causeMessage) parts.push(`caused by: ${causeMessage}`);
		return parts.join(" — ");
	}
	if (typeof err === "string") return err;
	try {
		return JSON.stringify(err);
	} catch {
		return "Unknown error during workbook generation.";
	}
}

function extractCauseMessage(cause: unknown): string | null {
	if (!cause) return null;
	if (cause instanceof Error) return cause.message;
	if (typeof cause === "string") return cause;
	if (typeof cause === "object" && "message" in cause) {
		const m = (cause as { message: unknown }).message;
		if (typeof m === "string") return m;
	}
	return null;
}
