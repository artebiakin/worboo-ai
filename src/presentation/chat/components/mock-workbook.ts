import type { Workbook } from "#/domain/workbook";

export const MOCK_WORKBOOK: Workbook = {
	topic: "Past simple",
	targetLanguage: "English",
	level: "A2",
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
			instructions:
				"Read the short text about Mia's weekend, then answer the questions.",
			kind: "reading",
			text: "Last Saturday, Mia went to the cinema with her brother. They watched a funny film about a family who moved to the countryside. After the film, they ate pizza at a small restaurant near the cinema. On Sunday morning, Mia didn't go out. She stayed at home and read a book. In the afternoon, her grandmother visited and they made a cake together.",
			questions: [
				{
					kind: "multipleChoice",
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
					kind: "trueFalse",
					statement: "Mia went out on Sunday morning.",
					correctAnswer: false,
					correction: "Mia didn't go out on Sunday morning.",
					explanationIfTrueChosen:
						"Re-read the text: 'On Sunday morning, Mia didn't go out.' She stayed at home.",
					explanationIfFalseChosen:
						"Correct! The text says 'Mia didn't go out' on Sunday morning — she stayed home and read a book.",
				},
				{
					kind: "multipleChoice",
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
			id: 2,
			kind: "multipleChoice",
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
			id: 3,
			kind: "trueFalse",
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
			instructions:
				"Complete each blank with the past simple of the verb in parentheses.",
			kind: "fillBlank",
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
		},
		{
			id: 5,
			instructions:
				"Match each base verb on the left with its past simple form on the right.",
			kind: "matching",
			leftLabel: "Base form",
			rightLabel: "Past simple",
			pairs: [
				{
					left: "go",
					right: "went",
					explanation: "'Go' is irregular; its past simple is 'went' — no -ed.",
				},
				{
					left: "have",
					right: "had",
					explanation:
						"'Have' is irregular; the past simple is 'had' (also used with any subject — no 'haved').",
				},
				{
					left: "do",
					right: "did",
					explanation:
						"'Do' is irregular; 'did' is both the past simple and the auxiliary for questions and negatives.",
				},
				{
					left: "see",
					right: "saw",
					explanation:
						"'See' is irregular; the past simple is 'saw'. Don't confuse it with the past participle 'seen'.",
				},
				{
					left: "buy",
					right: "bought",
					explanation:
						"'Buy' is irregular; the past simple is 'bought' (same form as the past participle).",
				},
				{
					left: "take",
					right: "took",
					explanation:
						"'Take' is irregular; 'took' is the past simple ('taken' is the past participle).",
				},
			],
		},
		{
			id: 6,
			kind: "multipleChoice",
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
			id: 7,
			kind: "fillBlank",
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
			statement: "The past simple of 'buy' is 'buyed'.",
			correctAnswer: false,
			correction: "The past simple of 'buy' is 'bought'.",
			explanationIfTrueChosen:
				"'buy' is irregular — there's no 'buyed' in English. The past simple is 'bought'.",
			explanationIfFalseChosen:
				"Correct! 'Buy' is irregular: the past simple is 'bought'.",
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
			multipleChoice: 2,
			trueFalse: 2,
			fillBlank: 2,
			matching: 1,
		},
		chosenDifficultyDistribution: "progressive",
		notes:
			"Anchored in a weekend-narrative context to give the grammar real referents. Mix leans on the four highest-frequency irregular verbs (go, have, do, see) so the irregular/regular contrast is visible.",
	},
};
