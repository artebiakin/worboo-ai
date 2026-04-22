import { describe, expect, it } from "vitest";
import { MOCK_WORKBOOK } from "../__fixtures__/mock-workbook";
import { hydrateWorkbook } from "./hydrate-workbook";

const FULL_RESPONSE = {
	workbook: MOCK_WORKBOOK,
	suggestions: ["levelUp" as const, "moreExercises" as const],
	reasoning: {
		detectedLanguage: "English",
		detectedLevel: "A2",
		chosenTopic: "Weekend Activities",
		chosenSkillFocus: "grammar" as const,
		chosenAgeGroup: "teenagers" as const,
		chosenDurationMinutes: 30,
		chosenExerciseCounts: { multipleChoice: 3 },
		chosenDifficultyDistribution: "progressive" as const,
	},
};

const EXERCISES_ONLY = {
	workbook: { exercises: MOCK_WORKBOOK.exercises },
};

describe("hydrateWorkbook", () => {
	it("returns the model's fields when the model provides a complete shape", () => {
		const result = hydrateWorkbook(FULL_RESPONSE, { prompt: "ignored" });
		expect(result.title).toBe(MOCK_WORKBOOK.title);
		expect(result.eyebrow).toBe(MOCK_WORKBOOK.eyebrow);
		expect(result.intro).toBe(MOCK_WORKBOOK.intro);
		expect(result.objectives).toEqual(MOCK_WORKBOOK.objectives);
		expect(result.meta.level).toBe(MOCK_WORKBOOK.meta.level);
		expect(result.meta.targetLanguage).toBe(MOCK_WORKBOOK.meta.targetLanguage);
		expect(result.meta.topic).toBe(MOCK_WORKBOOK.meta.topic);
		expect(result.exercises).toHaveLength(MOCK_WORKBOOK.exercises.length);
	});

	it("falls back to teacher input when the model returns only exercises", () => {
		// Regression: Haiku-class models reliably skip every top-level field
		// except `exercises`. Hydration must still produce a renderable Workbook.
		const result = hydrateWorkbook(EXERCISES_ONLY, {
			prompt: "English past simple for A2 teens",
			level: "A2",
			targetLanguage: "English",
		});
		expect(result.meta.level).toBe("A2");
		expect(result.meta.targetLanguage).toBe("English");
		expect(result.meta.topic).toBe("English past simple for A2 teens");
		expect(result.title).toBe("English past simple for A2 teens");
		expect(result.exercises).toHaveLength(MOCK_WORKBOOK.exercises.length);
	});

	it("uses global defaults when neither model nor teacher provide values", () => {
		const result = hydrateWorkbook(EXERCISES_ONLY, { prompt: "" });
		expect(result.meta.level).toBe("A2");
		expect(result.meta.targetLanguage).toBe("English");
		expect(result.meta.topic).toBe("Language practice");
	});

	it("synthesises a reasonable meta.levelLabel and meta.ageLabel", () => {
		const result = hydrateWorkbook(EXERCISES_ONLY, {
			prompt: "English past simple",
			level: "B1",
		});
		expect(result.meta.level).toBe("B1");
		expect(result.meta.levelLabel).toBe("Intermediate");
		expect(result.meta.ageGroup).toBe("teenagers");
		expect(result.meta.ageLabel).toBe("Ages 13–17");
	});

	it("fills objectives with two defaults when the model returns an empty array", () => {
		// The schema requires 2–4 objectives, so a one-item fallback would
		// produce a workbook that fails safeParse. Two defaults keep the
		// hydrated result round-trippable through workbookSchema.
		const result = hydrateWorkbook(
			{
				workbook: { ...EXERCISES_ONLY.workbook, objectives: [] },
			},
			{ prompt: "Past tenses", level: "B1" },
		);
		expect(result.objectives).toHaveLength(2);
		expect(result.objectives[0]).toMatch(/past tenses/i);
		expect(result.objectives[1]).toMatch(/past tenses/i);
	});

	it("truncates an unusually long prompt when synthesising a topic", () => {
		const longPrompt = "X".repeat(200);
		const result = hydrateWorkbook(EXERCISES_ONLY, { prompt: longPrompt });
		expect(result.meta.topic.length).toBeLessThanOrEqual(60);
		expect(result.meta.topic).toMatch(/…$/);
	});

	it("synthesises an eyebrow line when the model omits it", () => {
		const result = hydrateWorkbook(EXERCISES_ONLY, {
			prompt: "Simple past",
			level: "A2",
			targetLanguage: "English",
		});
		expect(result.eyebrow).toBe("Simple past · A2 English");
	});
});
