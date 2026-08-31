import { useCallback, useEffect, useRef } from "react";

type DebouncedCallback<Args extends unknown[]> = ((...args: Args) => void) & {
	cancel: () => void;
};

export function useDebounce<Args extends unknown[], Return>(
	callback: (...args: Args) => Return,
	delay: number,
): DebouncedCallback<Args> {
	const timeoutRef = useRef<number | null>(null);
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	const cancel = useCallback(() => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	useEffect(() => cancel, [cancel]);

	const debouncedCallback = useCallback(
		(...args: Args) => {
			cancel();
			timeoutRef.current = window.setTimeout(() => {
				timeoutRef.current = null;
				callbackRef.current(...args);
			}, delay);
		},
		[cancel, delay],
	);

	return Object.assign(debouncedCallback, { cancel });
}
