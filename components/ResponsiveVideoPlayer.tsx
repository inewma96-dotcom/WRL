"use client"

import { useState } from "react"

type ResponsiveVideoPlayerProps = {
  src: string
  title?: string
}

export default function ResponsiveVideoPlayer({
  src,
  title = "Uploaded video",
}: ResponsiveVideoPlayerProps) {
  const [orientation, setOrientation] = useState<"unknown" | "portrait" | "landscape">("unknown")
  const isPortrait = orientation === "portrait"

  return (
    <div className="flex w-full items-center justify-center bg-black p-2">
      <video
        controls
        playsInline
        preload="metadata"
        aria-label={title}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget
          setOrientation(video.videoHeight > video.videoWidth ? "portrait" : "landscape")
        }}
        className={
          isPortrait
            ? "h-[360px] max-h-[72vh] w-auto max-w-full rounded-lg object-contain shadow-[0_0_24px_rgba(0,0,0,0.45)]"
            : "aspect-video w-full rounded-lg object-contain"
        }
      >
        <source src={src} />
      </video>
    </div>
  )
}
