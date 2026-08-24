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
    <div className="fixed bottom-5 right-4 z-[60] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2">
      <div className="group relative min-w-20 rounded-2xl border border-yellow-400/30 bg-black/35 p-3 shadow-[0_18px_42px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-500 hover:border-yellow-400/75 hover:shadow-[0_24px_55px_rgba(0,0,0,0.42)] sm:min-w-24 sm:p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-white/5" />
        <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 w-48 -translate-x-1/2 translate-y-2 rounded-md border border-yellow-300/40 bg-[#071512] px-4 py-3 text-center text-xs font-bold leading-5 text-white opacity-0 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition duration-200 before:absolute before:bottom-0 before:left-1/2 before:h-3 before:w-3 before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:border-b before:border-r before:border-yellow-300/40 before:bg-[#071512] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:bottom-auto sm:left-auto sm:right-full sm:top-1/2 sm:mb-0 sm:mr-3 sm:-translate-y-1/2 sm:translate-x-2 sm:before:bottom-auto sm:before:left-auto sm:before:right-0 sm:before:top-1/2 sm:before:translate-x-1/2 sm:before:-translate-y-1/2 sm:before:border-b sm:before:border-r sm:group-hover:translate-x-0 sm:group-hover:-translate-y-1/2 sm:group-focus-within:translate-x-0 sm:group-focus-within:-translate-y-1/2">
          {isPlaying ? "Turned Off 93.9 FM" : "Play Wantok Radio Light"}
        </span>

        <div className="absolute left-1/2 top-[38px] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/20 animate-[signalPulse_2s_ease-out_infinite]" />
        <div className="absolute left-1/2 top-[38px] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/10 animate-[signalPulse_2.6s_ease-out_infinite]" />

        <button
          type="button"
          onClick={handleToggle}
          className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-300 text-black shadow-lg shadow-yellow-500/25 transition duration-300 hover:scale-105 hover:bg-yellow-200 sm:h-16 sm:w-16"
          aria-label={isPlaying ? "Pause live radio" : "Play live radio"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Play className="h-6 w-6 fill-current" aria-hidden="true" />
          )}
        </button>

        <p className="relative z-10 mx-auto mt-2 max-w-20 text-center text-xs font-bold leading-tight text-white sm:mt-3 sm:text-sm">
          {isPlaying ? "On Air Now" : hasError ? "Try Again" : "Listen"}
        </p>
      </div>
    </div>
  )
}
