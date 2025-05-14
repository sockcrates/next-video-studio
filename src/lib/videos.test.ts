import { describe, expect, it } from "vitest";
import { getVideos } from "./videos";

describe("getVideos", () => {
  it("returns a list of videos", async () => {
    const { videos } = await getVideos();

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
  it("calculates page count correctly", async () => {
    const { pageCount: a } = await getVideos({ pageSize: 10 });
    const { pageCount: b } = await getVideos({ pageSize: 15 });
    const { pageCount: c } = await getVideos({ pageSize: 0 });
    const { pageCount: d } = await getVideos({ pageSize: -1 });
    const { pageCount: e } = await getVideos({ pageSize: 1 });

    expect(a).toEqual(5);
    expect(b).toEqual(4);
    expect(c).toEqual(0);
    expect(d).toEqual(0);
    expect(e).toEqual(49);
  });
});
