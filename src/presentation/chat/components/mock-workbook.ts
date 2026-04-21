interface ExerciseBase {
	id: number;
	title: string;
	type: string;
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
}

export interface FillBlank {
	hint: string;
	acceptedAnswers: string[];
	explanation: string;
}

export const FILL_BLANK_PLACEHOLDER = "{{blank}}";

export type ReadingQuestion =
	| {
			kind: "multiple-choice";
			prompt: string;
			options: MultipleChoiceOption[];
			canonicalExplanation: string;
	  }
	| ({
			kind: "true-false";
			prompt: string;
			statement: string;
			canonicalExplanation: string;
	  } & TrueFalseAnswer);

export type Exercise =
	| (ExerciseBase & {
			kind: "reading";
			text: string;
			questions: ReadingQuestion[];
			canonicalExplanation: string;
	  })
	| (ExerciseBase & {
			kind: "multiple-choice";
			prompt: string;
			options: MultipleChoiceOption[];
			canonicalExplanation: string;
	  })
	| (ExerciseBase & {
			kind: "true-false";
			statement: string;
			canonicalExplanation: string;
	  } & TrueFalseAnswer)
	| (ExerciseBase & {
			kind: "fill-blank";
			sentence: string;
			blanks: FillBlank[];
			canonicalExplanation: string;
	  })
	| (ExerciseBase & {
			kind: "matching";
			leftLabel: string;
			rightLabel: string;
			pairs: MatchingPair[];
			canonicalExplanation: string;
	  });

export type SkillFocus = "grammar" | "vocabulary" | "reading" | "mixed";
export type AgeGroup = "children" | "teenagers" | "adults";
export type DifficultyDistribution = "progressive" | "uniform";

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
	language: string;
	title: string;
	tags: string[];
	intro: string;
	objectives: string[];
	exercises: Exercise[];
	suggestions: string[];
	reasoning: WorkbookReasoning;
}

