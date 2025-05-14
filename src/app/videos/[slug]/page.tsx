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
    <div>
      <VideoList pageCount={pageCount} videos={videos} />
      <VideoTrimmer video={video} />
    </div>
  );
}
