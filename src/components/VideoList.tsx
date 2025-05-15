"use client";
import { Button } from "@/components";
import { useDebounce } from "@/hooks";
import type { Video } from "@/lib/videos";
import classNames from "classnames";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { type ChangeEvent, useCallback, useId, useRef } from "react";

export interface VideoListProps {
  pageCount: number;
  selectedVideoId?: string;
  videos: Video[];
}

export function VideoList({
  pageCount,
  selectedVideoId,
  videos,
}: VideoListProps) {
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

  const pageCounterAndControlButtons = (
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
        disabled={page === pageCount}
        onClick={handleNextPageClick}
        type="button"
      >
        Next
      </Button>
    </div>
  );

  const isEmpty = !videos.length;

  return (
    <aside aria-labelledby={headingId}>
      <p className="text-center text-4xl my-4" id={headingId}>
        Videos
      </p>
      <div className="my-4">
        <label className="text-lg" htmlFor={searchInputId}>
          Search videos
        </label>
        <div className="flex justify-between">
          <input
            className="border border-gray-300 p-2 rounded-md mr-3 w-full focus:outline-purple-700 focus:border-purple-500"
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
            className="border border-gray-300 p-2 rounded-md focus:outline-purple-700 focus:border-purple-500"
            id={pageSelectorId}
            onChange={handleJumpToPage}
          >
            {Array.from({ length: pageCount }, (_, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: elements are always the same
              <option key={idx}>{idx + 1}</option>
            ))}
          </select>
        </div>
        <div className="my-4">{pageCounterAndControlButtons}</div>
      </div>
      {isEmpty ? (
        <output className="text-center">❌ No videos available </output>
      ) : (
        <ul>
          {videos.map((video) => (
            <li
              className={classNames(
                "border p-2 rounded-md my-6 h-[144px] overflow-hidden",
                { "bg-purple-900": video.id.videoId === selectedVideoId },
                { "border-gray-300": video.id.videoId !== selectedVideoId },
                {
                  "border-purple-500": video.id.videoId === selectedVideoId,
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
                <p className="mt-3 line-clamp-3 text-ellipsis">
                  {video.snippet.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {pageCounterAndControlButtons}
    </aside>
  );
}
