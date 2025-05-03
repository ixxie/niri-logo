export function debounce<T extends Function>(callback: T, timeout = 500) {
	let timeoutId: number;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			callback(...args);
		}, timeout);
	};
}
