import { faker } from "@faker-js/faker";
import { render } from "@testing-library/react";
import React from "react";
import { byRole, byText } from "testing-library-selector";
import { describe, expect, it, vi } from "vitest";
import { VideoList, type VideoListProps } from "./VideoList";

const mockSearchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => mockSearchParams,
}));

function getMockVideo() {
  return {
    id: { kind: "youtube#video" as const, videoId: faker.string.uuid() },
    snippet: {
      description: faker.lorem.paragraph(),
      title: faker.lorem.sentence(),
    },
  };
}

function renderComponent(opts: Partial<VideoListProps> = {}) {
  const pageCount = opts.pageCount ?? 1;
  const videos = opts.videos ?? Array.from({ length: 3 }, getMockVideo);
  return render(<VideoList pageCount={pageCount} videos={videos} />);
}

const ui = {
  previousButton: byRole("button", { name: "Previous" }),
  emptyIndicator: byText(/No videos available/),
  nextButton: byRole("button", { name: "Next" }),
  pageCounter: byText(/Page \d of \d/),
  videoList: byRole("complementary", { name: "Videos" }),
};

describe("VideoList", () => {
  it("renders with a list of videos", () => {
    renderComponent();

    expect(ui.videoList.get()).toBeVisible();
    expect(ui.emptyIndicator.query()).not.toBeInTheDocument();
  });
  it("renders an empty state", () => {
    renderComponent({ videos: [] });

    expect(ui.emptyIndicator.get()).toBeVisible();
  });
  it("has buttons to switch pages", () => {
    renderComponent({ pageCount: 5 });

    expect(ui.pageCounter.get()).toBeVisible();
    expect(ui.previousButton.get()).toBeVisible();
    expect(ui.previousButton.get()).toBeDisabled();
    expect(ui.nextButton.get()).toBeVisible();
    expect(ui.nextButton.get()).not.toBeDisabled();
  });
});
