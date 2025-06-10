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

  let pageCount = 0;
  let videos = [];
  try {
    const res = await getVideos({ page, query });
    pageCount = res.pageCount;
    videos = res.videos;
  } catch (_error) {
    return <div>Error loading videos</div>;
  }

  return (
    <Suspense fallback={<VideoListSkeleton />} key={page + query}>
      <VideoList pageCount={pageCount} videos={videos} />
    </Suspense>
  );
}
