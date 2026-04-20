const isDev = import.meta.env.DEV;

type Context = Record<string, unknown>;

function fmt(scope: string, level: string, message: string) {
	return `[${scope}:${level}] ${message}`;
}

function make(scope: string) {
	return {
		debug(message: string, context?: Context) {
			if (!isDev) return;
			console.debug(fmt(scope, "debug", message), context ?? "");
		},
		info(message: string, context?: Context) {
			if (!isDev) return;
			console.info(fmt(scope, "info", message), context ?? "");
		},
		warn(message: string, context?: Context) {
			console.warn(fmt(scope, "warn", message), context ?? "");
		},
		error(message: string, err?: unknown, context?: Context) {
			console.error(fmt(scope, "error", message), err, context ?? "");
			// TODO: forward to PostHog `captureException` once we wire error capture.
		},
		scope(childScope: string) {
			return make(`${scope}:${childScope}`);
		},
	};
}

export const logger = make("worboo");

export type Logger = ReturnType<typeof make>;
