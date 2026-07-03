"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { stopOtherPageMedia } from "@/components/MediaPlaybackGuard"
import { WRL_LIVE_STREAM_URL } from "@/lib/live-stream"

function getFreshStreamUrl(src?: string) {
  const streamUrl = src || WRL_LIVE_STREAM_URL
  const separator = streamUrl.includes("?") ? "&" : "?"

  return `${streamUrl}${separator}t=${Date.now()}`
}

export default function FloatingRadioPlayer({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const audio = new Audio()

    audio.src = getFreshStreamUrl(src)
    audio.preload = "none"

    audioRef.current = audio
    const handlePlaying = () => {
      setHasError(false)
      setIsPlaying(true)
    }
    const handlePause = () => setIsPlaying(false)
    const handleError = () => {
      setHasError(true)
      setIsPlaying(false)
    }

    const handlePageMediaPlay = () => {
      audio.pause()
      setIsPlaying(false)
    }

    audio.addEventListener("playing", handlePlaying)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("error", handleError)
    window.addEventListener("wrl:page-media-play", handlePageMediaPlay)

    return () => {
      audio.removeEventListener("playing", handlePlaying)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("error", handleError)
      window.removeEventListener("wrl:page-media-play", handlePageMediaPlay)
      audio.pause()
      audio.src = ""
    }
  }, [src])

  const handleToggle = async () => {
    if (!audioRef.current) return

    try {
      audioRef.current.muted = false

      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        stopOtherPageMedia()
        setHasError(false)
        audioRef.current.src = getFreshStreamUrl(src)
        audioRef.current.load()
        await audioRef.current.play()
        window.dispatchEvent(
          new CustomEvent("wrl:floating-radio-play", {
            detail: { mediaUrl: audioRef.current.src },
          }),
        )
      }
    } catch (error) {
      console.error("Audio playback error:", error)
      setHasError(true)
      setIsPlaying(false)
    }
  }

  return (
    <div className="fixed right-4 top-1/2 z-[60] -translate-y-1/2">
      <div className="group relative min-w-24 overflow-hidden rounded-3xl border border-yellow-400/30 bg-black/30 p-4 shadow-[0_0_25px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-500 hover:border-yellow-400/80 hover:shadow-[0_0_35px_rgba(250,204,21,0.35)]">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-white/5" />

        <div className="absolute left-1/2 top-[38px] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/20 animate-[signalPulse_2s_ease-out_infinite]" />
        <div className="absolute left-1/2 top-[38px] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/10 animate-[signalPulse_2.6s_ease-out_infinite]" />

        <button
          type="button"
          onClick={handleToggle}
          className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-black shadow-lg shadow-yellow-500/30 transition duration-300 hover:scale-105 hover:bg-yellow-300"
          aria-label={isPlaying ? "Pause live radio" : "Play live radio"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Play className="h-6 w-6 fill-current" aria-hidden="true" />
          )}
        </button>

        <p className="relative z-10 mx-auto mt-3 max-w-20 text-center text-sm font-semibold leading-tight text-white">
          {isPlaying ? "On Air Now" : hasError ? "Try Again" : "Listen"}
        </p>
      </div>
    </div>
  )
}
