import { VideoList } from "@/components";
import { VideoTrimmer } from "@/components/VideoTrimmer";
import { getVideoById, getVideos } from "@/lib";
import { redirect } from "next/navigation";

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
    <div className="grid grid-cols-1 md:grid-cols-[35%_60%] md:gap-x-4 lg:gap-x-8 h-full w-full">
      <div className="ml-auto p-6 w-full md:max-w-150 order-2 md:order-1">
        <VideoList
          pageCount={pageCount}
          selectedVideoId={params.slug}
          videos={videos}
        />
      </div>
      <div className="p-8 max-h-150 w-full order-1 md:order-2">
        <VideoTrimmer video={video} />
      </div>
    </div>
  );
}
