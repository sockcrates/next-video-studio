import { VideoList } from "@/components";
import { VideoListSkeleton } from "@/components/VideoListSkeleton";
import { VideoTrimmer } from "@/components/VideoTrimmer";
import { getVideoById, getVideos } from "@/lib";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function VideoTrimmerPage(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<
    Partial<{
      page: string;
      query: string;
    }>
  >;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const video = await getVideoById(params.slug);
  if (!video) {
    redirect("/videos");
  }

  const page = Number.parseInt(searchParams?.page ?? "1");
  const query = searchParams?.query ?? "";

  const { pageCount, videos } = await getVideos({ page, query });

  return (
    <div className="grid grid-cols-1 md:grid-cols-[40%_60%] h-full w-full">
      <div className="ml-auto w-full md:max-w-150 order-2 md:order-1">
        <Suspense fallback={<VideoListSkeleton />} key={page + query}>
          <VideoList
            pageCount={pageCount}
            selectedVideoId={params.slug}
            videos={videos}
          />
        </Suspense>
      </div>
      <main className="p-8 max-h-150 w-full order-1 md:order-2">
        <VideoTrimmer video={video} />
      </main>
    </div>
  );
}
