import { describe, expect, it } from "vitest";
import { MOCK_WORKBOOK } from "#/presentation/chat/components/mock-workbook";
import { workbookSchema } from "./workbook-schema";

describe("workbookSchema", () => {
	it("accepts the mock workbook used by the preview UI", () => {
		const result = workbookSchema.safeParse(MOCK_WORKBOOK);
		expect(result.success).toBe(true);
	});

	it("rejects an unknown CEFR level", () => {
		const bad = { ...MOCK_WORKBOOK, level: "A3" };
		const result = workbookSchema.safeParse(bad);
		expect(result.success).toBe(false);
	});

	it("rejects a false trueFalse exercise missing `correction`", () => {
		const bad = {
			...MOCK_WORKBOOK,
			exercises: [
				{
					id: 1,
					kind: "trueFalse",
					statement: "The sky is green.",
					correctAnswer: false,
					// missing: correction
					explanationIfTrueChosen: "No, it is blue.",
					explanationIfFalseChosen: "Right, it is blue.",
				},
			],
		};
		const result = workbookSchema.safeParse(bad);
		expect(result.success).toBe(false);
	});

	it("rejects a multiple-choice exercise with only one option", () => {
		const bad = {
			...MOCK_WORKBOOK,
			exercises: [
				{
					id: 1,
					kind: "multipleChoice",
					prompt: "Pick one",
					options: [{ text: "a", isCorrect: true, explanationIfChosen: "ok" }],
				},
			],
		};
		const result = workbookSchema.safeParse(bad);
		expect(result.success).toBe(false);
	});

	it("rejects a workbook with zero exercises", () => {
		const bad = { ...MOCK_WORKBOOK, exercises: [] };
		const result = workbookSchema.safeParse(bad);
		expect(result.success).toBe(false);
	});
});
