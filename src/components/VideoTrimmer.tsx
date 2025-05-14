"use client";
import { Button } from "@/components/Button";
import { useDebounce } from "@/hooks";
import type { Video } from "@/lib";
import React, { use, useCallback, useEffect, useRef, useState } from "react";

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
      `next-video-studio:video-trim-end:${video.id.videoId}`,
    );
    if (savedTrimEnd) {
      setTrimEnd(Number.parseFloat(savedTrimEnd));
    }
  }, [video.id.videoId]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLoadMetadata = () => {
      setVideoDuration(videoElement?.duration ?? 0);
    };

    if (videoElement) {
      videoElement.addEventListener("loadedmetadata", handleLoadMetadata);

      return () =>
        videoElement.removeEventListener("loadedmetadata", handleLoadMetadata);
    }
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    const trimmedStartTime = videoDuration * (trimStart / 100);
    const trimmedEndTime = videoDuration * (trimEnd / 100);

    const handleTimeUpdate = () => {
      if (videoElement.currentTime < trimmedStartTime) {
        videoElement.currentTime = trimmedStartTime;
      } else if (videoElement.currentTime > trimmedEndTime) {
        videoElement.currentTime = trimmedEndTime;
        if (isPlaying) {
          videoElement.pause();
          setIsPlaying(false);
        }
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () =>
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
  }, [isPlaying, trimEnd, trimStart, videoDuration]);

  const persistTrimChange = useCallback((key: string, value: number) => {
    localStorage.setItem(key, value.toString());
  }, []);

  const debouncedPersistTrimChange = useDebounce(persistTrimChange, 500);

  const handleTrimStartChange = useCallback(
    (newTrimStart: number) => {
      setTrimStart(newTrimStart);
      debouncedPersistTrimChange(
        `next-video-studio:video-trim-start:${video.id.videoId}`,
        newTrimStart,
      );
    },
    [debouncedPersistTrimChange, video.id.videoId],
  );

  const handleTrimEndChange = useCallback(
    (newTrimEnd: number) => {
      setTrimEnd(newTrimEnd);
      debouncedPersistTrimChange(
        `next-video-studio:video-trim-end:${video.id.videoId}`,
        newTrimEnd,
      );
    },
    [debouncedPersistTrimChange, video.id.videoId],
  );

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
