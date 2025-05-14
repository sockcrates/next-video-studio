import { describe, expect, it } from "vitest";
import { getVideos } from "./videos";

describe("getVideos", () => {
  it("returns a list of videos", async () => {
    const videos = await getVideos();

    expect(videos).toContainEqual(
      expect.objectContaining({
        id: expect.objectContaining({
          kind: "youtube#video",
          videoId: expect.any(String),
        }),
        snippet: expect.objectContaining({
          description: expect.any(String),
          title: expect.any(String),
        }),
      }),
    );
  });
});
