"use client";
import type { Video } from "@/lib/videos";
import React, { useId } from "react";

export interface VideoListProps {
  videos: Video[];
}

export function VideoList({ videos }: VideoListProps) {
  const headingId = useId();
  return (
    <aside aria-labelledby={headingId}>
      <p id={headingId}>Videos</p>
      <ul>
        {videos.map((video) => (
          <li key={video.id.videoId}>
            <p>{video.snippet.title}</p>
            <p>{video.snippet.description}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
