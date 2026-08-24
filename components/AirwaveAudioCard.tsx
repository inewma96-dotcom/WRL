"use client"

import {
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"
import { Pause, Play } from "lucide-react"

type AirwaveAudioCardProps = {
  title: string
  description?: string | null
  mediaUrl: string
  timeLabel: string
  dateTime: string
  actions?: ReactNode
}

const speeds = [1, 1.5, 2, 3]

function formatDuration(value: number) {
  if (!Number.isFinite(value)) {
    return "0:00"
  }

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
}: AirwaveAudioCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speedIndex, setSpeedIndex] = useState(0)

  const speed = speeds[speedIndex]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
    }
  }, [speed])

  const syncAudioDuration = (audio: HTMLAudioElement) => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration)
      return
    }

    if (audio.seekable.length > 0) {
      const seekableEnd = audio.seekable.end(audio.seekable.length - 1)

      if (Number.isFinite(seekableEnd) && seekableEnd > 0) {
        setDuration(seekableEnd)
      }
    }
  }

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      try {
        await audio.play()
      } catch (error) {
        console.error("Audio playback error:", error)
      }
    } else {
      audio.pause()
    }
  }

  const seekAudio = (nextTime: number) => {
    const audio = audioRef.current
    if (!audio) return

    const clampedTime = Math.min(Math.max(nextTime, 0), duration || 0)
    audio.currentTime = clampedTime
    setCurrentTime(clampedTime)
  }

  const seekFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const track = progressRef.current
    if (!track || !duration) return

    const rect = track.getBoundingClientRect()
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
    seekAudio(ratio * duration)
  }

  const startSeeking = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    seekFromPointer(event)
  }

  const cycleSpeed = () => {
    setSpeedIndex((index) => (index + 1) % speeds.length)
  }

  const progress = duration ? (currentTime / duration) * 100 : 0
  const waveBars = [8, 14, 22, 12, 30, 18, 42, 24, 16, 36, 54, 26, 18, 40, 28, 20, 48, 34, 18, 26, 14, 32, 46, 22]

  return (
    <article
      className={`group overflow-hidden rounded-lg border bg-black/40 shadow-[0_16px_44px_rgba(0,0,0,0.22)] transition duration-500 hover:-translate-y-1.5 hover:border-yellow-300/70 hover:bg-[#003b36]/95 hover:shadow-[0_24px_55px_rgba(0,0,0,0.36)] ${
        isPlaying
          ? "border-yellow-300/90 shadow-[0_0_32px_rgba(250,204,21,0.22)]"
          : "border-yellow-300/20"
      }`}
    >
      <div className="relative min-h-[190px] bg-gradient-to-br from-[#062d2a] via-black to-[#003b36] p-4">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-300/10 via-transparent to-white/5 opacity-70" />
        <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/80 to-transparent" />

        <audio
          ref={audioRef}
          src={mediaUrl}
          preload="metadata"
          onLoadedMetadata={(event) => syncAudioDuration(event.currentTarget)}
          onLoadedData={(event) => syncAudioDuration(event.currentTarget)}
          onCanPlay={(event) => syncAudioDuration(event.currentTarget)}
          onDurationChange={(event) => syncAudioDuration(event.currentTarget)}
          onTimeUpdate={(event) => {
            setCurrentTime(event.currentTarget.currentTime)
            syncAudioDuration(event.currentTarget)
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="relative z-10 flex h-full min-h-[158px] flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="line-clamp-2 text-base font-bold text-white">
                {title || "Untitled"}
              </h4>
            </div>
            <time dateTime={dateTime} className="shrink-0 text-xs font-semibold text-yellow-300">
              {timeLabel}
            </time>
          </div>

          <div
            className={`my-5 flex h-20 items-center justify-center overflow-hidden rounded-lg px-3 transition duration-300 ${
              isPlaying
                ? "bg-black/50 shadow-[inset_0_0_28px_rgba(34,211,238,0.16),0_0_22px_rgba(34,211,238,0.12)]"
                : "bg-black/28"
            }`}
            aria-label={isPlaying ? "Animated audio waveform" : "Audio waveform"}
          >
            <div className="flex w-full items-center justify-center gap-1">
              {waveBars.map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className={`w-1.5 rounded-full bg-gradient-to-t from-cyan-300 via-blue-400 to-fuchsia-400 shadow-[0_0_10px_rgba(34,211,238,0.45)] ${
                    isPlaying ? "animate-pulse" : ""
                  }`}
                  style={{
                    height: `${height}px`,
                    animationDelay: `${index * 55}ms`,
                    animationDuration: "520ms",
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-yellow-300 text-[#003b36] shadow-[0_12px_30px_rgba(250,204,21,0.25)] transition hover:scale-105 hover:bg-yellow-200"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Play className="h-5 w-5" aria-hidden="true" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div
                  ref={progressRef}
                  role="slider"
                  tabIndex={0}
                  aria-label="Seek audio"
                  aria-valuemin={0}
                  aria-valuemax={Math.round(duration || 0)}
                  aria-valuenow={Math.round(currentTime)}
                  onPointerDown={startSeeking}
                  onPointerMove={(event) => {
                    if (event.buttons === 1) {
                      seekFromPointer(event)
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight") {
                      seekAudio(currentTime + 5)
                    }
                    if (event.key === "ArrowLeft") {
                      seekAudio(currentTime - 5)
                    }
                  }}
                  className="relative h-4 cursor-pointer touch-none rounded-full py-[5px]"
                >
                  <div className="h-2 rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-yellow-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div
                    className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-100 bg-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.75)] transition-transform group-hover:scale-110"
                    style={{ left: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-semibold text-white/70">
                  <span>{formatDuration(currentTime)}</span>
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={cycleSpeed}
                className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:border-yellow-300 hover:bg-yellow-300 hover:text-[#003b36]"
                aria-label="Change playback speed"
              >
                {speed}x
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="line-clamp-2 text-sm leading-6 text-gray-300">
          {description || "No description"}
        </p>

        {actions ? <div className="mt-3 flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </article>
  )
}
