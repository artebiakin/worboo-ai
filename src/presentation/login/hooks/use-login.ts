import { useState } from "react";

export function useLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(true);

	return {
		email,
		setEmail,
		password,
		setPassword,
		remember,
		setRemember,
		canSubmit: email.trim().length > 0 && password.length > 0,
		handleSubmit: (e: React.FormEvent) => e.preventDefault(),
	};
}
