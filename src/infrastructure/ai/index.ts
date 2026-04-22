import { gateway } from "@ai-sdk/gateway";
import type { LanguageModel } from "ai";

/**
 * Returns the language model used by every generation call in the app.
 *
 * Today: Vercel AI Gateway — picks the provider behind `AI_MODEL`
 * (e.g. `"anthropic/claude-opus-4-7"`, `"openai/gpt-5"`). The Gateway SDK
 * reads `AI_GATEWAY_API_KEY` from `process.env` automatically.
 *
 * Swapping for an experiment:
 *   - Same provider, different model → change `AI_MODEL` env var only.
 *   - Different provider via Gateway → change `AI_MODEL` env var only.
 *   - Go direct to a provider SDK → replace the return statement below, e.g.
 *       import { anthropic } from "@ai-sdk/anthropic";
 *       return anthropic("claude-opus-4-7");
 *
 * This function is server-only. Do not import it from client code.
 */
export function getAiModel(): LanguageModel {
	const modelId = process.env.AI_MODEL;
	if (!modelId) {
		throw new Error(
			"AI_MODEL is not set. Add it to .env.local (see .env.example).",
		);
	}
	return gateway(modelId);
}
