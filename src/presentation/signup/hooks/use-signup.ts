import { useState } from "react";

export function useSignup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [acceptTerms, setAcceptTerms] = useState(false);

	return {
		name,
		setName,
		email,
		setEmail,
		password,
		setPassword,
		acceptTerms,
		setAcceptTerms,
		canSubmit:
			name.trim().length > 0 &&
			email.trim().length > 0 &&
			password.length >= 8 &&
			acceptTerms,
		handleSubmit: (e: React.FormEvent) => e.preventDefault(),
	};
}
