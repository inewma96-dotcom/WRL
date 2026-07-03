"use client"

import { useState } from "react"

type ResponsiveVideoPlayerProps = {
  src: string
  title?: string
  compact?: boolean
}

export default function ResponsiveVideoPlayer({
  src,
  title = "Uploaded video",
  compact = false,
}: ResponsiveVideoPlayerProps) {
  const [orientation, setOrientation] = useState<"unknown" | "portrait" | "landscape">("unknown")
  const isPortrait = orientation === "portrait"
  const wrapperClass = compact
    ? "flex h-52 w-full items-center justify-center bg-black p-2"
    : "flex w-full items-center justify-center bg-black p-2"
  const videoClass = compact
    ? isPortrait
      ? "h-48 max-h-full w-auto max-w-full rounded-md object-contain shadow-[0_0_20px_rgba(0,0,0,0.35)]"
      : "h-full w-full rounded-md object-contain"
    : isPortrait
      ? "h-[360px] max-h-[72vh] w-auto max-w-full rounded-lg object-contain shadow-[0_0_24px_rgba(0,0,0,0.45)]"
      : "aspect-video w-full rounded-lg object-contain"

  return (
    <div className={wrapperClass}>
      <video
        controls
        playsInline
        preload="metadata"
        aria-label={title}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget
          setOrientation(video.videoHeight > video.videoWidth ? "portrait" : "landscape")
        }}
        className={videoClass}
      >
        <source src={src} />
      </video>
    </div>
  )
}
