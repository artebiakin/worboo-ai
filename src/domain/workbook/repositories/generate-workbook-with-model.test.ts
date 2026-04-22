import { MockLanguageModelV3 } from "ai/test";
import { describe, expect, it } from "vitest";
import { MOCK_WORKBOOK } from "#/presentation/chat/components/mock-workbook";
import { generateWorkbookWithModel } from "./generate-workbook-with-model";

const FULL_RESPONSE = {
	type: "workbook",
	workbook: MOCK_WORKBOOK,
	suggestions: ["levelUp", "moreExercises"],
	reasoning: {
		detectedLanguage: "English",
		detectedLevel: "A2",
		chosenTopic: "Weekend Activities",
		chosenSkillFocus: "grammar",
		chosenAgeGroup: "teenagers",
		chosenDurationMinutes: 30,
		chosenExerciseCounts: { multipleChoice: 3 },
		chosenDifficultyDistribution: "progressive",
	},
};

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
	it("returns a workbook result parsed against the schema", async () => {
		const model = makeMockModel(FULL_RESPONSE);
		const result = await generateWorkbookWithModel(model, {
			prompt: "English past simple for A2 teens",
			level: "A2",
		});
		if (result.type !== "workbook") {
			throw new Error(`expected workbook, got ${result.type}`);
		}
		expect(result.workbook.title).toBe(MOCK_WORKBOOK.title);
		expect(result.workbook.meta.level).toBe("A2");
		expect(result.workbook.exercises).toHaveLength(
			MOCK_WORKBOOK.exercises.length,
		);
	});

	it("passes the system + user prompt to the model", async () => {
		const model = makeMockModel(FULL_RESPONSE);
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

	it("rejects a model response that does not match the schema at all", async () => {
		const model = makeMockModel({ gibberish: true });
		await expect(
			generateWorkbookWithModel(model, { prompt: "anything" }),
		).rejects.toThrow();
	});

	it("returns a questions result when the model asks for clarification", async () => {
		const model = makeMockModel({
			type: "questions",
			questions: [
				{
					kind: "required",
					text: "What level are your students?",
					options: [
						{ label: "A2", value: "A2" },
						{ label: "B1", value: "B1" },
					],
					skippable: false,
				},
			],
		});
		const result = await generateWorkbookWithModel(model, {
			prompt: "anything",
		});
		if (result.type !== "questions") {
			throw new Error(`expected questions, got ${result.type}`);
		}
		expect(result.questions).toHaveLength(1);
		expect(result.questions[0]?.text).toBe("What level are your students?");
	});
});
