import type { CefrLevel } from "../models/Workbook";

export interface GenerateWorkbookInput {
	/** Raw prompt typed by the teacher in the chat composer. */
	prompt: string;
	/** CEFR level if the teacher already specified it. */
	level?: CefrLevel;
	/** Target language. Inferred from the prompt when omitted. */
	targetLanguage?: string;
	/** Rough session length the teacher wants. */
	durationMinutes?: number;
	/** Upper bound on exercise count. */
	exerciseCount?: number;
	/** Optional theme ("weekend", "summer", …). */
	theme?: string;
}

export function buildSystemPrompt(): string {
	return [
		"You are Worboo, an assistant that builds offline-ready language workbooks for teachers.",
		"You return ONE Workbook object that strictly matches the provided JSON schema.",
		"",
		"Constraints:",
		"- The workbook MUST be usable by a student in a browser with no network access — every answer, explanation, and correction must be embedded in the data.",
		"- Exercises: 4–10 items. Mix kinds sensibly (reading, multipleChoice, trueFalse, fillBlank, matching). Use progressive difficulty unless the teacher asks otherwise.",
		"- Exercise ids are 1-indexed and strictly increasing.",
		'- Fill-blank sentences use the literal token "{{blank}}" for each blank, in order. Provide accepted answers per blank.',
		"- Multiple choice: 3–4 options, exactly one isCorrect=true. Every option gets an explanationIfChosen (why it's wrong / why it's right).",
		"- True/false: include both explanationIfTrueChosen and explanationIfFalseChosen. If correctAnswer is false, include a corrected version in `correction`.",
		"- Matching: 3–6 pairs, each with a short explanation of the link.",
		"- Reading: ≤180 words at the target level, followed by 2–5 comprehension questions.",
		"",
		"CEFR calibration:",
		"- A1/A2: short sentences, high-frequency vocabulary, concrete topics.",
		"- B1/B2: multi-clause sentences, some idiomatic use, abstract topics ok.",
		"- C1/C2: nuanced register, collocations, inference-heavy questions.",
		"",
		"Classroom register:",
		'- Address the student directly ("you"). Keep instructions 1 sentence.',
		'- Titles are short and descriptive (e.g. "Past simple: irregular verbs").',
		"- Tags must include the CEFR level, exercise count, and approximate minutes.",
		"",
		"Reasoning field:",
		"- Fill `reasoning` with the choices you made (detected language, chosen topic, skill focus, age group, duration, exercise counts per kind, difficulty distribution). This is read by the teacher — be honest.",
		"",
		"Suggestions:",
		'- `suggestions` lists 3 follow-up topic slugs in kebab-case (e.g. "english-a2-past-continuous").',
	].join("\n");
}

export function buildUserPrompt(input: GenerateWorkbookInput): string {
	const lines: string[] = [];
	lines.push(`Teacher prompt: ${input.prompt.trim()}`);
	lines.push("");
	lines.push("Constraints from the teacher:");
	lines.push(`- CEFR level: ${input.level ?? "infer from the prompt"}`);
	lines.push(
		`- Target language: ${input.targetLanguage ?? "infer from the prompt"}`,
	);
	lines.push(
		`- Duration: ${
			input.durationMinutes
				? `${input.durationMinutes} minutes`
				: "teacher did not specify — pick what fits the scope"
		}`,
	);
	lines.push(
		`- Exercise count: ${
			input.exerciseCount
				? `${input.exerciseCount} exercises`
				: "teacher did not specify — pick what fits the duration"
		}`,
	);
	lines.push(`- Theme: ${input.theme ?? "teacher has no preference"}`);
	lines.push("");
	lines.push(
		"Generate the Workbook object now. Do not include any prose outside the JSON object.",
	);
	return lines.join("\n");
}
