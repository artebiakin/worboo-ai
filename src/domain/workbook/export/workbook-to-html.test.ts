import { describe, expect, it } from "vitest";
import type { Exercise, Workbook } from "../models/Workbook";
import { workbookFilename, workbookToHtml } from "./workbook-to-html";

function makeWorkbook(overrides: Partial<Workbook> = {}): Workbook {
	const base: Workbook = {
		topic: "Past simple",
		targetLanguage: "English",
		level: "A2",
		title: "Past simple practice",
		tags: ["grammar"],
		intro: "Welcome to the workbook.",
		objectives: ["Use past simple in context"],
		exercises: [],
		suggestions: [],
		reasoning: {
			detectedLanguage: "English",
			detectedLevel: "A2",
			chosenTopic: "Past simple",
			chosenSkillFocus: "grammar",
			chosenAgeGroup: "adults",
			chosenDurationMinutes: 20,
			chosenExerciseCounts: {},
			chosenDifficultyDistribution: "uniform",
		},
	};
	return { ...base, ...overrides };
}

const MC_EXERCISE: Exercise = {
	id: 1,
	kind: "multipleChoice",
	prompt: "Pick the past simple of 'go'.",
	options: [
		{
			text: "goed",
			isCorrect: false,
			explanationIfChosen: "'go' is irregular — there is no 'goed'.",
		},
		{
			text: "went",
			isCorrect: true,
			explanationIfChosen: "Correct! 'go' is irregular: past simple is 'went'.",
		},
	],
};

const TF_EXERCISE: Exercise = {
	id: 2,
	kind: "trueFalse",
	statement: "'Go' is regular.",
	correctAnswer: false,
	correction: "'Go' is irregular.",
	explanationIfTrueChosen: "Not quite — 'go' does not follow the -ed rule.",
	explanationIfFalseChosen: "Correct! 'go' is irregular.",
};

describe("workbookFilename", () => {
	it("joins slugified language, topic, level and title", () => {
		const workbook = makeWorkbook({
			targetLanguage: "English",
			topic: "Past simple",
			level: "A2",
			title: "Past simple practice",
		});
		expect(workbookFilename(workbook)).toBe(
			"english-past-simple-a2-past-simple-practice.html",
		);
	});

	it("strips diacritics and punctuation", () => {
		const workbook = makeWorkbook({
			targetLanguage: "Español",
			topic: "Pretérito indefinido!",
			level: "B1",
			title: "Práctica — día 1",
		});
		expect(workbookFilename(workbook)).toBe(
			"espanol-preterito-indefinido-b1-practica-dia-1.html",
		);
	});

	it("falls back to 'workbook.html' when every part slugifies to empty", () => {
		const workbook = makeWorkbook({
			targetLanguage: "!!!",
			topic: "***",
			title: "   ",
		});
		// level is A2 so it still contributes; test with a fully empty case
		const empty = { ...workbook, level: "A2" as const };
		expect(workbookFilename(empty)).toBe("a2.html");

		const totallyEmpty = makeWorkbook({
			targetLanguage: "",
			topic: "",
			title: "",
		});
		// level still contributes; we want to confirm the fallback path exists
		const stripped = { ...totallyEmpty, level: "" as unknown as "A2" };
		expect(workbookFilename(stripped)).toBe("workbook.html");
	});
});

