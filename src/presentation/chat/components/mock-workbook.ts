import type { Workbook } from "#/domain/workbook";

export const MOCK_WORKBOOK: Workbook = {
	title: "My Weekend",
	eyebrow: "Past Simple · A2 English",
	intro: "Let's practise talking about the past.",
	objectives: [
		"form affirmative and negative past simple sentences",
		"use common irregular verbs like went, had, saw, and did",
		"ask and answer Yes/No questions about the past",
	],
	meta: {
		targetLanguage: "English",
		nativeLanguage: "Ukrainian",
		level: "A2",
		levelLabel: "Elementary",
		skillFocus: "grammar",
		topic: "Weekend Activities",
		ageGroup: "teenagers",
		ageLabel: "Ages 13–17",
		durationMinutes: 30,
		exerciseCount: 8,
	},
	exercises: [
		{
			id: 1,
			title: "Mia's Weekend",
			kind: "reading",
			prompt:
				"Read the short text about Mia's weekend, then answer the questions.",
			passage: {
				title: "Mia's Weekend",
				text: "Last Saturday, Mia went to the cinema with her brother. They watched a funny film about a family who moved to the countryside. After the film, they ate pizza at a small restaurant near the cinema. On Sunday morning, Mia didn't go out. She stayed at home and read a book. In the afternoon, her grandmother visited and they made a cake together.",
			},
			questions: [
				{
					id: "1a",
					kind: "multipleChoice",
					prompt: "Where did Mia go on Saturday?",
					options: [
						{
							label: "A",
							text: "to the park",
							isCorrect: false,
							explanationIfChosen:
								"Not quite — the park isn't mentioned in the text. Re-read the first sentence.",
						},
						{
							label: "B",
							text: "to the cinema",
							isCorrect: true,
							explanationIfChosen:
								"Correct! The text says 'Mia went to the cinema with her brother.'",
						},
						{
							label: "C",
							text: "to a restaurant",
							isCorrect: false,
							explanationIfChosen:
								"She did eat pizza at a restaurant, but that was after the film — not where she went first.",
						},
						{
							label: "D",
							text: "to her grandmother's house",
							isCorrect: false,
							explanationIfChosen:
								"Her grandmother visited her on Sunday afternoon; Mia didn't go to grandma's house.",
						},
					],
				},
				{
					id: "1b",
					kind: "trueFalse",
					prompt: "True or false?",
					statement: "Mia went out on Sunday morning.",
					correctAnswer: false,
					correction: "Mia didn't go out on Sunday morning.",
					explanationIfTrueChosen:
						"Re-read the text: 'On Sunday morning, Mia didn't go out.' She stayed at home.",
					explanationIfFalseChosen:
						"Correct! The text says 'Mia didn't go out' on Sunday morning — she stayed home and read a book.",
				},
				{
					id: "1c",
					kind: "multipleChoice",
					prompt: "What did Mia and her grandmother do together?",
					options: [
						{
							label: "A",
							text: "watched a film",
							isCorrect: false,
							explanationIfChosen:
								"Mia watched the film with her brother on Saturday, not with her grandmother.",
						},
						{
							label: "B",
							text: "ate pizza",
							isCorrect: false,
							explanationIfChosen:
								"The pizza was eaten with her brother after the film — grandma wasn't there.",
						},
						{
							label: "C",
							text: "baked a cake",
							isCorrect: true,
							explanationIfChosen:
								"Correct! The text says 'her grandmother visited and they made a cake together.'",
						},
						{
							label: "D",
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
			id: 2,
			kind: "multipleChoice",
			prompt: "Last night I _____ a great film with my family.",
			options: [
				{
					label: "A",
					text: "watch",
					isCorrect: false,
					explanationIfChosen:
						"'watch' is the base form — you'd use it with 'I watch films every weekend'. Here 'last night' signals the past.",
				},
				{
					label: "B",
					text: "watched",
					isCorrect: true,
					explanationIfChosen:
						"Correct! 'Watch' is a regular verb, so the past simple is 'watched'. 'Last night' is the time marker.",
				},
				{
					label: "C",
					text: "watching",
					isCorrect: false,
					explanationIfChosen:
						"'watching' is the -ing form, used with 'be' (I was watching). On its own it can't express past simple.",
				},
			],
		},
		{
			id: 3,
			kind: "trueFalse",
			prompt: "True or false?",
			statement: "I goed to the beach last weekend.",
			correctAnswer: false,
			correction: "I went to the beach last weekend.",
			explanationIfTrueChosen:
				"'goed' isn't a real English form. 'Go' is irregular — the past simple is 'went'.",
			explanationIfFalseChosen:
				"Correct! 'Go' is irregular, so the past simple is 'went', not 'goed'.",
		},
		{
			id: 4,
			kind: "fillBlank",
			prompt:
				"Complete each blank with the past simple of the verb in brackets.",
			sentence: "On Friday night, we {{blank}} a film and {{blank}} pizza.",
			blanks: [
				{
					hint: "watch → watched",
					acceptedAnswers: ["watched"],
					explanation:
						"'Watch' is regular: past simple = watch + -ed → 'watched'.",
				},
				{
					hint: "eat → ate (irregular)",
					acceptedAnswers: ["ate"],
					explanation:
						"'Eat' is irregular: past simple is 'ate' (not 'eated').",
				},
			],
		},
		{
			id: 5,
			kind: "matching",
			prompt: "Match each base verb with its past simple form.",
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
			id: 6,
			kind: "multipleChoice",
			prompt: "Which question is correctly formed in the Past Simple?",
			options: [
				{
					label: "A",
					text: "Did you went to the park?",
					isCorrect: false,
					explanationIfChosen:
						"After 'did', the main verb stays in its base form. It should be 'Did you go…' — only one verb carries the past tense.",
				},
				{
					label: "B",
					text: "Do you go to the park yesterday?",
					isCorrect: false,
					explanationIfChosen:
						"'Do' is present simple. With 'yesterday' you need the past auxiliary: 'Did you go…?'",
				},
				{
					label: "C",
					text: "Did you go to the park?",
					isCorrect: true,
					explanationIfChosen:
						"Correct! Past simple questions use 'did' + subject + base verb.",
				},
				{
					label: "D",
					text: "Went you to the park?",
					isCorrect: false,
					explanationIfChosen:
						"English doesn't invert the main verb to form questions — you need the auxiliary 'did': 'Did you go…?'",
				},
			],
		},
		{
			id: 7,
			kind: "fillBlank",
			prompt: "Complete the sentence with the past simple.",
			sentence: "Last Saturday morning, I {{blank}} at ten o'clock.",
			blanks: [
				{
					hint: "wake up",
					acceptedAnswers: ["woke up"],
					explanation:
						"The past simple of 'wake up' is 'woke up'. 'Last Saturday morning' signals the past.",
				},
			],
		},
		{
			id: 8,
			kind: "trueFalse",
			prompt: "True or false?",
			statement: "The past simple of 'buy' is 'buyed'.",
			correctAnswer: false,
			correction: "The past simple of 'buy' is 'bought'.",
			explanationIfTrueChosen:
				"'buy' is irregular — there's no 'buyed' in English. The past simple is 'bought'.",
			explanationIfFalseChosen:
				"Correct! 'Buy' is irregular: the past simple is 'bought'.",
		},
	],
};
