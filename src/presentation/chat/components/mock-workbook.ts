interface ExerciseBase {
	number: string;
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
			explanationIfTrue: string;
			explanationIfFalse: string;
	  }
	| {
			correctAnswer: false;
			correction: string;
			explanationIfTrue: string;
			explanationIfFalse: string;
	  };

export interface MatchingPair {
	left: string;
	right: string;
}

export type ReadingQuestion =
	| {
			kind: "multiple-choice";
			prompt: string;
			options: MultipleChoiceOption[];
	  }
	| ({
			kind: "true-false";
			prompt: string;
			statement: string;
	  } & TrueFalseAnswer);

export type Exercise =
	| (ExerciseBase & {
			kind: "reading";
			text: string;
			questions: ReadingQuestion[];
	  })
	| (ExerciseBase & {
			kind: "multiple-choice";
			prompt: string;
			options: MultipleChoiceOption[];
	  })
	| (ExerciseBase & {
			kind: "true-false";
			statement: string;
	  } & TrueFalseAnswer)
	| (ExerciseBase & {
			kind: "fill-blank";
			prefix: string;
			hint: string;
			suffix: string;
			acceptedAnswers: string[];
			explanation: string;
	  })
	| (ExerciseBase & {
			kind: "matching";
			leftLabel: string;
			rightLabel: string;
			pairs: MatchingPair[];
	  });

export interface Workbook {
	topic: string;
	language: string;
	title: string;
	tags: string[];
	intro: string;
	objectives: string[];
	exercises: Exercise[];
}

export const MOCK_WORKBOOK: Workbook = {
	topic: "Past simple",
	language: "A2 English",
	title: "My Weekend",
	tags: ["A2 · Elementary", "8 exercises", "≈ 30 minutes", "Ages 13–17"],
	intro:
		"In this lesson, students practise the past simple through the context of weekend activities. They review regular and irregular verbs, form affirmative and negative sentences, and ask simple questions about the past.",
	objectives: [
		"Form affirmative and negative past simple sentences",
		"Use common irregular verbs (went, had, saw, did)",
		"Ask and answer Yes/No questions about the past",
	],
	exercises: [
		{
			number: "01",
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
				},
				{
					kind: "true-false",
					prompt: "True or false?",
					statement: "Mia went out on Sunday morning.",
					correctAnswer: false,
					correction: "Mia didn't go out on Sunday morning.",
					explanationIfTrue:
						"Re-read the text: 'On Sunday morning, Mia didn't go out.' She stayed at home.",
					explanationIfFalse:
						"Correct! The text says 'Mia didn't go out' on Sunday morning — she stayed home and read a book.",
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
				},
			],
		},
		{
			number: "02",
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
		},
		{
			number: "03",
			title: "True or false",
			type: "True or false",
			kind: "true-false",
			statement: "I goed to the beach last weekend.",
			correctAnswer: false,
			correction: "I went to the beach last weekend.",
			explanationIfTrue:
				"'goed' isn't a real English form. 'Go' is irregular — the past simple is 'went'.",
			explanationIfFalse:
				"Correct! 'Go' is irregular, so the past simple is 'went', not 'goed'.",
		},
		{
			number: "04",
			title: "Fill in the blank",
			type: "Fill in the blank",
			instructions:
				"Complete the sentence with the past simple of the verb in parentheses.",
			kind: "fill-blank",
			prefix: "On Friday evening, we",
			hint: "eat",
			suffix: "pizza at home.",
			acceptedAnswers: ["ate"],
			explanation:
				"'Eat' is irregular — the past simple is 'ate'. The time marker 'On Friday evening' signals the past.",
		},
		{
			number: "05",
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
		},
		{
			number: "06",
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
		},
		{
			number: "07",
			title: "My last weekend",
			type: "Fill in the blank",
			kind: "fill-blank",
			prefix: "Last Saturday morning, I",
			hint: "wake up",
			suffix: "at ten o'clock.",
			acceptedAnswers: ["woke up"],
			explanation:
				"'Wake' is irregular: the past simple is 'woke', so 'wake up' becomes 'woke up'.",
		},
		{
			number: "08",
			title: "Quick check",
			type: "True or false",
			kind: "true-false",
			statement: "The past simple of 'buy' is 'buyed'.",
			correctAnswer: false,
			correction: "The past simple of 'buy' is 'bought'.",
			explanationIfTrue:
				"'buy' is irregular — there's no 'buyed' in English. The past simple is 'bought'.",
			explanationIfFalse:
				"Correct! 'Buy' is irregular: the past simple is 'bought'.",
		},
	],
};
