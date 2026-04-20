export interface Session {
	userId: string;
	email: string;
	fullName: string | null;
	emailConfirmedAt: string | null;
}
