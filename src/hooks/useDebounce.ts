import { useRef } from "react";

export function useDebounce<Args extends unknown[], Return>(
  callback: (...args: Args) => Return,
  delay: number,
) {
  const timeoutRef = useRef<number | null>(null);
  return (...args: Args) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
