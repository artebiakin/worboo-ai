import {
	generateText,
	type LanguageModel,
	NoObjectGeneratedError,
	Output,
} from "ai";
import { logger } from "#/logger";
import type { ClarificationQuestion, Workbook } from "../models/Workbook";
import { workbookResponseSchema } from "../models/workbook-schema";
import {
	buildSystemPrompt,
	buildUserPrompt,
	type GenerateWorkbookInput,
} from "../prompts/workbook-generation";
import { hydrateWorkbook } from "./hydrate-workbook";

const log = logger.scope("workbook:generate");

/**
 * Discriminated result of a generation pass. The model either produced a
 * workbook, or asked 1–3 clarification questions before it can commit. The
 * caller branches on `type` to either show the preview or render a
 * clarification step in the UI.
 */
export type GenerateWorkbookResult =
	| { type: "workbook"; workbook: Workbook }
	| { type: "questions"; questions: ClarificationQuestion[] };

/**
 * Generates a Workbook against any AI SDK `LanguageModel`. Provider-agnostic
 * by design: pass a Gateway model in production, a mock model in tests, or a
 * direct-provider model for benchmarks. See `./generate-workbook.ts` for the
 * server-fn wrapper that plugs in the real model.
 *
 * Uses the current `generateText` + `Output.object` API (AI SDK v6+).
 */
export async function generateWorkbookWithModel(
	model: LanguageModel,
	input: GenerateWorkbookInput,
): Promise<GenerateWorkbookResult> {
	try {
		const result = await generateText({
			model,
			system: [
				{
					role: "system",
					content: buildSystemPrompt(),
					providerOptions: {
						anthropic: { cacheControl: { type: "ephemeral" } },
					},
				},
			],

			// The system prompt is ~5k tokens of static rules + schema docs.
			// Tagging it with Anthropic `cache_control: ephemeral` turns every
			// call after the first (within a 5-minute window) into a cache
			// read — the read cost is ~10% of the input rate. The marker is
			// forwarded transparently by Vercel AI Gateway for Anthropic
			// models; providers that don't support it ignore it.
			prompt: buildUserPrompt(input),
			output: Output.object({
				schema: workbookResponseSchema,
				name: "WorkbookResponse",
				description:
					'Put "type" at the root ("workbook" or "questions"); the workbook body lives under "workbook", never an outer "content" key.',
			}),
		});

		log.info("generation usage", {
			usage: result.usage,
			// Anthropic surfaces cacheCreationInputTokens on the first call
			// and cacheReadInputTokens on subsequent cached calls. OpenAI
			// reports cachedInputTokens on `result.usage` directly.
			anthropic: result.providerMetadata?.anthropic,
		});

		const response = result.output;

		if (response.type === "questions") {
			return { type: "questions", questions: response.questions ?? [] };
		}

		if (!response.workbook) {
			throw new Error(
				"Workbook response is missing required `workbook` field.",
			);
		}

		const workbook = hydrateWorkbook({ workbook: response.workbook }, input);
		return { type: "workbook", workbook };
	} catch (err) {
		if (NoObjectGeneratedError.isInstance(err)) {
			log.error("model returned shape that did not match workbookSchema", err, {
				finishReason: err.finishReason,
				usage: err.usage,
				zodIssues: extractZodIssues(err.cause),
				rawTextPreview: err.text?.slice(0, 2000),
			});
		}
		throw err;
	}
}

function extractZodIssues(cause: unknown): unknown {
	// AI SDK may wrap the original ZodError in a TypeValidationError, so walk
	// down the cause chain until we find an `issues` array.
	let current: unknown = cause;
	for (let i = 0; i < 5 && current; i++) {
		if (typeof current === "object" && "issues" in current) {
			return (current as { issues: unknown }).issues;
		}
		if (typeof current === "object" && "cause" in current) {
			current = (current as { cause: unknown }).cause;
			continue;
		}
		break;
	}
	return undefined;
}
