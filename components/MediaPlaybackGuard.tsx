"use client"

import { useEffect } from "react"

export type FloatingRadioPlayDetail = {
  mediaUrl: string
}

function stopMedia(media: HTMLMediaElement) {
  media.pause()
}

export function stopOtherPageMedia(activeMedia?: HTMLMediaElement) {
  document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((media) => {
    if (media !== activeMedia) {
      stopMedia(media)
    }
  })
}

function trackPlayback(payload: {
  mediaUrl: string
  mediaType: "AUDIO" | "VIDEO"
  context: string
}) {
  const body = JSON.stringify({
    ...payload,
    path: window.location.pathname,
  })

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/media", new Blob([body], { type: "application/json" }))
    return
  }

  fetch("/api/analytics/media", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined)
}

export default function MediaPlaybackGuard() {
  useEffect(() => {
    const handlePlay = (event: Event) => {
      const activeMedia = event.target

      if (!(activeMedia instanceof HTMLMediaElement)) return

      stopOtherPageMedia(activeMedia)
      window.dispatchEvent(new CustomEvent("wrl:page-media-play"))
      trackPlayback({
        mediaUrl: activeMedia.currentSrc || activeMedia.src,
        mediaType: activeMedia.tagName === "VIDEO" ? "VIDEO" : "AUDIO",
        context: "page-media",
      })
    }

    const handleFloatingRadioPlay = (event: Event) => {
      stopOtherPageMedia()

      const detail =
        event instanceof CustomEvent ? (event.detail as FloatingRadioPlayDetail) : null

      if (detail?.mediaUrl) {
        trackPlayback({
          mediaUrl: detail.mediaUrl,
          mediaType: "AUDIO",
          context: "floating-radio",
        })
      }
    }

    document.addEventListener("play", handlePlay, true)
    window.addEventListener("wrl:floating-radio-play", handleFloatingRadioPlay)

    return () => {
      document.removeEventListener("play", handlePlay, true)
      window.removeEventListener("wrl:floating-radio-play", handleFloatingRadioPlay)
    }
  }, [])

  return null
}
