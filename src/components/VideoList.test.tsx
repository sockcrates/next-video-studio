import { faker } from "@faker-js/faker";
import { render } from "@testing-library/react";
import React from "react";
import { byRole } from "testing-library-selector";
import { describe, expect, it } from "vitest";
import { VideoList, type VideoListProps } from "./VideoList";

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
  const videos = opts.videos ?? Array.from({ length: 3 }, getMockVideo);
  return render(<VideoList videos={videos} />);
}

const ui = {
  videoList: byRole("complementary", { name: "Videos" }),
};

describe("VideoList", () => {
  it("renders with a list of videos", () => {
    renderComponent();

    expect(ui.videoList.get()).toBeVisible();
  });
});
