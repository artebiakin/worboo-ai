import type {
	AgeGroup,
	CefrLevel,
	Exercise,
	SkillFocus,
	Workbook,
	WorkbookMeta,
} from "../models/Workbook";
import type { GenerateWorkbookInput } from "../prompts/workbook-generation";

/**
 * Shape `hydrateWorkbook` accepts. Wider than `Workbook` — the model may have
 * dropped metadata (Haiku-class) or shipped the full envelope (Sonnet-class).
 * Only `workbook.exercises` is required; everything else is filled from input.
 */
export interface HydrateInput {
	workbook: {
		title?: string;
		eyebrow?: string;
		intro?: string;
		objectives?: string[];
		meta?: Partial<WorkbookMeta>;
		exercises: Exercise[];
	};
}

const DEFAULT_LEVEL: CefrLevel = "A2";
const DEFAULT_LANGUAGE = "English";
const DEFAULT_SKILL_FOCUS: SkillFocus = "mixed";
const DEFAULT_AGE_GROUP: AgeGroup = "teenagers";
const MINUTES_PER_EXERCISE = 4;

const LEVEL_LABEL: Record<CefrLevel, string> = {
	A1: "Beginner",
	A2: "Elementary",
	B1: "Intermediate",
	B2: "Upper-Intermediate",
	C1: "Advanced",
	C2: "Proficient",
};

const AGE_LABEL: Record<AgeGroup, string> = {
	children: "Ages 6–10",
	teenagers: "Ages 13–17",
	adults: "Adults",
};

/**
 * Fills in every top-level field the model may have omitted. Sonnet-class
 * models return the full shape reliably; Haiku-class models drop metadata and
 * return only `workbook.exercises`. This function works for either — it uses
 * what the model provided and falls back to the teacher's input + sensible
 * defaults for anything missing.
 */
export function hydrateWorkbook(
	response: HydrateInput,
	input: GenerateWorkbookInput,
): Workbook {
	const body = response.workbook;
	const partialMeta = body.meta ?? {};
	const exercises = body.exercises;
	const exerciseCount = exercises.length;

	const level: CefrLevel = partialMeta.level ?? input.level ?? DEFAULT_LEVEL;
	const targetLanguage =
		partialMeta.targetLanguage ?? input.targetLanguage ?? DEFAULT_LANGUAGE;
	const topic =
		(partialMeta.topic ?? "").trim() || topicFromPrompt(input.prompt);
	const skillFocus: SkillFocus = partialMeta.skillFocus ?? DEFAULT_SKILL_FOCUS;
	const ageGroup: AgeGroup = partialMeta.ageGroup ?? DEFAULT_AGE_GROUP;
	const durationMinutes = clampDuration(
		partialMeta.durationMinutes ??
			input.durationMinutes ??
			Math.max(15, exerciseCount * MINUTES_PER_EXERCISE),
	);

	const meta: WorkbookMeta = {
		targetLanguage,
		nativeLanguage: partialMeta.nativeLanguage ?? targetLanguage,
		level,
		levelLabel: partialMeta.levelLabel ?? LEVEL_LABEL[level],
		skillFocus,
		topic,
		ageGroup,
		ageLabel: partialMeta.ageLabel ?? AGE_LABEL[ageGroup],
		durationMinutes,
		exerciseCount: partialMeta.exerciseCount ?? exerciseCount,
	};

	const title = (body.title ?? "").trim() || topic;
	const eyebrow =
		(body.eyebrow ?? "").trim() || `${topic} · ${level} ${targetLanguage}`;
	const intro = (body.intro ?? "").trim() || defaultIntro(topic);
	const objectives = nonEmpty(body.objectives) ?? [
		`practise ${topic.toLowerCase()}`,
	];

	return {
		title,
		eyebrow,
		intro,
		objectives,
		meta,
		exercises,
	};
}

function topicFromPrompt(prompt: string): string {
	const trimmed = prompt.trim();
	if (trimmed.length === 0) return "Language practice";
	if (trimmed.length <= 60) return trimmed;
	return `${trimmed.slice(0, 57).trimEnd()}…`;
}

function defaultIntro(topic: string): string {
	return `Let's practise ${topic.toLowerCase()}.`;
}

function nonEmpty<T>(arr: T[] | undefined): T[] | undefined {
	return arr && arr.length > 0 ? arr : undefined;
}

function clampDuration(minutes: number): number {
	if (minutes < 15) return 15;
	if (minutes > 60) return 60;
	return Math.round(minutes);
}
