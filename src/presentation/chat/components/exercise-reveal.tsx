export interface Score {
	correct: number;
	total: number;
}

export type ReportScore = (exerciseId: number, score: Score) => void;

export function normalizeBlank(value: string): string {
	return value.trim().toLocaleLowerCase();
}
