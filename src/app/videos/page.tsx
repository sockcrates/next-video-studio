import { VideoList } from "@/components";
import { getVideos } from "@/lib";

export default async function VideoListPage(props: {
  searchParams: Promise<
    Partial<{
      page: string;
    }>
  >;
}) {
  const searchParams = await props.searchParams;
  const page = Number.parseInt(searchParams?.page ?? "1");
  const { pageCount, videos } = await getVideos({ page });
  return <VideoList pageCount={pageCount} videos={videos} />;
}
