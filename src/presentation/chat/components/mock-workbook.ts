interface ExerciseBase {
	number: string;
	title: string;
	type: string;
	instructions?: string;
}

export type ReadingQuestion =
	| { kind: "multiple-choice"; prompt: string; options: string[] }
	| { kind: "true-false"; prompt: string; statement: string };

export type Exercise =
	| (ExerciseBase & {
			kind: "reading";
			text: string;
			questions: ReadingQuestion[];
	  })
	| (ExerciseBase & {
			kind: "multiple-choice";
			prompt: string;
			options: string[];
	  })
	| (ExerciseBase & {
			kind: "true-false";
			statement: string;
	  })
	| (ExerciseBase & {
			kind: "fill-blank";
			prefix: string;
			hint: string;
			suffix: string;
	  })
	| (ExerciseBase & {
			kind: "matching";
			leftLabel: string;
			rightLabel: string;
			items: string[];
			options: string[];
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
						"to the park",
						"to the cinema",
						"to a restaurant",
						"to her grandmother's house",
					],
				},
				{
					kind: "true-false",
					prompt: "True or false?",
					statement: "Mia went out on Sunday morning.",
				},
				{
					kind: "multiple-choice",
					prompt: "What did Mia and her grandmother do together?",
					options: [
						"watched a film",
						"ate pizza",
						"baked a cake",
						"read a book",
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
			options: ["watch", "watched", "watching"],
		},
		{
			number: "03",
			title: "True or false",
			type: "True or false",
			kind: "true-false",
			statement: "I goed to the beach last weekend.",
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
			items: ["go", "have", "do", "see", "buy", "take"],
			options: ["went", "had", "did", "saw", "bought", "took"],
		},
		{
			number: "06",
			title: "Choose the question",
			type: "Multiple choice",
			kind: "multiple-choice",
			prompt: "Which question is correctly formed in the Past Simple?",
			options: [
				"Did you went to the park?",
				"Do you go to the park yesterday?",
				"Did you go to the park?",
				"Went you to the park?",
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
		},
		{
			number: "08",
			title: "Quick check",
			type: "True or false",
			kind: "true-false",
			statement: "The past simple of 'buy' is 'buyed'.",
		},
	],
};