export const MOCK_WORKBOOK: Workbook = {
	topic: "Past simple",
	language: "A2 English",
	title: "My Weekend",
	tags: ["A2 · Elementary", "8 exercises", "≈ 30 minutes", "Ages 13–17"],
	intro: "Let's practise talking about the past.",
	objectives: [
		"form affirmative and negative past simple sentences",
		"use common irregular verbs (went, had, saw, did)",
		"ask and answer Yes/No questions about the past",
	],
	exercises: [
		{
			id: 1,
			title: "Mia's Weekend",
			type: "Reading",
			instructions:
				"Read the short text about Mia's weekend, then answer the questions.",
			kind: "reading",
			text: "Last Saturday, Mia went to the cinema with her brother. They watched a funny film about a family who moved to the countryside. After the film, they ate pizza at a small restaurant near the cinema. On Sunday morning, Mia didn't go out. She stayed at home and read a book. In the afternoon, her grandmother visited and they made a cake together.",
			questions: [
				{
					kind: "multiple-choice",
					prompt: "Where did Mia go on Saturday?",
					options: [
						{
							text: "to the park",
							isCorrect: false,
							explanationIfChosen:
								"Not quite — the park isn't mentioned in the text. Re-read the first sentence.",
						},
						{
							text: "to the cinema",
							isCorrect: true,
							explanationIfChosen:
								"Correct! The text says 'Mia went to the cinema with her brother.'",
						},
						{
							text: "to a restaurant",
							isCorrect: false,
							explanationIfChosen:
								"She did eat pizza at a restaurant, but that was *after* the film — not where she went first.",
						},
						{
							text: "to her grandmother's house",
							isCorrect: false,
							explanationIfChosen:
								"Her grandmother visited *her* on Sunday afternoon; Mia didn't go to grandma's house.",
						},
					],
					canonicalExplanation:
						"Find the Saturday time marker and the action that immediately follows it — the cinema is named in the first sentence.",
				},
				{
					kind: "true-false",
					prompt: "True or false?",
					statement: "Mia went out on Sunday morning.",
					correctAnswer: false,
					correction: "Mia didn't go out on Sunday morning.",
					explanationIfTrueChosen:
						"Re-read the text: 'On Sunday morning, Mia didn't go out.' She stayed at home.",
					explanationIfFalseChosen:
						"Correct! The text says 'Mia didn't go out' on Sunday morning — she stayed home and read a book.",
					canonicalExplanation:
						"Watch for negation: 'didn't go out' reverses 'went out'. A single 'not' flips the truth of the whole statement.",
				},
				{
					kind: "multiple-choice",
					prompt: "What did Mia and her grandmother do together?",
					options: [
						{
							text: "watched a film",
							isCorrect: false,
							explanationIfChosen:
								"Mia watched the film with her brother on Saturday, not with her grandmother.",
						},
						{
							text: "ate pizza",
							isCorrect: false,
							explanationIfChosen:
								"The pizza was eaten with her brother after the film — grandma wasn't there.",
						},
						{
							text: "baked a cake",
							isCorrect: true,
							explanationIfChosen:
								"Correct! The text says 'her grandmother visited and they made a cake together.'",
						},
						{
							text: "read a book",
							isCorrect: false,
							explanationIfChosen:
								"Mia read the book alone on Sunday morning, before her grandmother arrived.",
						},
					],
					canonicalExplanation:
						"Filter for actions where *both* Mia and her grandmother are the actors — only the cake-making fits.",
				},
			],
			canonicalExplanation:
				"This reading checks comprehension of a past-tense narrative. Track time markers ('Last Saturday', 'On Sunday morning', 'In the afternoon') and who does each action.",
		},
		{
			id: 2,
			title: "Multiple choice",
			type: "Multiple choice",
			kind: "multiple-choice",
			prompt: "Last night I ___ a great film with my family.",
			options: [
				{
					text: "watch",
					isCorrect: false,
					explanationIfChosen:
						"'watch' is the base form — you'd use it with 'I watch films every weekend'. Here 'last night' signals the past.",
				},
				{
					text: "watched",
					isCorrect: true,
					explanationIfChosen:
						"Correct! 'Watch' is a regular verb, so the past simple is 'watched'. 'Last night' is the time marker.",
				},
				{
					text: "watching",
					isCorrect: false,
					explanationIfChosen:
						"'watching' is the -ing form, used with 'be' (I was watching). On its own it can't express past simple.",
				},
			],
			canonicalExplanation:
				"Past simple of a regular verb: base + -ed. 'Last night' is a time marker that fixes the action in the past.",
		},
		{
			id: 3,
			title: "True or false",
			type: "True or false",
			kind: "true-false",
			statement: "I goed to the beach last weekend.",
			correctAnswer: false,
			correction: "I went to the beach last weekend.",
			explanationIfTrueChosen:
				"'goed' isn't a real English form. 'Go' is irregular — the past simple is 'went'.",
			explanationIfFalseChosen:
				"Correct! 'Go' is irregular, so the past simple is 'went', not 'goed'.",
			canonicalExplanation:
				"'Go' is one of the most common irregular verbs. Its past simple is 'went' — the -ed rule does not apply.",
		},
		{
			id: 4,
			title: "Fill in the blank",
			type: "Fill in the blank",
			instructions:
				"Complete each blank with the past simple of the verb in parentheses.",
			kind: "fill-blank",
			sentence: "On Friday night, we {{blank}} a film and {{blank}} pizza.",
			blanks: [
				{
					hint: "watch",
					acceptedAnswers: ["watched"],
					explanation:
						"'Watch' is regular: past simple = watch + -ed → 'watched'.",
				},
				{
					hint: "eat",
					acceptedAnswers: ["ate"],
					explanation:
						"'Eat' is irregular: past simple is 'ate' (not 'eated').",
				},
			],
			canonicalExplanation:
				"Two past-simple verbs in one sentence: 'watch' is regular (+ -ed), 'eat' is irregular ('ate'). 'On Friday night' anchors both actions in the past.",
		},
		{
			id: 5,
			title: "Match the verb forms",
			type: "Matching",
			instructions:
				"Match each base verb on the left with its past simple form on the right.",
			kind: "matching",
			leftLabel: "Base form",
			rightLabel: "Past simple",
			pairs: [
				{ left: "go", right: "went" },
				{ left: "have", right: "had" },
				{ left: "do", right: "did" },
				{ left: "see", right: "saw" },
				{ left: "buy", right: "bought" },
				{ left: "take", right: "took" },
			],
			canonicalExplanation:
				"High-frequency irregular past forms to memorise: go/went, have/had, do/did, see/saw, buy/bought, take/took.",
		},
		{
			id: 6,
			title: "Choose the question",
			type: "Multiple choice",
			kind: "multiple-choice",
			prompt: "Which question is correctly formed in the Past Simple?",
			options: [
				{
					text: "Did you went to the park?",
					isCorrect: false,
					explanationIfChosen:
						"After 'did', the main verb stays in its base form. It should be 'Did you *go*…' — only one verb carries the past tense.",
				},
				{
					text: "Do you go to the park yesterday?",
					isCorrect: false,
					explanationIfChosen:
						"'Do' is present simple. With 'yesterday' you need the past auxiliary: 'Did you go…?'",
				},
				{
					text: "Did you go to the park?",
					isCorrect: true,
					explanationIfChosen:
						"Correct! Past simple questions use 'did' + subject + base verb.",
				},
				{
					text: "Went you to the park?",
					isCorrect: false,
					explanationIfChosen:
						"English doesn't invert the main verb to form questions — you need the auxiliary 'did': 'Did you go…?'",
				},
			],
			canonicalExplanation:
				"Past simple questions are formed with 'did' + subject + base verb. The auxiliary 'did' carries the tense; the main verb stays in its base form.",
		},
		{
			id: 7,
			title: "My last weekend",
			type: "Fill in the blank",
			kind: "fill-blank",
			sentence: "Last Saturday morning, I {{blank}} at ten o'clock.",
			blanks: [
				{
					hint: "wake up",
					acceptedAnswers: ["woke up"],
					explanation:
						"The past simple of 'wake up' is 'woke up'. 'Last Saturday morning' signals the past.",
				},
			],
			canonicalExplanation:
				"'Wake' is irregular: past simple 'woke'. In a phrasal verb like 'wake up', only the main verb changes — the particle stays.",
		},
		{
			id: 8,
			title: "Quick check",
			type: "True or false",
			kind: "true-false",
			statement: "The past simple of 'buy' is 'buyed'.",
			correctAnswer: false,
			correction: "The past simple of 'buy' is 'bought'.",
			explanationIfTrueChosen:
				"'buy' is irregular — there's no 'buyed' in English. The past simple is 'bought'.",
			explanationIfFalseChosen:
				"Correct! 'Buy' is irregular: the past simple is 'bought'.",
			canonicalExplanation:
				"'Buy' is irregular: past simple 'bought'. The regular -ed ending doesn't apply to every verb.",
		},
	],
	suggestions: [
		"english-a2-past-continuous",
		"english-a2-irregular-verbs-list",
		"english-a2-time-expressions",
		"english-a2-questions-and-answers",
	],
	reasoning: {
		detectedLanguage: "English",
		detectedLevel: "A2",
		chosenTopic: "Past simple",
		chosenSkillFocus: "grammar",
		chosenAgeGroup: "teenagers",
		chosenDurationMinutes: 30,
		chosenExerciseCounts: {
			reading: 1,
			"multiple-choice": 2,
			"true-false": 2,
			"fill-blank": 2,
			matching: 1,
		},
		chosenDifficultyDistribution: "progressive",
		notes:
			"Anchored in a weekend-narrative context to give the grammar real referents. Mix leans on the four highest-frequency irregular verbs (go, have, do, see) so the irregular/regular contrast is visible.",
	},
};
