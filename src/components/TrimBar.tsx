"use client";

import { useCallback, useRef } from "react";

interface TrimBarProps {
  onTrimEndChange: (value: number) => void;
  onTrimStartChange: (value: number) => void;
  trimEnd: number;
  trimStart: number;
}

export function TrimBar({
  onTrimEndChange,
  onTrimStartChange,
  trimEnd,
  trimStart,
}: TrimBarProps) {
  const trimBarRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    isDraggingEnd: boolean;
    isDraggingStart: boolean;
  }>({
    isDraggingEnd: false,
    isDraggingStart: false,
  });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const { isDraggingStart, isDraggingEnd } = dragStateRef.current;
      if (!isDraggingStart && !isDraggingEnd) {
        return;
      }

      const trimBar = trimBarRef.current;
      if (!trimBar) {
        return;
      }

      const rect = trimBar.getBoundingClientRect();
      const position = ((e.clientX - rect.left) / rect.width) * 100;

      if (isDraggingStart) {
        const newStart = Math.max(0, Math.min(position, trimEnd - 2));
        onTrimStartChange(newStart);
      } else if (isDraggingEnd) {
        const newEnd = Math.min(100, Math.max(position, trimStart + 2));
        onTrimEndChange(newEnd);
      }
    },
    [onTrimEndChange, onTrimStartChange, trimEnd, trimStart],
  );

  const handleMouseUp = useCallback(() => {
    dragStateRef.current = {
      isDraggingStart: false,
      isDraggingEnd: false,
    };
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, isStart: boolean) => {
      e.preventDefault();
      dragStateRef.current = {
        isDraggingStart: isStart,
        isDraggingEnd: !isStart,
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove, handleMouseUp],
  );

  return (
    <div className="w-full min-w-48 min-h-10">
      <div ref={trimBarRef} className="relative h-10 mt-4">
        <div aria-hidden className="absolute w-full h-8 bg-gray-300 rounded-md">
          <div
            aria-hidden
            className="absolute h-full bg-gray-500 rounded-md"
            style={{
              left: `${trimStart}%`,
              width: `${trimEnd - trimStart}%`,
            }}
          >
            <div
              aria-label="Start trim position"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={trimStart}
              className="absolute left-0 top-0 w-2 h-full bg-orange-500 rounded-l-md cursor-ew-resize"
              onMouseDown={(e) => handleMouseDown(e, true)}
              role="slider"
              tabIndex={0}
            />
            <div
              aria-label="End trim position"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={trimEnd}
              className="absolute right-0 top-0 w-2 h-full bg-orange-500 rounded-r-md cursor-ew-resize"
              onMouseDown={(e) => handleMouseDown(e, false)}
              role="slider"
              tabIndex={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
