// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import type { Exercise, Workbook } from "../models/Workbook";
import {
	workbookFilename,
	workbookInit,
	workbookMarkup,
	workbookToHtml,
} from "./workbook-to-html";

function makeWorkbook(overrides: Partial<Workbook> = {}): Workbook {
	const base: Workbook = {
		title: "Past simple practice",
		eyebrow: "Past Simple · A2 English",
		intro: "Welcome to the workbook.",
		objectives: ["Use past simple in context"],
		meta: {
			targetLanguage: "English",
			nativeLanguage: "English",
			level: "A2",
			levelLabel: "Elementary",
			skillFocus: "grammar",
			topic: "Past simple",
			ageGroup: "adults",
			ageLabel: "Adults",
			durationMinutes: 20,
			exerciseCount: 0,
		},
		exercises: [],
	};
	return {
		...base,
		...overrides,
		meta: { ...base.meta, ...(overrides.meta ?? {}) },
	};
}

const MC_EXERCISE: Exercise = {
	id: 1,
	kind: "multipleChoice",
	prompt: "Pick the past simple of 'go'.",
	options: [
		{
			label: "A",
			text: "goed",
			isCorrect: false,
			explanationIfChosen: "'go' is irregular — there is no 'goed'.",
		},
		{
			label: "B",
			text: "went",
			isCorrect: true,
			explanationIfChosen: "Correct! 'go' is irregular: past simple is 'went'.",
		},
		{
			label: "C",
			text: "going",
			isCorrect: false,
			explanationIfChosen: "'going' is the -ing form, not past simple.",
		},
	],
};

const TF_EXERCISE: Exercise = {
	id: 2,
	kind: "trueFalse",
	prompt: "True or false?",
	statement: "'Go' is regular.",
	correctAnswer: false,
	correction: "'Go' is irregular.",
	explanationIfTrueChosen: "Not quite — 'go' does not follow the -ed rule.",
	explanationIfFalseChosen: "Correct! 'go' is irregular.",
};

