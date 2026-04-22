import { describe, expect, it } from "vitest";
import { buildSystemPrompt, buildUserPrompt } from "./workbook-generation";

describe("buildSystemPrompt", () => {
	it("pins the offline requirement and exercise kinds", () => {
		const system = buildSystemPrompt();
		expect(system).toContain("offline");
		expect(system).toContain("reading");
		expect(system).toContain("multipleChoice");
		expect(system).toContain("trueFalse");
		expect(system).toContain("fillBlank");
		expect(system).toContain("matching");
	});

	it("tells the model to use the literal blank placeholder", () => {
		const system = buildSystemPrompt();
		expect(system).toContain("{{blank}}");
	});

	it("tells the model to populate the reasoning field", () => {
		const system = buildSystemPrompt();
		expect(system.toLowerCase()).toContain("reasoning");
	});
});

describe("buildUserPrompt", () => {
	it("includes the teacher's prompt verbatim", () => {
		const user = buildUserPrompt({
			prompt: "English past simple for A2 teens",
		});
		expect(user).toContain("English past simple for A2 teens");
	});

	it("prints explicit values when the teacher provided them", () => {
		const user = buildUserPrompt({
			prompt: "anything",
			level: "B1",
			targetLanguage: "Spanish",
			durationMinutes: 25,
			exerciseCount: 6,
			theme: "summer",
		});
		expect(user).toContain("CEFR level: B1");
		expect(user).toContain("Target language: Spanish");
		expect(user).toContain("Duration: 25 minutes");
		expect(user).toContain("Exercise count: 6 exercises");
		expect(user).toContain("Theme: summer");
	});

	it("marks unspecified fields as to-be-inferred", () => {
		const user = buildUserPrompt({ prompt: "anything" });
		expect(user).toContain("CEFR level: infer from the prompt");
		expect(user).toContain("Target language: infer from the prompt");
		expect(user).toContain("Duration: teacher did not specify");
		expect(user).toContain("Exercise count: teacher did not specify");
		expect(user).toContain("Theme: teacher has no preference");
	});

	it("trims surrounding whitespace from the teacher's prompt", () => {
		const user = buildUserPrompt({ prompt: "  lots of space  \n" });
		expect(user).toContain("Teacher prompt: lots of space");
	});
});
