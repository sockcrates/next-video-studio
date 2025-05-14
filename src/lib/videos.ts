import data from "./data.json" assert { type: "json" };

const DEFAULT_PAGE_SIZE = 10;

export interface Video {
  id: {
    kind: "youtube#video";
    videoId: string;
  };
  snippet: {
    description: string;
    title: string;
  };
}

export async function getVideos({
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
}: Partial<{
  page: number;
  pageSize: number;
}> = {}): Promise<{
  pageCount: number;
  videos: Video[];
}> {
  const videos = data.items.filter((item) => item.id.kind === "youtube#video");
  const pageCount = pageSize > 0 ? Math.ceil(videos.length / pageSize) : 0;
  const paginatedVideos = videos.slice((page - 1) * pageSize, page * pageSize);
  return Promise.resolve({
    pageCount,
    videos: paginatedVideos as Video[],
  });
}
