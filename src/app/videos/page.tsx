import { VideoList } from "@/components";
import { VideoListSkeleton } from "@/components/VideoListSkeleton";
import { getVideos } from "@/lib";
import { Suspense } from "react";

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

  return (
    <Suspense fallback={<VideoListSkeleton />} key={page + query}>
      <VideoList pageCount={pageCount} videos={videos} />
    </Suspense>
  );
}
