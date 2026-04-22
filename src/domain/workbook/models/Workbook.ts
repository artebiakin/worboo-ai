export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type SkillFocus = "grammar" | "vocabulary" | "reading" | "mixed";
export type AgeGroup = "children" | "teenagers" | "adults";
export type DifficultyDistribution = "progressive" | "uniform";

export type SuggestionId =
	| "levelUp"
	| "levelDown"
	| "moreExercises"
	| "focusGrammar"
	| "focusVocab"
	| "shorterLesson"
	| "homeworkVersion"
	| "followUp";

export interface MultipleChoiceOption {
	label: string;
	text: string;
	isCorrect: boolean;
	explanationIfChosen: string;
}

export interface TrueFalseAnswer {
	correctAnswer: boolean;
	correction?: string;
	explanationIfTrueChosen: string;
	explanationIfFalseChosen: string;
}

export interface MatchingPair {
	left: string;
	right: string;
}

export interface FillBlank {
	hint: string;
	acceptedAnswers: string[];
	explanation: string;
}

export const FILL_BLANK_PLACEHOLDER = "{{blank}}";

interface ExerciseBase {
	title?: string;
}

type MultipleChoiceExercise = ExerciseBase & {
	id: number;
	kind: "multipleChoice";
	prompt: string;
	options: MultipleChoiceOption[];
};

type TrueFalseExercise = ExerciseBase & {
	id: number;
	kind: "trueFalse";
	prompt: string;
	statement: string;
} & TrueFalseAnswer;

type FillBlankExercise = ExerciseBase & {
	id: number;
	kind: "fillBlank";
	prompt: string;
	sentence: string;
	blanks: FillBlank[];
};

type MatchingExercise = ExerciseBase & {
	id: number;
	kind: "matching";
	prompt: string;
	leftLabel: string;
	rightLabel: string;
	pairs: MatchingPair[];
};

type ReadingExercise = ExerciseBase & {
	id: number;
	kind: "reading";
	prompt: string;
	passage: ReadingPassage;
	questions: ReadingSubQuestion[];
};

export type Exercise =
	| MultipleChoiceExercise
	| TrueFalseExercise
	| FillBlankExercise
	| MatchingExercise
	| ReadingExercise;

export interface ReadingPassage {
	title: string;
	text: string;
}

export type ReadingSubQuestion =
	| {
			id: string;
			kind: "multipleChoice";
			prompt: string;
			options: MultipleChoiceOption[];
	  }
	| ({
			id: string;
			kind: "trueFalse";
			prompt: string;
			statement: string;
	  } & TrueFalseAnswer);

export interface WorkbookMeta {
	targetLanguage: string;
	nativeLanguage: string;
	level: CefrLevel;
	levelLabel: string;
	skillFocus: SkillFocus;
	topic: string;
	ageGroup: AgeGroup;
	ageLabel: string;
	durationMinutes: number;
	exerciseCount: number;
}

export interface Workbook {
	title: string;
	eyebrow: string;
	intro: string;
	objectives: string[];
	meta: WorkbookMeta;
	exercises: Exercise[];
}

export interface WorkbookReasoning {
	detectedLanguage: string;
	detectedLevel: string | null;
	chosenTopic: string;
	chosenSkillFocus: SkillFocus;
	chosenAgeGroup: AgeGroup;
	chosenDurationMinutes: number;
	chosenExerciseCounts: Record<string, number>;
	chosenDifficultyDistribution: DifficultyDistribution;
	notes?: string;
}

export type ClarificationQuestionKind =
	| "required"
	| "conflict"
	| "clarify"
	| "enhance"
	| "choice";

export interface ClarificationOption {
	label: string;
	value: string;
}

export interface ClarificationQuestion {
	kind: ClarificationQuestionKind;
	text: string;
	options: ClarificationOption[];
	skippable: boolean;
}
