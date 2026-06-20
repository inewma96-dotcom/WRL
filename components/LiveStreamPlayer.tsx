"use client"

import { useRef, useState } from "react"
import { Radio, RefreshCw } from "lucide-react"
import { WRL_LIVE_STREAM_URL } from "@/lib/live-stream"

export default function LiveStreamPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "error">("idle")

  const playLive = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      setStatus("loading")
      audio.load()
      await audio.play()
      setStatus("playing")
    } catch (error) {
      console.error("Live stream playback failed:", error)
      setStatus("error")
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-yellow-400/50 bg-black/45 p-6 shadow-[0_0_38px_rgba(0,0,0,0.42)] backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/12 via-transparent to-white/5" />

      <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-yellow-300/40 bg-[#003b36] shadow-[0_0_28px_rgba(250,204,21,0.24)]">
            <span className="absolute h-28 w-28 rounded-full border border-yellow-300/20 animate-[signalPulse_2.2s_ease-out_infinite]" />
            <span className="absolute h-36 w-36 rounded-full border border-yellow-300/10 animate-[signalPulse_3s_ease-out_infinite]" />
            <Radio className="relative h-12 w-12 text-yellow-300" aria-hidden="true" />
          </div>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.28em] text-yellow-300">
            WRL Live Radio
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Listen to Wantok Radio Light Live
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/78 sm:text-base">
            Streaming faith, hope, worship, family programs, and community coverage across Papua New Guinea and beyond.
          </p>
        </div>

        <div className="relative rounded-xl border border-white/10 bg-[#003b36]/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.3)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white/65">Live status</p>
              <p className="mt-1 text-2xl font-bold text-yellow-300">
                {status === "playing" ? "On Air Now" : status === "loading" ? "Connecting..." : status === "error" ? "Reconnect Needed" : "Ready to Play"}
              </p>
            </div>

            <button
              type="button"
              onClick={playLive}
              className="inline-flex items-center gap-2 rounded-full bg-yellow-300 px-5 py-3 text-sm font-bold text-[#003b36] shadow-lg shadow-yellow-500/20 transition hover:-translate-y-0.5 hover:bg-yellow-200"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {status === "playing" ? "Restart Stream" : "Play Live"}
            </button>
          </div>

          <audio
            ref={audioRef}
            controls
            preload="none"
            src={WRL_LIVE_STREAM_URL}
            className="mt-6 w-full"
            onPlay={() => setStatus("playing")}
            onWaiting={() => setStatus("loading")}
            onCanPlay={() => setStatus((current) => (current === "loading" ? "idle" : current))}
            onError={() => setStatus("error")}
          />

          {status === "error" ? (
            <p className="mt-4 rounded-lg border border-red-300/30 bg-red-950/35 px-4 py-3 text-sm text-red-100">
              The live stream could not start in this browser. Please check your internet connection and press Play Live again.
            </p>
          ) : (
            <p className="mt-4 text-sm leading-6 text-white/70">
              Press play once. If the stream pauses while changing pages, use this player or the floating Listen button to reconnect.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
