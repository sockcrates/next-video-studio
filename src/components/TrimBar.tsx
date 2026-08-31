"use client";

import { memo, useCallback, useRef } from "react";

interface TrimBarProps {
	onTrimEndChange: (value: number) => void;
	onTrimStartChange: (value: number) => void;
	trimEnd: number;
	trimStart: number;
}

export const TrimBar = memo(
	({
		onTrimEndChange,
		onTrimStartChange,
		trimEnd,
		trimStart,
	}: TrimBarProps) => {
		const trimBarRef = useRef<HTMLDivElement>(null);
		const dragStateRef = useRef<{
			isDraggingEnd: boolean;
			isDraggingStart: boolean;
			pointerId: number | null;
		}>({
			isDraggingEnd: false,
			isDraggingStart: false,
			pointerId: null,
		});

		const handlePointerMove = useCallback(
			(e: React.PointerEvent<HTMLDivElement>) => {
				const { isDraggingStart, isDraggingEnd, pointerId } =
					dragStateRef.current;
				if ((!isDraggingStart && !isDraggingEnd) || pointerId !== e.pointerId) {
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

		const stopDragging = useCallback(() => {
			dragStateRef.current = {
				isDraggingStart: false,
				isDraggingEnd: false,
				pointerId: null,
			};
		}, []);

		const handlePointerDown = useCallback(
			(e: React.PointerEvent<HTMLDivElement>, isStart: boolean) => {
				if (!e.isPrimary || e.button !== 0) {
					return;
				}

				e.preventDefault();
				dragStateRef.current = {
					isDraggingStart: isStart,
					isDraggingEnd: !isStart,
					pointerId: e.pointerId,
				};
				e.currentTarget.setPointerCapture(e.pointerId);
			},
			[],
		);

		const handlePointerUp = useCallback(
			(e: React.PointerEvent<HTMLDivElement>) => {
				if (dragStateRef.current.pointerId !== e.pointerId) {
					return;
				}

				if (e.currentTarget.hasPointerCapture(e.pointerId)) {
					e.currentTarget.releasePointerCapture(e.pointerId);
				}
				stopDragging();
			},
			[stopDragging],
		);

		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent<HTMLDivElement>, isStart: boolean) => {
				const minimum = isStart ? 0 : trimStart + 2;
				const maximum = isStart ? trimEnd - 2 : 100;
				const value = isStart ? trimStart : trimEnd;
				let nextValue: number | undefined;

				switch (e.key) {
					case "ArrowDown":
					case "ArrowLeft":
						nextValue = Math.max(minimum, value - 1);
						break;
					case "ArrowRight":
					case "ArrowUp":
						nextValue = Math.min(maximum, value + 1);
						break;
					case "Home":
						nextValue = minimum;
						break;
					case "End":
						nextValue = maximum;
						break;
					default:
						return;
				}

				e.preventDefault();
				if (isStart) {
					onTrimStartChange(nextValue);
				} else {
					onTrimEndChange(nextValue);
				}
			},
			[onTrimEndChange, onTrimStartChange, trimEnd, trimStart],
		);

		return (
			<div className="w-full min-w-48 min-h-10">
				<div ref={trimBarRef} className="relative h-10 mt-4">
					<div className="absolute w-full h-8 bg-gray-300 rounded-md">
						<div
							className="absolute h-full bg-gray-500 rounded-md"
							style={{
								left: `${trimStart}%`,
								width: `${trimEnd - trimStart}%`,
							}}
						>
							<div
								aria-label="Start trim position"
								aria-valuemin={0}
								aria-valuemax={trimEnd - 2}
								aria-valuenow={trimStart}
								className="absolute left-0 top-0 w-2 h-full bg-orange-500 rounded-l-md cursor-ew-resize touch-none"
								onKeyDown={(e) => handleKeyDown(e, true)}
								onLostPointerCapture={stopDragging}
								onPointerCancel={handlePointerUp}
								onPointerDown={(e) => handlePointerDown(e, true)}
								onPointerMove={handlePointerMove}
								onPointerUp={handlePointerUp}
								role="slider"
								tabIndex={0}
							/>
							<div
								aria-label="End trim position"
								aria-valuemin={trimStart + 2}
								aria-valuemax={100}
								aria-valuenow={trimEnd}
								className="absolute right-0 top-0 w-2 h-full bg-orange-500 rounded-r-md cursor-ew-resize touch-none"
								onKeyDown={(e) => handleKeyDown(e, false)}
								onLostPointerCapture={stopDragging}
								onPointerCancel={handlePointerUp}
								onPointerDown={(e) => handlePointerDown(e, false)}
								onPointerMove={handlePointerMove}
								onPointerUp={handlePointerUp}
								role="slider"
								tabIndex={0}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	},
);
