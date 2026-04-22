import { z } from "zod";
import type {
	ClarificationQuestion,
	Exercise,
	FillBlank,
	MatchingPair,
	MultipleChoiceOption,
	ReadingSubQuestion,
	SuggestionId,
	TrueFalseAnswer,
	Workbook,
	WorkbookMeta,
	WorkbookReasoning,
} from "./Workbook";

const cefrLevelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);
const skillFocusSchema = z.enum(["grammar", "vocabulary", "reading", "mixed"]);
const ageGroupSchema = z.enum(["children", "teenagers", "adults"]);
const difficultyDistributionSchema = z.enum(["progressive", "uniform"]);

const suggestionIdSchema = z.enum([
	"levelUp",
	"levelDown",
	"moreExercises",
	"focusGrammar",
	"focusVocab",
	"shorterLesson",
	"homeworkVersion",
	"followUp",
]);

const multipleChoiceOptionSchema = z.object({
	label: z.string(),
	text: z.string(),
	isCorrect: z.boolean(),
	explanationIfChosen: z.string(),
});

const matchingPairSchema = z.object({
	left: z.string(),
	right: z.string(),
});

const fillBlankSchema = z.object({
	hint: z.string(),
	acceptedAnswers: z.array(z.string()).min(1),
	explanation: z.string(),
});

const readingPassageSchema = z.object({
	title: z.string(),
	text: z.string(),
});

// Sub-question ids land in HTML attributes (id=, name=, data-q=, data-exp-for=),
// so restrict to an alphanumeric/dash/underscore charset to keep the Zod parse
// the first line of defense against attribute-breakout payloads. The render
// layer escapes too, but rejecting weird ids upstream gives a cleaner failure.
const readingSubQuestionIdSchema = z.string().regex(/^[a-zA-Z0-9_-]+$/);

const readingSubQuestionSchema = z.discriminatedUnion("kind", [
	z.object({
		id: readingSubQuestionIdSchema,
		kind: z.literal("multipleChoice"),
		prompt: z.string(),
		options: z.array(multipleChoiceOptionSchema).min(3).max(4),
	}),
	z.object({
		id: readingSubQuestionIdSchema,
		kind: z.literal("trueFalse"),
		prompt: z.string(),
		statement: z.string(),
		correctAnswer: z.boolean(),
		correction: z.string().optional(),
		explanationIfTrueChosen: z.string(),
		explanationIfFalseChosen: z.string(),
	}),
]);

const exerciseSchema = z.discriminatedUnion("kind", [
	z.object({
		id: z.number().int(),
		title: z.string().optional(),
		kind: z.literal("multipleChoice"),
		prompt: z.string(),
		options: z.array(multipleChoiceOptionSchema).min(3).max(4),
	}),
	z.object({
		id: z.number().int(),
		title: z.string().optional(),
		kind: z.literal("trueFalse"),
		prompt: z.string(),
		statement: z.string(),
		correctAnswer: z.boolean(),
		correction: z.string().optional(),
		explanationIfTrueChosen: z.string(),
		explanationIfFalseChosen: z.string(),
	}),
	z.object({
		id: z.number().int(),
		title: z.string().optional(),
		kind: z.literal("fillBlank"),
		prompt: z.string(),
		sentence: z.string(),
		blanks: z.array(fillBlankSchema).min(1),
	}),
	z.object({
		id: z.number().int(),
		title: z.string().optional(),
		kind: z.literal("matching"),
		prompt: z.string(),
		leftLabel: z.string(),
		rightLabel: z.string(),
		pairs: z.array(matchingPairSchema).min(3).max(8),
	}),
	z.object({
		id: z.number().int(),
		title: z.string().optional(),
		kind: z.literal("reading"),
		prompt: z.string(),
		passage: readingPassageSchema,
		questions: z.array(readingSubQuestionSchema).min(2).max(5),
	}),
]);

