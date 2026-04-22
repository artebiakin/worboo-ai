import { z } from "zod";
import type {
	Exercise,
	FillBlank,
	MatchingPair,
	MultipleChoiceOption,
	ReadingQuestion,
	TrueFalseAnswer,
	Workbook,
	WorkbookReasoning,
} from "./Workbook";

const cefrLevelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

const skillFocusSchema = z.enum(["grammar", "vocabulary", "reading", "mixed"]);

const ageGroupSchema = z.enum(["children", "teenagers", "adults"]);

const difficultyDistributionSchema = z.enum(["progressive", "uniform"]);

const multipleChoiceOptionSchema = z.object({
	text: z.string(),
	isCorrect: z.boolean(),
	explanationIfChosen: z.string(),
});

const trueFalseAnswerSchema = z.discriminatedUnion("correctAnswer", [
	z.object({
		correctAnswer: z.literal(true),
		explanationIfTrueChosen: z.string(),
		explanationIfFalseChosen: z.string(),
	}),
	z.object({
		correctAnswer: z.literal(false),
		correction: z.string(),
		explanationIfTrueChosen: z.string(),
		explanationIfFalseChosen: z.string(),
	}),
]);

const matchingPairSchema = z.object({
	left: z.string(),
	right: z.string(),
	explanation: z.string(),
});

const fillBlankSchema = z.object({
	hint: z.string(),
	acceptedAnswers: z.array(z.string()).min(1),
	explanation: z.string(),
});

const readingQuestionSchema = z.union([
	z.object({
		kind: z.literal("multipleChoice"),
		prompt: z.string(),
		options: z.array(multipleChoiceOptionSchema).min(2),
	}),
	z.object({
		kind: z.literal("trueFalse"),
		statement: z.string(),
		correctAnswer: z.literal(true),
		explanationIfTrueChosen: z.string(),
		explanationIfFalseChosen: z.string(),
	}),
	z.object({
		kind: z.literal("trueFalse"),
		statement: z.string(),
		correctAnswer: z.literal(false),
		correction: z.string(),
		explanationIfTrueChosen: z.string(),
		explanationIfFalseChosen: z.string(),
	}),
]);

const exerciseBaseSchema = z.object({
	id: z.number().int(),
	title: z.string().optional(),
	instructions: z.string().optional(),
});

const exerciseSchema = z.union([
	exerciseBaseSchema.extend({
		kind: z.literal("reading"),
		title: z.string(),
		text: z.string(),
		questions: z.array(readingQuestionSchema).min(1),
	}),
	exerciseBaseSchema.extend({
		kind: z.literal("multipleChoice"),
		prompt: z.string(),
		options: z.array(multipleChoiceOptionSchema).min(2),
	}),
	exerciseBaseSchema.extend({
		kind: z.literal("trueFalse"),
		statement: z.string(),
		correctAnswer: z.literal(true),
		explanationIfTrueChosen: z.string(),
		explanationIfFalseChosen: z.string(),
	}),
	exerciseBaseSchema.extend({
		kind: z.literal("trueFalse"),
		statement: z.string(),
		correctAnswer: z.literal(false),
		correction: z.string(),
		explanationIfTrueChosen: z.string(),
		explanationIfFalseChosen: z.string(),
	}),
	exerciseBaseSchema.extend({
		kind: z.literal("fillBlank"),
		sentence: z.string(),
		blanks: z.array(fillBlankSchema).min(1),
	}),
	exerciseBaseSchema.extend({
		kind: z.literal("matching"),
		leftLabel: z.string(),
		rightLabel: z.string(),
		pairs: z.array(matchingPairSchema).min(2),
	}),
]);

const workbookReasoningSchema = z.object({
	detectedLanguage: z.string(),
	detectedLevel: z.string().nullable(),
	chosenTopic: z.string(),
	chosenSkillFocus: skillFocusSchema,
	chosenAgeGroup: ageGroupSchema,
	chosenDurationMinutes: z.number().int().positive(),
	chosenExerciseCounts: z.record(z.string(), z.number().int().nonnegative()),
	chosenDifficultyDistribution: difficultyDistributionSchema,
	notes: z.string().optional(),
});

export const workbookSchema = z.object({
	topic: z.string(),
	targetLanguage: z.string(),
	level: cefrLevelSchema,
	title: z.string(),
	tags: z.array(z.string()),
	intro: z.string(),
	objectives: z.array(z.string()).min(1),
	exercises: z.array(exerciseSchema).min(1).max(12),
	suggestions: z.array(z.string()),
	reasoning: workbookReasoningSchema,
});

// Compile-time parity check: the Zod schema and the hand-written Workbook type
// must stay in sync. If they drift, one of these assignments will fail to type-check.
type SchemaWorkbook = z.infer<typeof workbookSchema>;
const _schemaMatchesType: SchemaWorkbook = {} as Workbook;
const _typeMatchesSchema: Workbook = {} as SchemaWorkbook;
void _schemaMatchesType;
void _typeMatchesSchema;

// Same parity check for the nested shapes the model is most likely to drift on.
const _option: MultipleChoiceOption = {} as z.infer<
	typeof multipleChoiceOptionSchema
>;
const _tf: TrueFalseAnswer = {} as z.infer<typeof trueFalseAnswerSchema>;
const _pair: MatchingPair = {} as z.infer<typeof matchingPairSchema>;
const _fb: FillBlank = {} as z.infer<typeof fillBlankSchema>;
const _rq: ReadingQuestion = {} as z.infer<typeof readingQuestionSchema>;
const _ex: Exercise = {} as z.infer<typeof exerciseSchema>;
const _rz: WorkbookReasoning = {} as z.infer<typeof workbookReasoningSchema>;
void _option;
void _tf;
void _pair;
void _fb;
void _rq;
void _ex;
void _rz;
