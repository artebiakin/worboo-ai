import { useState } from "react";

export function useForgotPassword() {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	return {
		email,
		setEmail,
		isSubmitted,
		canSubmit: email.trim().length > 0,
		handleSubmit: (e: React.FormEvent) => {
			e.preventDefault();
			setIsSubmitted(true);
		},
	};
}
