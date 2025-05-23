import { describe, expect, it } from "vitest";
import { getVideoById, getVideos } from "./videos";

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
  it("returns pages based on number", async () => {
    const pageSize = 5;
    const { videos: a } = await getVideos({ page: 1, pageSize });
    const { videos: b } = await getVideos({ page: 2, pageSize });

    for (const element of a) {
      expect(b).not.toContain(element);
    }

    const { videos: c } = await getVideos({ page: 1, pageSize });

    for (const element of c) {
      expect(a).toContain(element);
    }
  });
  it("queries by video name", async () => {
    const { videos: a } = await getVideos({ query: "Bali" });

    expect(a).toHaveLength(1);

    const { videos: b } = await getVideos({ query: "wave" });

    expect(b).toHaveLength(10);

    const { videos: c } = await getVideos({
      query: "this video doesn't exist",
    });

    expect(c).toHaveLength(0);

    const { videos: d } = await getVideos({
      query: "",
    });

    expect(d).toHaveLength(10);
  });
});

describe("getVideoById", () => {
  it("returns a video if it exists", async () => {
    const result = await getVideoById("1QKtt6CTf_I");

    expect(result).toMatchObject({
      id: {
        videoId: expect.any(String),
      },
    });
  });
  it("returns null if no video with such id exists", async () => {
    const result = await getVideoById("there's no video with this id");

    expect(result).toBeNull();
  });
});
