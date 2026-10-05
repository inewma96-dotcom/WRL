"use client"

import { useEffect, useRef, useState } from "react"
import { LoaderCircle, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { stopOtherPageMedia, type FloatingRadioPlayDetail } from "@/components/MediaPlaybackGuard"
import { WRL_LIVE_STREAM_URL } from "@/lib/live-stream"
import { cn } from "@/lib/utils"

function getFreshStreamUrl(src?: string) {
  const streamUrl = src || WRL_LIVE_STREAM_URL
  const separator = streamUrl.includes("?") ? "&" : "?"

  return `${streamUrl}${separator}t=${Date.now()}`
}

type PlayerStatus = "idle" | "connecting" | "playing" | "paused" | "reconnecting" | "error"

type FloatingRadioPlayerProps = {
  src?: string
  variant?: "floating" | "topbar"
}

const signalBars = [12, 22, 16, 30, 20, 26, 14, 28, 18, 24, 12]
const signalColors = ["#f7c928", "#ffffff", "#42b649", "#f7c928", "#d71920"]

const statusLabels: Record<PlayerStatus, string> = {
  idle: "Ready",
  connecting: "Connecting",
  playing: "Playing",
  paused: "Paused",
  reconnecting: "Reconnecting",
  error: "Unable to connect",
}

export default function FloatingRadioPlayer({ src, variant = "floating" }: FloatingRadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playRequestRef = useRef(false)
  const playbackIntentRef = useRef(false)
  const previousVolumeRef = useRef(0.8)
  const [status, setStatus] = useState<PlayerStatus>("idle")
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  const isPlaying = status === "playing"
  const isBusy = status === "connecting" || status === "reconnecting"

  useEffect(() => {
    const audio = new Audio()

    audio.src = getFreshStreamUrl(src)
    audio.preload = "none"
    audio.volume = 0.8
    audioRef.current = audio

    const handleLoadStart = () => {
      if (playbackIntentRef.current) {
        setStatus("connecting")
      }
    }
    const handlePlaying = () => {
      playRequestRef.current = false
      setStatus("playing")
    }
    const handlePause = () => {
      playRequestRef.current = false
      playbackIntentRef.current = false
      setStatus((current) =>
        current === "error" || current === "connecting" || current === "reconnecting"
          ? current
          : "paused",
      )
    }
    const handleWaiting = () => {
      if (playbackIntentRef.current) {
        setStatus((current) => (current === "playing" ? "reconnecting" : "connecting"))
      }
    }
    const handleStalled = () => {
      if (playbackIntentRef.current) {
        setStatus("reconnecting")
      }
    }
    const handleError = () => {
      playRequestRef.current = false
      playbackIntentRef.current = false
      setStatus("error")
    }
    const handlePageMediaPlay = () => {
      audio.pause()
      playRequestRef.current = false
      playbackIntentRef.current = false
      setStatus("paused")
    }

    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("playing", handlePlaying)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("stalled", handleStalled)
    audio.addEventListener("error", handleError)
    window.addEventListener("wrl:page-media-play", handlePageMediaPlay)

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("playing", handlePlaying)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("waiting", handleWaiting)
      audio.removeEventListener("stalled", handleStalled)
      audio.removeEventListener("error", handleError)
      window.removeEventListener("wrl:page-media-play", handlePageMediaPlay)
      audio.pause()
      audio.removeAttribute("src")
      audio.load()
      audioRef.current = null
    }
  }, [src])

  async function startPlayback() {
    const audio = audioRef.current

    if (!audio || playRequestRef.current) return

    playRequestRef.current = true
    playbackIntentRef.current = true
    setStatus("connecting")

    try {
      stopOtherPageMedia()
      audio.src = getFreshStreamUrl(src)
      audio.load()
      await audio.play()

      window.dispatchEvent(
        new CustomEvent<FloatingRadioPlayDetail>("wrl:floating-radio-play", {
          detail: { mediaUrl: audio.currentSrc || audio.src },
        }),
      )
    } catch (error) {
      console.error("Audio playback error:", error)
      playRequestRef.current = false
      playbackIntentRef.current = false
      setStatus("error")
    }
  }

  function handleToggle() {
    const audio = audioRef.current
    if (!audio || isBusy) return

    if (isPlaying) {
      audio.pause()
      return
    }

    void startPlayback()
  }

  function handleVolumeChange(nextVolume: number) {
    const audio = audioRef.current
    const clampedVolume = Math.min(Math.max(nextVolume, 0), 1)

    setVolume(clampedVolume)
    setIsMuted(clampedVolume === 0)

    if (clampedVolume > 0) {
      previousVolumeRef.current = clampedVolume
    }

    if (audio) {
      audio.volume = clampedVolume
      audio.muted = clampedVolume === 0
    }
  }

  function handleMuteToggle() {
    const audio = audioRef.current
    const nextMuted = !isMuted

    setIsMuted(nextMuted)

    if (!audio) return

    if (nextMuted) {
      if (volume > 0) {
        previousVolumeRef.current = volume
      }
      audio.muted = true
      return
    }

    const restoredVolume = volume > 0 ? volume : previousVolumeRef.current
    audio.volume = restoredVolume
    audio.muted = false
    setVolume(restoredVolume)
  }

  const player = (
    <section
      aria-label="Wantok Radio Light live radio player"
      className={cn(
        "pointer-events-auto flex min-h-16 w-full items-center gap-2 rounded-md border border-[var(--wrl-border-strong)] bg-[var(--wrl-primary)] px-2.5 py-2 text-white shadow-[var(--wrl-shadow-elevated)] sm:gap-3 sm:px-3",
        variant === "topbar" ? "max-w-[640px]" : "max-w-[380px]",
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={isBusy}
        aria-label={isPlaying ? "Pause Wantok Radio Light" : "Play Wantok Radio Light"}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--wrl-accent-gold)] text-[var(--wrl-accent-gold-foreground)] shadow-sm transition-colors duration-200 hover:bg-[var(--wrl-cream)] active:bg-white disabled:pointer-events-none disabled:opacity-75"
      >
        {isBusy ? (
          <LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5 fill-current" aria-hidden="true" />
        ) : (
          <Play className="h-5 w-5 fill-current" aria-hidden="true" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--wrl-accent-gold)] sm:text-[11px]">
          Listen Live
        </p>
        <p className="flex min-w-0 items-center text-xs font-bold text-white sm:text-sm">
          <span className="min-w-0 truncate">Wantok Radio Light</span>
          <span className="ml-1.5 shrink-0 whitespace-nowrap border-l border-white/24 pl-1.5 font-semibold text-white/68">
            93.9 FM
          </span>
        </p>
        <p
          className={cn(
            "truncate text-[10px] font-semibold sm:hidden",
            status === "error" ? "text-red-300" : "text-white/68",
          )}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {statusLabels[status]}
        </p>
      </div>

      <div
        className="wrl-live-waveform flex h-9 w-[72px] shrink-0 items-center justify-center gap-1 border-x border-white/12 px-2 sm:w-[92px] sm:px-3"
        data-playing={isPlaying}
        aria-hidden="true"
      >
        {signalBars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className="wrl-live-wave-bar block w-1 rounded-full"
            style={{
              height,
              backgroundColor: signalColors[index % signalColors.length],
              animationDelay: `${index * -90}ms`,
              animationDuration: `${620 + (index % 4) * 110}ms`,
            }}
          />
        ))}
      </div>

      <div className="hidden w-[108px] shrink-0 sm:block">
        <p
          className={cn(
            "truncate text-xs font-bold",
            status === "error" ? "text-red-300" : "text-white",
          )}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {statusLabels[status]}
        </p>
        {status === "error" ? (
          <button
            type="button"
            onClick={() => void startPlayback()}
            className="mt-0.5 inline-flex min-h-6 items-center gap-1 rounded text-[11px] font-bold text-[var(--wrl-accent-gold)] underline underline-offset-2 transition-colors hover:text-white"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Retry
          </button>
        ) : (
          <p className="text-[10px] text-white/58">
            {isPlaying ? "Stream connected" : "Audio stream"}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleMuteToggle}
          aria-label={isMuted ? "Unmute live radio" : "Mute live radio"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white/68 transition-colors duration-200 hover:bg-white/10 hover:text-white"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Volume2 className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        <label className="hidden items-center md:flex">
          <span className="sr-only">Live radio volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(event) => handleVolumeChange(Number(event.currentTarget.value))}
            aria-valuetext={`${Math.round((isMuted ? 0 : volume) * 100)} percent`}
            className="h-11 w-20 cursor-pointer accent-[var(--wrl-accent-gold)] lg:w-24"
          />
        </label>
      </div>
    </section>
  )

  if (variant === "topbar") {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-[72px] z-40 flex justify-center px-2 pt-2 sm:top-[82px] sm:px-4">
        {player}
      </div>
    )
  }

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[60] w-[calc(100%-2rem)] max-w-[380px]">
      {player}
    </div>
  )
}