const workbookMetaSchema = z.object({
	targetLanguage: z.string(),
	nativeLanguage: z.string(),
	level: cefrLevelSchema,
	levelLabel: z.string(),
	skillFocus: skillFocusSchema,
	topic: z.string(),
	ageGroup: ageGroupSchema,
	ageLabel: z.string(),
	durationMinutes: z.number().int().min(15).max(60),
	exerciseCount: z.number().int().min(1).max(20),
});

const workbookContentSchema = z.object({
	title: z.string(),
	eyebrow: z.string(),
	intro: z.string(),
	objectives: z.array(z.string()).min(2).max(4),
	meta: workbookMetaSchema,
	exercises: z.array(exerciseSchema).min(1).max(20),
});

const workbookReasoningSchema = z.object({
	detectedLanguage: z.string(),
	detectedLevel: z.string().nullable(),
	chosenTopic: z.string(),
	chosenSkillFocus: skillFocusSchema,
	chosenAgeGroup: ageGroupSchema,
	chosenDurationMinutes: z.number().int(),
	chosenExerciseCounts: z.record(z.string(), z.number().int().nonnegative()),
	chosenDifficultyDistribution: difficultyDistributionSchema,
	notes: z.string().optional(),
});

const clarificationQuestionSchema = z.object({
	kind: z.enum(["required", "conflict", "clarify", "enhance", "choice"]),
	text: z.string(),
	options: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.min(2)
		.max(4),
	skippable: z.boolean(),
});

/**
 * Primary schema — matches the response envelope the system prompt produces.
 *
 * Top-level is intentionally a flat `z.object` rather than a
 * `z.discriminatedUnion` on `type`. Discriminated unions compile to JSON
 * Schema `oneOf` at the root, and Anthropic tool schemas (used by AI SDK
 * `Output.object` for structured output) require `type: object` at the root.
 * AI Gateway rejects the request with `Schema type 'oneOf' is not supported`
 * when the root is a union. We emulate the union by making `workbook`,
 * `suggestions`, `reasoning`, and `questions` optional, and narrow on `type`
 * after parse (see `generate-workbook-with-model.ts`).
 *
 * The workbook body lives under `workbook` (not `content`): Sonnet 4.6
 * empirically mistook the generic word "content" for an outer envelope key
 * and wrapped the whole response under `{ content: ... }`. The specific
 * noun forces correct nesting.
 */
export const workbookResponseSchema = z.object({
	type: z.enum(["workbook", "questions"]),
	workbook: workbookContentSchema.optional(),
	suggestions: z.array(suggestionIdSchema).min(2).max(4).optional(),
	reasoning: workbookReasoningSchema.optional(),
	questions: z.array(clarificationQuestionSchema).min(1).max(3).optional(),
});

export const workbookSchema = workbookContentSchema;

// Compile-time parity: the Zod output and the hand-written types must stay aligned.
const _workbook: Workbook = {} as z.infer<typeof workbookContentSchema>;
const _workbookInv: z.infer<typeof workbookContentSchema> = {} as Workbook;
const _meta: WorkbookMeta = {} as z.infer<typeof workbookMetaSchema>;
const _option: MultipleChoiceOption = {} as z.infer<
	typeof multipleChoiceOptionSchema
>;
const _pair: MatchingPair = {} as z.infer<typeof matchingPairSchema>;
const _fb: FillBlank = {} as z.infer<typeof fillBlankSchema>;
const _rsq: ReadingSubQuestion = {} as z.infer<typeof readingSubQuestionSchema>;
const _ex: Exercise = {} as z.infer<typeof exerciseSchema>;
const _reasoning: WorkbookReasoning = {} as z.infer<
	typeof workbookReasoningSchema
>;
const _cq: ClarificationQuestion = {} as z.infer<
	typeof clarificationQuestionSchema
>;
const _suggestion: SuggestionId = {} as z.infer<typeof suggestionIdSchema>;
const _tf: TrueFalseAnswer = {
	correctAnswer: true,
	explanationIfTrueChosen: "",
	explanationIfFalseChosen: "",
};
void _workbook;
void _workbookInv;
void _meta;
void _option;
void _pair;
void _fb;
void _rsq;
void _ex;
void _reasoning;
void _cq;
void _suggestion;
void _tf;
