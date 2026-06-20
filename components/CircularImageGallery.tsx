"use client"

import Image from "next/image"
import { type PointerEvent, useEffect, useRef, useState } from "react"

const slides = [
  {
    src: "/images/hand_reach.png",
    verse: "YOUR INSPIRATION STATION ",
    ref: "Reaching you Right where you are with the Love of CHRIST.",
  },
  {
    src: "/images/pray.png",
    verse: "Wantok Radio Light is more than a radio station.",
    ref: "— it is a ministry reaching hearts across Papua New Guinea through faith, prayer, and hope.",
  },
  {
    src: "/images/bible.png",
    verse: "Since 2002, Wantok Radio Light has been broadcasting Christian messages,",
    ref: "to encourage families, communities, and the nation.",
  },
  {
    src: "/images/supportbg.png",
    verse: "Wantok Radio Light is supported by faithful listeners",
    ref: "who believe in sharing hope through Christian broadcasting.",
  },
  {
    src: "/images/IMG1.jpg",
    verse: "Broadcasting hope. Sharing faith, Serving the nation.",
    ref: "This is Wantok Radio Light.",
  },
  {
    src: "/images/rural.png",
    verse: "Through shortwave and FM broadcasting,",
    ref: "Wantok Radio Light reaches people even in rural and isolated areas.",
  },
  {
    src: "/images/dove.png",
    verse: "Let everything that has breath praise the Lord.",
    ref: "Psalm 150:6",
  },
]

export default function CircularImageGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const activeIndexRef = useRef(activeIndex)
  const dragRef = useRef({ index: 0, moved: false, x: 0 })
  const step = 360 / slides.length

  const normalizeIndex = (index: number) =>
    ((index % slides.length) + slides.length) % slides.length

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    if (isPaused) return

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [isPaused])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    setIsPaused(true)
    setIsDragging(true)
    dragRef.current = {
      index: activeIndexRef.current,
      moved: false,
      x: event.clientX,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const distance = event.clientX - dragRef.current.x
    dragRef.current.moved = dragRef.current.moved || Math.abs(distance) > 6
    setActiveIndex(dragRef.current.index - distance / 150)
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return

    setIsDragging(false)
    setActiveIndex(normalizeIndex(Math.round(activeIndexRef.current)))
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#003b36] px-4 py-14 text-white">
      <div
        className="absolute inset-0 -z-10 scale-105 bg-cover bg-center opacity-30 blur-[1px]"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-black/65" />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10">
        <div className="group relative w-full max-w-5xl overflow-hidden rounded-2xl border border-yellow-400/50 bg-black/45 px-5 py-7 text-center shadow-[0_0_35px_rgba(0,0,0,0.4)] backdrop-blur-md transition duration-500 hover:border-yellow-400/90 hover:shadow-[0_0_40px_rgba(250,204,21,0.22)] md:px-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-white/5" />
          <div className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-[120%]" />
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl font-bold leading-none text-yellow-400 drop-shadow-[0_0_14px_rgba(250,204,21,0.28)] md:text-7xl">
              93.9 FM
            </h1>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-white transition-colors duration-300 group-hover:text-yellow-300 md:text-6xl">
              Wantok Radio Light
            </h2>
            <p className="mt-4 text-lg text-gray-100 md:text-3xl">
              Papua New Guinea&apos;s Christian Radio Broadcasting Network.
            </p>
          </div>
        </div>

        <div
          className="relative h-[300px] w-full max-w-6xl cursor-grab touch-pan-y overflow-hidden [perspective:1500px] active:cursor-grabbing sm:h-[380px] md:h-[460px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false)
            setIsDragging(false)
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className={`absolute inset-0 [transform-style:preserve-3d] [--gallery-radius:clamp(12rem,34vw,25rem)] ${
              isDragging
                ? ""
                : "transition-transform duration-700 ease-in-out"
            }`}
            style={{ transform: `rotateY(${-activeIndex * step}deg)` }}
          >
            {slides.map((slide, index) => {
              const rawDistance = normalizeIndex(index - Math.round(activeIndex))
              const focusDistance = Math.min(rawDistance, slides.length - rawDistance)

              return (
              <article
                key={slide.src}
                aria-label={`Show ${slide.ref}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (dragRef.current.moved) return
                  setActiveIndex(index)
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setActiveIndex(index)
                  }
                }}
                className="group absolute left-1/2 top-1/2 h-[8.5rem] w-[11.5rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-yellow-300/70 bg-black shadow-[0_0_28px_rgba(0,0,0,0.45)] transition-shadow duration-500 hover:border-yellow-300 hover:shadow-[0_0_32px_rgba(250,204,21,0.28)] sm:h-[10.5rem] sm:w-64 md:h-52 md:w-80"
                style={{
                  transform: `rotateY(${index * step}deg) translateZ(var(--gallery-radius))`,
                  opacity: focusDistance > 2 ? 0.72 : 1,
                }}
              >
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-yellow-300/10 via-transparent to-white/10" />
                <div className="pointer-events-none absolute left-4 right-4 top-0 z-20 h-px bg-gradient-to-r from-transparent via-yellow-300/90 to-transparent" />
                <div className="pointer-events-none absolute inset-0 z-20 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-[120%]" />
                </div>
                <Image
                  src={slide.src}
                  alt={slide.ref}
                  fill
                  sizes="(max-width: 640px) 184px, (max-width: 768px) 256px, 320px"
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-x-0 bottom-0 z-30 min-h-18 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-3 pb-3 pt-8 text-center sm:min-h-22 sm:pt-10 md:min-h-24 md:px-4">
                  <p className="mx-auto max-w-[92%] text-[10px] font-semibold leading-snug text-white sm:text-xs md:text-sm">
                    {slide.verse}
                  </p>
                  <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.14em] text-yellow-300 sm:text-[10px] md:text-xs">
                    {slide.ref}
                  </span>
                </div>
              </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
