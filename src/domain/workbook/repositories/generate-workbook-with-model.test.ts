import { MockLanguageModelV3 } from "ai/test";
import { describe, expect, it } from "vitest";
import { MOCK_WORKBOOK } from "#/presentation/chat/components/mock-workbook";
import { generateWorkbookWithModel } from "./generate-workbook-with-model";

function makeMockModel(responseObject: unknown) {
	return new MockLanguageModelV3({
		doGenerate: async () => ({
			content: [{ type: "text", text: JSON.stringify(responseObject) }],
			finishReason: { unified: "stop", raw: "stop" },
			usage: {
				inputTokens: {
					total: 10,
					noCache: 10,
					cacheRead: 0,
					cacheWrite: 0,
				},
				outputTokens: { total: 100, text: 100, reasoning: 0 },
			},
			warnings: [],
		}),
	});
}

describe("generateWorkbookWithModel", () => {
	it("returns a Workbook parsed against the schema", async () => {
		const model = makeMockModel(MOCK_WORKBOOK);
		const workbook = await generateWorkbookWithModel(model, {
			prompt: "English past simple for A2 teens",
			level: "A2",
		});
		expect(workbook.topic).toBe(MOCK_WORKBOOK.topic);
		expect(workbook.level).toBe("A2");
		expect(workbook.exercises).toHaveLength(MOCK_WORKBOOK.exercises.length);
	});

	it("passes the system + user prompt to the model", async () => {
		const model = makeMockModel(MOCK_WORKBOOK);
		await generateWorkbookWithModel(model, {
			prompt: "SENTINEL-PROMPT-TEXT",
			level: "B1",
		});

		expect(model.doGenerateCalls).toHaveLength(1);
		const [call] = model.doGenerateCalls;
		if (!call) throw new Error("expected a recorded doGenerate call");
		const flattened = JSON.stringify(call.prompt);
		expect(flattened).toContain("SENTINEL-PROMPT-TEXT");
		expect(flattened).toContain("CEFR level: B1");
		// System prompt is passed as the first message of role "system".
		expect(flattened).toContain("Worboo");
	});

	it("rejects a model response that does not match the Workbook schema", async () => {
		const model = makeMockModel({ topic: "oops" }); // missing most fields
		await expect(
			generateWorkbookWithModel(model, { prompt: "anything" }),
		).rejects.toThrow();
	});
});
