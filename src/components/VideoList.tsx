"use client";
import { Button } from "@/components/Button";
import type { Video } from "@/lib/videos";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useId } from "react";

export interface VideoListProps {
  pageCount: number;
  videos: Video[];
}

export function VideoList({ pageCount, videos }: VideoListProps) {
  const headingId = useId();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number.parseInt(searchParams.get("page") ?? "1");

  const handlePageSwitch = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", newPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const handleNextPageClick = useCallback(
    () => handlePageSwitch(page + 1),
    [handlePageSwitch, page],
  );

  const handlePreviousPageClick = useCallback(
    () => handlePageSwitch(page - 1),
    [handlePageSwitch, page],
  );

  const isEmpty = !videos.length;

  return (
    <aside aria-labelledby={headingId}>
      <p id={headingId}>Videos</p>
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
