import { VideoList } from "@/components";
import { getVideos } from "@/lib";

export default async function VideoListPage(props: {
  searchParams: Promise<
    Partial<{
      page: string;
      query: string;
    }>
  >;
}) {
  const searchParams = await props.searchParams;
  const page = Number.parseInt(searchParams?.page ?? "1");
  const query = searchParams?.query ?? "";

  const { pageCount, videos } = await getVideos({ page, query });

  return <VideoList pageCount={pageCount} videos={videos} />;
}
