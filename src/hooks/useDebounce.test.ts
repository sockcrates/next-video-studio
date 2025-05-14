import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebounce", () => {
  it("debounces the callback", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current("first");
      result.current("second");
      result.current("third");
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("third");
  });
  it("calls the callback only once after rapid calls", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));

    act(() => {
      result.current("a");
      vi.advanceTimersByTime(30);
      result.current("b");
      vi.advanceTimersByTime(30);
      result.current("c");
    });

    // Wait full 100ms *after* last call
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("c");
  });
  it("maintains separate timers across multiple hook instances", () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();

    const { result: debounced1 } = renderHook(() => useDebounce(cb1, 50));
    const { result: debounced2 } = renderHook(() => useDebounce(cb2, 50));

    act(() => {
      debounced1.current("x");
      debounced2.current("y");
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb1).toHaveBeenCalledWith("x");
    expect(cb2).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledWith("y");
  });
});