describe("workbookFilename", () => {
	it("joins slugified language, topic, level and title", () => {
		const workbook = makeWorkbook({
			meta: {
				targetLanguage: "English",
				nativeLanguage: "English",
				level: "A2",
				levelLabel: "Elementary",
				skillFocus: "grammar",
				topic: "Past simple",
				ageGroup: "adults",
				ageLabel: "Adults",
				durationMinutes: 20,
				exerciseCount: 0,
			},
			title: "Past simple practice",
		});
		expect(workbookFilename(workbook)).toBe(
			"english-past-simple-a2-past-simple-practice.html",
		);
	});

	it("strips diacritics and punctuation", () => {
		const workbook = makeWorkbook({
			meta: {
				targetLanguage: "Español",
				nativeLanguage: "English",
				level: "B1",
				levelLabel: "Intermediate",
				skillFocus: "grammar",
				topic: "Pretérito indefinido!",
				ageGroup: "adults",
				ageLabel: "Adults",
				durationMinutes: 20,
				exerciseCount: 0,
			},
			title: "Práctica — día 1",
		});
		expect(workbookFilename(workbook)).toBe(
			"espanol-preterito-indefinido-b1-practica-dia-1.html",
		);
	});

	it("falls back to 'workbook.html' when every part slugifies to empty", () => {
		const totallyEmpty = makeWorkbook({
			meta: {
				targetLanguage: "",
				nativeLanguage: "",
				level: "" as unknown as "A2",
				levelLabel: "",
				skillFocus: "grammar",
				topic: "",
				ageGroup: "adults",
				ageLabel: "",
				durationMinutes: 20,
				exerciseCount: 0,
			},
			title: "",
		});
		expect(workbookFilename(totallyEmpty)).toBe("workbook.html");
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
		expect(
			workbookToHtml(
				makeWorkbook({ meta: makeMeta({ targetLanguage: "English" }) }),
			),
		).toMatch(/<html lang="en">/);
		expect(
			workbookToHtml(
				makeWorkbook({ meta: makeMeta({ targetLanguage: "Spanish" }) }),
			),
		).toMatch(/<html lang="es">/);
		expect(
			workbookToHtml(
				makeWorkbook({ meta: makeMeta({ targetLanguage: "Ukrainian" }) }),
			),
		).toMatch(/<html lang="uk">/);
	});

	it("omits lang attribute for unknown languages", () => {
		const html = workbookToHtml(
			makeWorkbook({ meta: makeMeta({ targetLanguage: "Klingon" }) }),
		);
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
							label: "A",
							text: `<img src=x onerror=alert(1)>`,
							isCorrect: false,
							explanationIfChosen: "Nope.",
						},
						{
							label: "B",
							text: "safe",
							isCorrect: true,
							explanationIfChosen: "Correct! safe.",
						},
						{
							label: "C",
							text: "other",
							isCorrect: false,
							explanationIfChosen: "Also not.",
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
					prompt: "Match the verb with its past simple.",
					leftLabel: "Base",
					rightLabel: "Past",
					pairs: [
						{ left: "go", right: "went" },
						{ left: "have", right: "had" },
						{ left: "see", right: "saw" },
						{ left: "buy", right: "bought" },
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
			{ left: "go", right: "went" },
			{ left: "have", right: "had" },
			{ left: "see", right: "saw" },
			{ left: "buy", right: "bought" },
			{ left: "take", right: "took" },
		];
		const html = workbookToHtml(
			makeWorkbook({
				exercises: [
					{
						id: 1,
						kind: "matching",
						prompt: "Match the verb with its past simple.",
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
						prompt: "Complete the sentence with the past simple.",
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

	it("escapes reading sub-question ids in HTML attributes", () => {
		// Defense-in-depth: the schema already rejects ids outside
		// [a-zA-Z0-9_-], but the renderer must still escape in case a bad id
		// bypasses validation (e.g. a caller that skips safeParse).
		const payload = '1a" onfocus=alert(1) autofocus="x';
		const html = workbookToHtml(
			makeWorkbook({
				exercises: [
					{
						id: 1,
						kind: "reading",
						prompt: "Read, then answer.",
						passage: { title: "P", text: "Some passage text." },
						questions: [
							{
								id: payload,
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
								id: payload,
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
			}),
		);
		// The raw payload (with an unescaped ") must never appear — that's
		// what would break out of the attribute and turn `onfocus=...` into
		// a real event handler. The substring `onfocus=alert(1)` *does*
		// appear inside the escaped value, which is safe: it's just text
		// inside a properly-closed attribute.
		expect(html).not.toContain(payload);
		// Prove the boundary holds: name="q-1a&quot;..." — the first " in
		// the payload is escaped, so the attribute value stays one token.
		expect(html).toContain(
			'name="q-1a&quot; onfocus=alert(1) autofocus=&quot;x"',
		);
		// And no attribute boundary leaks `q-1a"` followed by raw markup.
		expect(html).not.toMatch(/name="q-1a"\s/);
	});
});

function mountWorkbook(workbook: Workbook): HTMLElement {
	const host = document.createElement("div");
	host.innerHTML = workbookMarkup(workbook);
	document.body.appendChild(host);
	workbookInit(document);
	return host;
}

function clickCheck(): void {
	document.querySelector<HTMLButtonElement>("#wb-check")?.click();
}

function makeMeta(overrides: Partial<Workbook["meta"]> = {}): Workbook["meta"] {
	return {
		targetLanguage: "English",
		nativeLanguage: "English",
		level: "A2",
		levelLabel: "Elementary",
		skillFocus: "grammar",
		topic: "Past simple",
		ageGroup: "adults",
		ageLabel: "Adults",
		durationMinutes: 20,
		exerciseCount: 0,
		...overrides,
	};
}

describe("workbookInit reveal behavior", () => {
	beforeEach(() => {
		// Fresh body between cases — `workbookInit` wires listeners onto the
		// buttons rendered in the DOM, and leftover trees would pollute.
		document.body.innerHTML = "";
	});

	it("marks the correct MC option as correct and locks all radios", () => {
		mountWorkbook(makeWorkbook({ exercises: [MC_EXERCISE] }));
		// Pick the wrong option first.
		const wrong = document.querySelector<HTMLInputElement>(
			'input[type="radio"][value="0"]',
		);
		expect(wrong).not.toBeNull();
		if (wrong) wrong.checked = true;

		clickCheck();

		const opts = document.querySelectorAll<HTMLElement>(".opt");
		expect(opts[0]?.getAttribute("data-state")).toBe("incorrect");
		expect(opts[1]?.getAttribute("data-state")).toBe("correct");
		// Correct radio gets checked on reveal even though user picked the wrong one.
		const correctRadio = document.querySelector<HTMLInputElement>(
			'input[type="radio"][value="1"]',
		);
		expect(correctRadio?.checked).toBe(true);
		// Every radio is disabled.
		document
			.querySelectorAll<HTMLInputElement>('input[type="radio"]')
			.forEach((r) => {
				expect(r.disabled).toBe(true);
			});
	});

	it("only marks the correct MC option when the user leaves it blank", () => {
		mountWorkbook(makeWorkbook({ exercises: [MC_EXERCISE] }));
		clickCheck();
		const opts = document.querySelectorAll<HTMLElement>(".opt");
		expect(opts[0]?.getAttribute("data-state")).toBeNull();
		expect(opts[1]?.getAttribute("data-state")).toBe("correct");
	});

	it("opens the explanation <details> and unhides every option-exp on reveal", () => {
		mountWorkbook(makeWorkbook({ exercises: [MC_EXERCISE] }));
		const details = document.querySelector<HTMLDetailsElement>("details.exp");
		expect(details?.open).toBe(false);
		expect(details?.hidden).toBe(true);

		clickCheck();

		expect(details?.hidden).toBe(false);
		expect(details?.open).toBe(true);
		document.querySelectorAll<HTMLElement>(".opt-exp").forEach((el) => {
			expect(el.hidden).toBe(false);
		});
	});

	it("marks TF correct option when the user picks wrong", () => {
		mountWorkbook(makeWorkbook({ exercises: [TF_EXERCISE] }));
		// TF_EXERCISE.correctAnswer === false; pick "true" (wrong).
		const trueRadio = document.querySelector<HTMLInputElement>(
			'input[type="radio"][value="true"]',
		);
		if (trueRadio) trueRadio.checked = true;

		clickCheck();

		const [trueOpt, falseOpt] = document.querySelectorAll<HTMLElement>(".opt");
		expect(trueOpt?.getAttribute("data-state")).toBe("incorrect");
		expect(falseOpt?.getAttribute("data-state")).toBe("correct");
		// False radio is now checked.
		const falseRadio = document.querySelector<HTMLInputElement>(
			'input[type="radio"][value="false"]',
		);
		expect(falseRadio?.checked).toBe(true);
	});

	it("populates fill-blank input with the first accepted answer when empty", () => {
		mountWorkbook(
			makeWorkbook({
				exercises: [
					{
						id: 9,
						kind: "fillBlank",
						prompt: "Fill in the blank.",
						sentence: "Yesterday I {{blank}} home.",
						blanks: [
							{
								hint: "go",
								acceptedAnswers: ["went"],
								explanation: "Past of 'go'.",
							},
						],
					},
				],
			}),
		);
		clickCheck();
		const input = document.querySelector<HTMLInputElement>(".fb input");
		expect(input?.value).toBe("went");
		expect(input?.disabled).toBe(true);
		expect(document.querySelector(".fb")?.getAttribute("data-state")).toBe(
			"incorrect",
		);
	});

	it("keeps a correct fill-blank answer as-is and marks it correct", () => {
		mountWorkbook(
			makeWorkbook({
				exercises: [
					{
						id: 9,
						kind: "fillBlank",
						prompt: "Fill in the blank.",
						sentence: "Yesterday I {{blank}} home.",
						blanks: [
							{
								hint: "go",
								acceptedAnswers: ["went"],
								explanation: "Past of 'go'.",
							},
						],
					},
				],
			}),
		);
		const input = document.querySelector<HTMLInputElement>(".fb input");
		if (input) input.value = "  WENT  "; // whitespace + case-insensitive
		clickCheck();
		expect(input?.value.trim().toLowerCase()).toBe("went");
		expect(document.querySelector(".fb")?.getAttribute("data-state")).toBe(
			"correct",
		);
	});

	it("populates matching select with the correct value on wrong pick", () => {
		mountWorkbook(
			makeWorkbook({
				exercises: [
					{
						id: 5,
						kind: "matching",
						prompt: "Match the verb with its past simple.",
						leftLabel: "Base",
						rightLabel: "Past",
						pairs: [
							{ left: "go", right: "went" },
							{ left: "have", right: "had" },
							{ left: "see", right: "saw" },
						],
					},
				],
			}),
		);
		const [row1, row2, row3] =
			document.querySelectorAll<HTMLElement>(".match-row");
		const s1 = row1?.querySelector<HTMLSelectElement>("select");
		const s2 = row2?.querySelector<HTMLSelectElement>("select");
		const s3 = row3?.querySelector<HTMLSelectElement>("select");
		if (s1) s1.value = "had"; // wrong for 'go'
		// leave s2 and s3 blank
		clickCheck();
		expect(s1?.value).toBe("went");
		expect(s2?.value).toBe("had");
		expect(s3?.value).toBe("saw");
		expect(s1?.disabled).toBe(true);
		expect(s2?.disabled).toBe(true);
		expect(row1?.getAttribute("data-state")).toBe("incorrect");
		expect(row2?.getAttribute("data-state")).toBe("incorrect");
	});

	it("disables the Check button and tags .wb with data-revealed", () => {
		mountWorkbook(makeWorkbook({ exercises: [MC_EXERCISE] }));
		clickCheck();
		const btn = document.querySelector<HTMLButtonElement>("#wb-check");
		expect(btn?.disabled).toBe(true);
		expect(btn?.textContent).toBe("Checked");
		expect(document.querySelector(".wb")?.hasAttribute("data-revealed")).toBe(
			true,
		);
	});
});
