import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TrimBar } from "./TrimBar";

function renderComponent(trimStart = 20, trimEnd = 80) {
	const onTrimEndChange = vi.fn();
	const onTrimStartChange = vi.fn();
	const user = userEvent.setup();

	render(
		<TrimBar
			onTrimEndChange={onTrimEndChange}
			onTrimStartChange={onTrimStartChange}
			trimEnd={trimEnd}
			trimStart={trimStart}
		/>,
	);

	return { onTrimEndChange, onTrimStartChange, user };
}

describe("TrimBar", () => {
	it("changes the start trim position with keyboard slider controls", async () => {
		const { onTrimStartChange, user } = renderComponent();
		const startSlider = screen.getByRole("slider", {
			name: "Start trim position",
		});

		startSlider.focus();
		await user.keyboard("{ArrowRight}{End}{Home}");

		expect(onTrimStartChange).toHaveBeenNthCalledWith(1, 21);
		expect(onTrimStartChange).toHaveBeenNthCalledWith(2, 78);
		expect(onTrimStartChange).toHaveBeenNthCalledWith(3, 0);
	});

	it("changes the end trim position without crossing the start handle", async () => {
		const { onTrimEndChange, user } = renderComponent();
		const endSlider = screen.getByRole("slider", {
			name: "End trim position",
		});

		endSlider.focus();
		await user.keyboard("{ArrowLeft}{Home}{End}");

		expect(onTrimEndChange).toHaveBeenNthCalledWith(1, 79);
		expect(onTrimEndChange).toHaveBeenNthCalledWith(2, 22);
		expect(onTrimEndChange).toHaveBeenNthCalledWith(3, 100);
	});
});
