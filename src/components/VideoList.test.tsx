import { faker } from "@faker-js/faker";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  const user = userEvent.setup();
  return {
    ...render(<VideoList pageCount={pageCount} videos={videos} />),
    user,
  };
}

const ui = {
  previousButton: byRole("button", { name: "Previous" }),
  emptyIndicator: byText(/No videos available/),
  nextButton: byRole("button", { name: "Next" }),
  pageCounter: byText(/Page \d of \d/),
  searchBar: byRole("textbox", { name: "Search videos" }),
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
  it("doesn't render page switch ui if there are no pages", () => {
    renderComponent({ pageCount: 0 });

    expect(ui.pageCounter.query()).not.toBeInTheDocument();
    expect(ui.previousButton.query()).not.toBeInTheDocument();
    expect(ui.nextButton.query()).not.toBeInTheDocument();
  });
  it("doesn't render page switch ui if there is only one page", () => {
    renderComponent({ pageCount: 1 });

    expect(ui.pageCounter.query()).not.toBeInTheDocument();
    expect(ui.previousButton.query()).not.toBeInTheDocument();
    expect(ui.nextButton.query()).not.toBeInTheDocument();
  });
  it("has buttons to switch pages", () => {
    renderComponent({ pageCount: 5 });

    expect(ui.pageCounter.get()).toBeVisible();
    expect(ui.previousButton.get()).toBeVisible();
    expect(ui.previousButton.get()).toBeDisabled();
    expect(ui.nextButton.get()).toBeVisible();
    expect(ui.nextButton.get()).not.toBeDisabled();
  });
  describe("user interaction", () => {
    it("allows video search", async () => {
      const query = "never gonna give you up";
      mockSearchParams.set("query", query);
      const { user } = renderComponent();

      expect(ui.searchBar.get()).toHaveValue(query);

      await user.clear(ui.searchBar.get());

      expect(ui.searchBar.get()).toHaveValue("");

      const otherQuery = "never gonna let you down";
      await user.type(ui.searchBar.get(), otherQuery);

      expect(ui.searchBar.get()).toHaveValue(otherQuery);
      expect(ui.searchBar.get()).not.toHaveValue(query);
    });
  });
});
