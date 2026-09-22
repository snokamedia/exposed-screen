/** Small guarded-access helper so optional browser APIs can't crash the page. */
export function safeProbe<T>(fn: () => T, fallback: T): T {
	try {
		return fn();
	} catch {
		return fallback;
	}
}
