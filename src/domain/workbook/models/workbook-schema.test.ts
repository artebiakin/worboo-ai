import { describe, expect, it } from "vitest";
import { MOCK_WORKBOOK } from "../__fixtures__/mock-workbook";
import { workbookSchema } from "./workbook-schema";

describe("workbookSchema", () => {
	it("accepts the mock workbook used by the preview UI", () => {
		const result = workbookSchema.safeParse(MOCK_WORKBOOK);
		expect(result.success).toBe(true);
	});

	it("rejects an unknown CEFR level in meta", () => {
		const bad = {
			...MOCK_WORKBOOK,
			meta: { ...MOCK_WORKBOOK.meta, level: "A3" },
		};
		const result = workbookSchema.safeParse(bad);
		expect(result.success).toBe(false);
	});

	it("accepts a false trueFalse exercise even without `correction`", () => {
		// `correction` is optional in the schema — the UI falls back gracefully
		// when the model omits it. We prefer a generated workbook with one
		// imperfect exercise over rejecting the entire response.
		const good = {
			...MOCK_WORKBOOK,
			exercises: [
				{
					id: 1,
					kind: "trueFalse",
					prompt: "True or false?",
					statement: "The sky is green.",
					correctAnswer: false,
					explanationIfTrueChosen: "No, it is blue.",
					explanationIfFalseChosen: "Right, it is blue.",
				},
			],
		};
		const result = workbookSchema.safeParse(good);
		expect(result.success).toBe(true);
	});

	it("rejects a multiple-choice exercise with fewer than 3 options", () => {
		const bad = {
			...MOCK_WORKBOOK,
			exercises: [
				{
					id: 1,
					kind: "multipleChoice",
					prompt: "Pick one",
					options: [
						{
							label: "A",
							text: "a",
							isCorrect: true,
							explanationIfChosen: "ok",
						},
						{
							label: "B",
							text: "b",
							isCorrect: false,
							explanationIfChosen: "no",
						},
					],
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

	it("rejects a reading sub-question id with HTML-unsafe characters", () => {
		// Sub-question ids are interpolated into HTML attributes downstream.
		// The schema is the first line of defense — any id outside
		// [a-zA-Z0-9_-] must fail to parse, even if the rest of the workbook
		// is valid.
		const bad = {
			...MOCK_WORKBOOK,
			exercises: [
				{
					id: 1,
					kind: "reading",
					prompt: "Read, then answer.",
					passage: { title: "P", text: "Some passage text." },
					questions: [
						{
							id: '1a" onfocus=alert(1) autofocus="x',
							kind: "multipleChoice",
							prompt: "?",
							options: [
								{
									label: "A",
									text: "a",
									isCorrect: true,
									explanationIfChosen: "ok",
								},
								{
									label: "B",
									text: "b",
									isCorrect: false,
									explanationIfChosen: "no",
								},
								{
									label: "C",
									text: "c",
									isCorrect: false,
									explanationIfChosen: "no",
								},
							],
						},
						{
							id: "1b",
							kind: "trueFalse",
							prompt: "?",
							statement: "x",
							correctAnswer: true,
							explanationIfTrueChosen: "ok",
							explanationIfFalseChosen: "no",
						},
					],
				},
			],
		};
		const result = workbookSchema.safeParse(bad);
		expect(result.success).toBe(false);
	});
});
