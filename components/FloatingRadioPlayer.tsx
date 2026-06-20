"use client"

import { useEffect, useRef, useState } from "react"
import { stopOtherPageMedia } from "@/components/MediaPlaybackGuard"
import { WRL_LIVE_STREAM_URL } from "@/lib/live-stream"

export default function FloatingRadioPlayer({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio()

    audio.src = src || WRL_LIVE_STREAM_URL
    audio.preload = "none"

    audioRef.current = audio

    const handlePageMediaPlay = () => {
      audio.pause()
      setIsPlaying(false)
    }

    window.addEventListener("wrl:page-media-play", handlePageMediaPlay)

    return () => {
      window.removeEventListener("wrl:page-media-play", handlePageMediaPlay)
      audio.pause()
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
        window.dispatchEvent(
          new CustomEvent("wrl:floating-radio-play", {
            detail: { mediaUrl: audioRef.current.src },
          }),
        )
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Audio playback error:", error)
      alert("Click again to enable audio.")
    }
  }

  return (
    <div className="fixed right-4 top-1/2 z-[60] -translate-y-1/2">
      <div className="group relative overflow-hidden rounded-3xl border border-yellow-400/30 bg-black/30 p-4 shadow-[0_0_25px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-500 hover:border-yellow-400/80 hover:shadow-[0_0_35px_rgba(250,204,21,0.35)]">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-white/5" />

        <div className="absolute left-1/2 top-[38px] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/20 animate-[signalPulse_2s_ease-out_infinite]" />
        <div className="absolute left-1/2 top-[38px] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/10 animate-[signalPulse_2.6s_ease-out_infinite]" />

        <button
          onClick={handleToggle}
          className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-xl font-bold text-black shadow-lg shadow-yellow-500/30 transition duration-300 hover:scale-105 hover:bg-yellow-300"
          aria-label={isPlaying ? "Pause live radio" : "Play live radio"}
        >
          {isPlaying ? "||" : "▶"}
        </button>

        <p className="relative z-10 mt-3 text-center text-sm font-semibold text-white">
          {isPlaying ? "Live On" : "Listen"}
        </p>
      </div>
    </div>
  )
}
