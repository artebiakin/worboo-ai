interface ExerciseBase {
	id: number;
	title?: string;
	instructions?: string;
}

export interface MultipleChoiceOption {
	text: string;
	isCorrect: boolean;
	explanationIfChosen: string;
}

export type TrueFalseAnswer =
	| {
			correctAnswer: true;
			explanationIfTrueChosen: string;
			explanationIfFalseChosen: string;
	  }
	| {
			correctAnswer: false;
			correction: string;
			explanationIfTrueChosen: string;
			explanationIfFalseChosen: string;
	  };

export interface MatchingPair {
	left: string;
	right: string;
	explanation: string;
}

export interface FillBlank {
	hint: string;
	acceptedAnswers: string[];
	explanation: string;
}

export const FILL_BLANK_PLACEHOLDER = "{{blank}}";

export type ReadingQuestion =
	| {
			kind: "multipleChoice";
			prompt: string;
			options: MultipleChoiceOption[];
	  }
	| ({
			kind: "trueFalse";
			statement: string;
	  } & TrueFalseAnswer);

export type Exercise =
	| (ExerciseBase & {
			kind: "reading";
			title: string;
			text: string;
			questions: ReadingQuestion[];
	  })
	| (ExerciseBase & {
			kind: "multipleChoice";
			prompt: string;
			options: MultipleChoiceOption[];
	  })
	| (ExerciseBase & {
			kind: "trueFalse";
			statement: string;
	  } & TrueFalseAnswer)
	| (ExerciseBase & {
			kind: "fillBlank";
			sentence: string;
			blanks: FillBlank[];
	  })
	| (ExerciseBase & {
			kind: "matching";
			leftLabel: string;
			rightLabel: string;
			pairs: MatchingPair[];
	  });

export type SkillFocus = "grammar" | "vocabulary" | "reading" | "mixed";
export type AgeGroup = "children" | "teenagers" | "adults";
export type DifficultyDistribution = "progressive" | "uniform";
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

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

export interface Workbook {
	topic: string;
	targetLanguage: string;
	level: CefrLevel;
	title: string;
	tags: string[];
	intro: string;
	objectives: string[];
	exercises: Exercise[];
	suggestions: string[];
	reasoning: WorkbookReasoning;
}
