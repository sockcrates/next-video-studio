import { Suspense } from "react";
import { VideoList } from "@/components";
import { VideoListSkeleton } from "@/components/VideoListSkeleton";
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
	const query = searchParams?.query ?? "";
	const requestedPage = Number.parseInt(searchParams?.page ?? "1", 10);

	let pageCount = 0;
	let page = 1;
	let videos = [];
	try {
		const allResults = await getVideos({ page: 1, query });
		pageCount = allResults.pageCount;
		page = Math.min(
			Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1),
			Math.max(pageCount, 1),
		);
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
