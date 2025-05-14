"use client";
import { Button } from "@/components/Button";
import type { Video } from "@/lib";
import React, { useEffect, useRef, useState } from "react";

interface VideoTrimmerProps {
  video: Video;
}

export function VideoTrimmer({ video }: VideoTrimmerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const savedTrimStart = localStorage.getItem(
      `next-video-studio:video-trim-start:${video.id.videoId}`,
    );
    if (savedTrimStart) {
      setTrimStart(Number.parseFloat(savedTrimStart));
    }

    const savedTrimEnd = localStorage.getItem(
      `next-video-studio:video-trim-start:${video.id.videoId}`,
    );
    if (savedTrimEnd) {
      setTrimEnd(Number.parseFloat(savedTrimEnd));
    }
  }, [video.id.videoId]);

  return (
    <div>
      <video ref={videoRef}>
        <source src="" type="video/mp4" />
        <source src="" type="video/webm" />
        <track default kind="captions" src="" srcLang="en" />
      </video>
      <Button>Play</Button>
    </div>
  );
}
