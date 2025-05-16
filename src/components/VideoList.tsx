"use client";
import { Button, Paper } from "@/components";
import { useDebounce } from "@/hooks";
import type { Video } from "@/lib/videos";
import classNames from "classnames";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, memo, useCallback, useId, useRef } from "react";

export interface VideoListProps {
  pageCount: number;
  selectedVideoId?: string;
  videos: Video[];
}

export const VideoList = memo(
  ({ pageCount, selectedVideoId, videos }: VideoListProps) => {
    const headingId = useId();
    const pageSelectorId = useId();
    const searchInputId = useId();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = Number.parseInt(searchParams.get("page") ?? "1");
    const query = searchParams.get("query") ?? "";

    const getVideos = useCallback(
      (newQuery: string, newPage: number) => {
        const params = new URLSearchParams(searchParams);

        if (newQuery) {
          params.set("query", newQuery);
        } else {
          params.delete("query");
        }

        params.set("page", newPage.toString());

        router.replace(`${pathname}?${params.toString()}`);
      },
      [pathname, router, searchParams],
    );

    const search = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => getVideos(e.target.value, 1),
      [getVideos],
    );

    const debouncedSearch = useDebounce(search, 500);

    const handleNextPageClick = useCallback(
      () => getVideos(query, page + 1),
      [getVideos, page, query],
    );

    const handlePreviousPageClick = useCallback(
      () => getVideos(query, page - 1),
      [getVideos, page, query],
    );

    const handleClearSelection = useCallback(() => {
      getVideos("", 1);
      if (searchInputRef.current) {
        searchInputRef.current.value = "";
      }
    }, [getVideos]);

    const handleJumpToPage = useCallback(
      (e: ChangeEvent<HTMLSelectElement>) => {
        const newPage = Number.parseInt(e.target.value);
        getVideos(query, newPage);
      },
      [getVideos, query],
    );

    const isEmpty = !videos.length;

    return (
      <aside aria-labelledby={headingId}>
        <p className="text-center text-4xl mb-4" id={headingId}>
          Videos
        </p>
        <Paper className="mb-6 bg-purple-300 dark:bg-purple-900 sticky shadow-xl top-[-16px]">
          <label className="text-lg" htmlFor={searchInputId}>
            Search videos
          </label>
          <div className="flex justify-between">
            <input
              className="outline p-2 rounded-md mr-3 w-full focus:outline-2 focus:outline-purple-600 dark:focus:outline-purple-400"
              defaultValue={query}
              id={searchInputId}
              onChange={debouncedSearch}
              ref={searchInputRef}
            />
            <Button
              disabled={!query}
              onClick={handleClearSelection}
              type="button"
            >
              Clear
            </Button>
          </div>
          <div className="my-4">
            <label className="text-lg mr-4" htmlFor={pageSelectorId}>
              Jump to page:
            </label>
            <select
              className="outline p-2 rounded-md focus:outline-2 focus:outline-purple-600 dark:focus:outline-purple-400"
              disabled={pageCount <= 1}
              defaultValue={page}
              id={pageSelectorId}
              onChange={handleJumpToPage}
            >
              {Array.from({ length: pageCount }, (_, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: elements are always the same
                <option className="dark:bg-gray-900 dark:text-white" key={idx}>
                  {idx + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between">
            <Button
              disabled={page === 1}
              onClick={handlePreviousPageClick}
              type="button"
            >
              Previous
            </Button>
            <span className="p-2 text-center">
              Page {page} of {pageCount || 1}
            </span>
            <Button
              disabled={page === pageCount || pageCount === 0}
              onClick={handleNextPageClick}
              type="button"
            >
              Next
            </Button>
          </div>
        </Paper>
        <Paper>
          {isEmpty ? (
            <output>
              {query ? (
                <p className="text-center">
                  🔎 No videos available for your search
                </p>
              ) : (
                <p className="text-center">❌ No videos available</p>
              )}
            </output>
          ) : (
            <ul>
              {videos.map((video) => (
                <li
                  className={classNames(
                    "p-4 [&:not(:first-child)&:not(:last-child)]:my-4 rounded-md h-[152px] overflow-hidden",
                    {
                      "border border-purple-300 dark:border-purple-400 shadow-xl shadow-purple-300 dark:shadow-purple-500 bg-purple-400 dark:bg-purple-700 dark:shadow-purple-900":
                        video.id.videoId === selectedVideoId,
                    },
                    {
                      "bg-gray-200 dark:bg-gray-600":
                        video.id.videoId !== selectedVideoId,
                    },
                  )}
                  key={video.id.videoId}
                >
                  <Link
                    href={`/videos/${video.id.videoId}?${searchParams.toString()}`}
                    shallow
                  >
                    <p className="text-l font-bold line-clamp-2 text-ellipsis">
                      {video.snippet.title}
                    </p>
                    <p className="mt-3 line-clamp-2 text-ellipsis">
                      {video.snippet.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Paper>
      </aside>
    );
  },
);
