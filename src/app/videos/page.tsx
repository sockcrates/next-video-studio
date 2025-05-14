import { VideoList } from "@/components";
import { getVideos } from "@/lib";

export default async function VideoListPage() {
  const { videos } = await getVideos();
  return <VideoList videos={videos} />;
}
