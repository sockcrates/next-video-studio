import data from "./data.json" assert { type: "json" };

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

export async function getVideos() {
  const videos = data.items.filter((item) => item.id.kind === "youtube#video");
  return videos as Video[];
}
