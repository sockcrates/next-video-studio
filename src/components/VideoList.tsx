"use client";
import { Button } from "@/components";
import { useDebounce } from "@/hooks/useDebounce";
import type { Video } from "@/lib/videos";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { type ChangeEvent, useCallback, useId } from "react";

export interface VideoListProps {
  pageCount: number;
  videos: Video[];
}

export function VideoList({ pageCount, videos }: VideoListProps) {
  const headingId = useId();
  const searchInputId = useId();
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

  const isEmpty = !videos.length;

  return (
    <aside aria-labelledby={headingId}>
      <p id={headingId}>Videos</p>
      <div>
        <label htmlFor={searchInputId}>Search videos</label>
        <input
          defaultValue={query}
          id={searchInputId}
          onChange={debouncedSearch}
        />
      </div>
      {isEmpty ? (
        <p>❌ No videos available 🤷‍♂️</p>
      ) : (
        <ul>
          {videos.map((video) => (
            <li key={video.id.videoId}>
              <p>{video.snippet.title}</p>
              <p>{video.snippet.description}</p>
            </li>
          ))}
        </ul>
      )}
      {pageCount > 1 ? (
        <div className="flex">
          <Button
            disabled={page === 1}
            onClick={handlePreviousPageClick}
            type="button"
          >
            Previous
          </Button>
          <span>
            Page {page} of {pageCount}
          </span>
          <Button
            disabled={page === pageCount}
            onClick={handleNextPageClick}
            type="button"
          >
            Next
          </Button>
        </div>
      ) : null}
    </aside>
  );
}
