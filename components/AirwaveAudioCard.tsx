"use client"

import { type ReactNode, useEffect, useId, useRef, useState } from "react"
import { LoaderCircle, Pause, Play, Radio, RotateCcw } from "lucide-react"

type AirwaveAudioCardProps = {
  title: string
  description?: string | null
  mediaUrl: string
  timeLabel: string
  dateTime: string
  actions?: ReactNode
  variant?: "default" | "featured"
}

type PlaybackStatus = "loading" | "ready" | "playing" | "paused" | "error"

const speeds = [1, 1.5, 2, 3] as const
const waveBars = [8, 14, 22, 12, 30, 18, 42, 24, 16, 36, 54, 26, 18, 40, 28, 20, 48, 34, 18, 26, 14, 32, 46, 22]

function formatDuration(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00"
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

export default function AirwaveAudioCard({
  title,
  description,
  mediaUrl,
  timeLabel,
  dateTime,
  actions,
  variant = "default",
}: AirwaveAudioCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const playRequestRef = useRef(false)
  const seekId = useId()
  const [status, setStatus] = useState<PlaybackStatus>("loading")
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState<(typeof speeds)[number]>(1)
  const [retryKey, setRetryKey] = useState(0)

  const isFeatured = variant === "featured"
  const isPlaying = status === "playing"
  const hasDuration = Number.isFinite(duration) && duration > 0

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed
  }, [speed, retryKey])

  const syncAudioDuration = (audio: HTMLAudioElement) => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration)
      return
    }
    if (audio.seekable.length > 0) {
      const seekableEnd = audio.seekable.end(audio.seekable.length - 1)
      if (Number.isFinite(seekableEnd) && seekableEnd > 0) setDuration(seekableEnd)
    }
  }

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio || playRequestRef.current || status === "error") return

    if (!audio.paused) {
      audio.pause()
      return
    }

    playRequestRef.current = true
    try {
      await audio.play()
    } catch {
      setStatus("error")
    } finally {
      playRequestRef.current = false
    }
  }

  const seekAudio = (nextTime: number) => {
    const audio = audioRef.current
    if (!audio || !hasDuration || !Number.isFinite(nextTime)) return

    const clampedTime = Math.min(Math.max(nextTime, 0), duration)
    audio.currentTime = clampedTime
    setCurrentTime(clampedTime)
  }

  const retryPlayback = () => {
    const audio = audioRef.current
    if (!audio) return

    setCurrentTime(0)
    setDuration(0)
    setStatus("loading")
    setRetryKey((key) => key + 1)
    audio.load()
  }

  const statusLabel = {
    loading: "Loading audio",
    ready: "Ready to play",
    playing: "Playing recorded program",
    paused: "Recorded program paused",
    error: "Audio unavailable",
  }[status]

  return (
    <article
      aria-label={`Recorded program: ${title || "Untitled"}`}
      className={
        isFeatured
          ? "wrl-shadow-elevated overflow-hidden rounded-lg border border-[var(--wrl-border-strong)] bg-[var(--wrl-page-background)] text-white lg:grid lg:grid-cols-[minmax(240px,0.72fr)_minmax(0,1.28fr)]"
          : `group overflow-hidden rounded-lg border bg-black/40 shadow-[0_16px_44px_rgba(0,0,0,0.22)] transition duration-500 hover:-translate-y-1.5 hover:border-yellow-300/70 hover:bg-[#003b36]/95 hover:shadow-[0_24px_55px_rgba(0,0,0,0.36)] ${isPlaying ? "border-yellow-300/90 shadow-[0_0_32px_rgba(250,204,21,0.22)]" : "border-yellow-300/20"}`
      }
    >
      <audio
        key={retryKey}
        ref={audioRef}
        src={mediaUrl}
        preload="metadata"
        onLoadedMetadata={(event) => {
          syncAudioDuration(event.currentTarget)
          setStatus(event.currentTarget.paused ? "ready" : "playing")
        }}
        onLoadedData={(event) => syncAudioDuration(event.currentTarget)}
        onCanPlay={(event) => {
          syncAudioDuration(event.currentTarget)
          setStatus(event.currentTarget.paused ? "ready" : "playing")
        }}
        onWaiting={() => setStatus("loading")}
        onDurationChange={(event) => syncAudioDuration(event.currentTarget)}
        onTimeUpdate={(event) => {
          const nextTime = event.currentTarget.currentTime
          if (Number.isFinite(nextTime)) setCurrentTime(nextTime)
        }}
        onPlay={() => setStatus("playing")}
        onPause={(event) => setStatus(event.currentTarget.currentTime > 0 ? "paused" : "ready")}
        onEnded={() => {
          setCurrentTime(0)
          setStatus("ready")
        }}
        onError={() => setStatus("error")}
      />

      {isFeatured ? (
        <div className="relative isolate flex min-h-64 items-center justify-center overflow-hidden border-b border-white/10 bg-[var(--wrl-primary)] p-8 lg:min-h-full lg:border-b-0 lg:border-r">
          <div className="wrl-premium-grid absolute inset-0 -z-10 opacity-30" aria-hidden="true" />
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[var(--wrl-accent-gold)]/45 bg-black/20 text-[var(--wrl-accent-gold)]">
              <Radio className="h-11 w-11" aria-hidden="true" />
            </div>
            <p className="wrl-eyebrow mt-6 text-[var(--wrl-accent-gold)]">WRL Airwaves</p>
            <p className="mt-2 text-sm font-semibold text-white/70">Recorded programming</p>
          </div>
        </div>
      ) : null}

      <div className={isFeatured ? "p-6 sm:p-8 lg:p-10" : "relative min-h-[190px] bg-gradient-to-br from-[#062d2a] via-black to-[#003b36] p-4"}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {isFeatured ? <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Latest Recording</p> : null}
            {isFeatured ? (
              <h3 className="mt-3 text-balance text-2xl font-extrabold leading-tight text-white [overflow-wrap:anywhere] sm:text-3xl">
                {title || "Untitled"}
              </h3>
            ) : (
              <h4 className="line-clamp-2 text-base font-bold text-white">{title || "Untitled"}</h4>
            )}
          </div>
          <time dateTime={dateTime} className="shrink-0 text-xs font-semibold text-[var(--wrl-accent-gold)]">
            {timeLabel}
          </time>
        </div>

        <p className={isFeatured ? "mt-5 text-base leading-7 text-white/75" : "mt-4 line-clamp-2 text-sm leading-6 text-gray-300"}>
          {description || "No description available."}
        </p>

        <div
          className={`${isFeatured ? "my-7 bg-white/[0.045]" : "my-5 bg-black/28"} flex h-20 items-center justify-center overflow-hidden rounded-lg px-3`}
          aria-hidden="true"
        >
          <div className="flex w-full items-center justify-center gap-1">
            {waveBars.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className={`${isFeatured ? "bg-[var(--wrl-accent-gold)]" : "bg-gradient-to-t from-cyan-300 via-blue-400 to-fuchsia-400 shadow-[0_0_10px_rgba(34,211,238,0.45)]"} w-1.5 rounded-full motion-reduce:animate-none ${isPlaying ? "animate-pulse" : ""}`}
                style={{ height: `${height}px`, animationDelay: `${index * 55}ms`, animationDuration: "520ms" }}
              />
            ))}
          </div>
        </div>

        <div role="group" aria-label={`Audio player for ${title || "recorded program"}`}>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              disabled={status === "error"}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--wrl-accent-gold)] text-[var(--wrl-accent-gold-foreground)] shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--wrl-page-background)] disabled:cursor-not-allowed disabled:opacity-55"
              aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
            >
              {status === "loading" ? (
                <LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Play className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <div className="min-w-[160px] flex-1">
              <label className="sr-only" htmlFor={seekId}>Seek recorded program</label>
              <input
                id={seekId}
                type="range"
                min={0}
                max={hasDuration ? duration : 0}
                step={1}
                value={Math.min(currentTime, duration || 0)}
                disabled={!hasDuration || status === "error"}
                onChange={(event) => seekAudio(Number(event.currentTarget.value))}
                aria-valuetext={`${formatDuration(currentTime)} of ${formatDuration(duration)}`}
                className="h-11 w-full cursor-pointer accent-[var(--wrl-accent-gold)] disabled:cursor-not-allowed disabled:opacity-45"
              />
              <div className="-mt-2 flex justify-between text-xs font-semibold text-white/65" aria-hidden="true">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            <label className="flex min-h-11 shrink-0 items-center gap-2 text-xs font-bold text-white/70">
              <span>Speed</span>
              <select
                value={speed}
                onChange={(event) => {
                  const nextSpeed = Number(event.currentTarget.value)
                  if (speeds.includes(nextSpeed as (typeof speeds)[number])) setSpeed(nextSpeed as (typeof speeds)[number])
                }}
                className="h-10 rounded-md border border-white/20 bg-white/10 px-2 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wrl-accent-gold)]"
                aria-label="Playback speed"
              >
                {speeds.map((option) => <option key={option} value={option} className="text-black">{option}x</option>)}
              </select>
            </label>
          </div>

          <div className="mt-4 min-h-6 text-sm" aria-live="polite" aria-atomic="true">
            {status === "error" ? (
              <div className="flex flex-wrap items-center gap-3 text-white">
                <span>Audio is unavailable right now.</span>
                <button
                  type="button"
                  onClick={retryPlayback}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/30 px-3 py-2 font-bold hover:border-[var(--wrl-accent-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wrl-accent-gold)]"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Retry
                </button>
              </div>
            ) : (
              <span className="text-white/60">{statusLabel}</span>
            )}
          </div>
        </div>

        {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </article>
  )
}