describe("workbookToHtml", () => {
	it("produces a valid DOCTYPE and self-contained document", () => {
		const html = workbookToHtml(makeWorkbook());
		expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
		expect(html).toContain("<style>");
		expect(html).toContain("<script>");
		// No external stylesheets or scripts.
		expect(html).not.toMatch(/<link[^>]+rel=["']stylesheet/i);
		expect(html).not.toMatch(/<script[^>]+src=/i);
	});

	it("includes a <noscript> fallback so JS-disabled users see a message", () => {
		const html = workbookToHtml(makeWorkbook());
		expect(html).toContain("<noscript>");
		expect(html).toMatch(/enable JavaScript/i);
	});

	it("adds lang attribute for known languages", () => {
		expect(workbookToHtml(makeWorkbook({ targetLanguage: "English" }))).toMatch(
			/<html lang="en">/,
		);
		expect(workbookToHtml(makeWorkbook({ targetLanguage: "Spanish" }))).toMatch(
			/<html lang="es">/,
		);
		expect(
			workbookToHtml(makeWorkbook({ targetLanguage: "Ukrainian" })),
		).toMatch(/<html lang="uk">/);
	});

	it("omits lang attribute for unknown languages", () => {
		const html = workbookToHtml(makeWorkbook({ targetLanguage: "Klingon" }));
		expect(html).toContain("<html>\n");
		expect(html).not.toMatch(/<html lang=/);
	});

	it("escapes HTML in workbook title, intro, and option text", () => {
		const workbook = makeWorkbook({
			title: `Sharks & <script>alert(1)</script>`,
			intro: `"Quoted" & 'apostrophes'`,
			exercises: [
				{
					id: 10,
					kind: "multipleChoice",
					prompt: "<b>bold</b>?",
					options: [
						{
							text: `<img src=x onerror=alert(1)>`,
							isCorrect: false,
							explanationIfChosen: "Nope.",
						},
						{
							text: "safe",
							isCorrect: true,
							explanationIfChosen: "Correct! safe.",
						},
					],
				},
			],
		});
		const html = workbookToHtml(workbook);
		// Raw injection must not appear.
		expect(html).not.toContain("<script>alert(1)</script>");
		expect(html).not.toContain("<img src=x onerror=alert(1)>");
		// Escaped forms do.
		expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
		expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
		expect(html).toContain("&quot;Quoted&quot; &amp; &#39;apostrophes&#39;");
	});

	it("keeps 'Correct!' prefix in explanations (preview ↔ download parity)", () => {
		const html = workbookToHtml(
			makeWorkbook({ exercises: [MC_EXERCISE, TF_EXERCISE] }),
		);
		// MC correct option
		expect(html).toContain(
			"Correct! &#39;go&#39; is irregular: past simple is &#39;went&#39;.",
		);
		// TF correct answer
		expect(html).toContain("Correct! &#39;go&#39; is irregular.");
	});

	it("is deterministic — same workbook renders byte-identical output", () => {
		const workbook = makeWorkbook({
			exercises: [
				{
					id: 7,
					kind: "matching",
					leftLabel: "Base",
					rightLabel: "Past",
					pairs: [
						{ left: "go", right: "went", explanation: "irregular" },
						{ left: "have", right: "had", explanation: "irregular" },
						{ left: "see", right: "saw", explanation: "irregular" },
						{ left: "buy", right: "bought", explanation: "irregular" },
					],
				},
			],
		});
		const a = workbookToHtml(workbook);
		const b = workbookToHtml(workbook);
		expect(a).toBe(b);
	});

	it("shuffles matching right-column options but keeps every value", () => {
		const pairs = [
			{ left: "go", right: "went", explanation: "" },
			{ left: "have", right: "had", explanation: "" },
			{ left: "see", right: "saw", explanation: "" },
			{ left: "buy", right: "bought", explanation: "" },
			{ left: "take", right: "took", explanation: "" },
		];
		const html = workbookToHtml(
			makeWorkbook({
				exercises: [
					{
						id: 1,
						kind: "matching",
						leftLabel: "Base",
						rightLabel: "Past",
						pairs,
					},
				],
			}),
		);
		for (const { right } of pairs) {
			expect(html).toContain(`<option value="${right}">${right}</option>`);
		}
	});

	it("embeds JSON-encoded accepted answers for fill-blank inputs", () => {
		const html = workbookToHtml(
			makeWorkbook({
				exercises: [
					{
						id: 3,
						kind: "fillBlank",
						sentence: "Yesterday I {{blank}} to the park.",
						blanks: [
							{
								hint: "go",
								acceptedAnswers: ["went", "walked"],
								explanation: "Past of 'go'.",
							},
						],
					},
				],
			}),
		);
		expect(html).toMatch(
			/data-accepted="\[&quot;went&quot;,&quot;walked&quot;\]"/,
		);
	});

	it("exposes data-correct-index on MC fieldsets so the grader can find it", () => {
		const html = workbookToHtml(makeWorkbook({ exercises: [MC_EXERCISE] }));
		// 'went' is option index 1.
		expect(html).toMatch(/data-q-kind="mc"[^>]*data-correct-index="1"/);
	});
});
