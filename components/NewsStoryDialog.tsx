"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { RefreshCw, X } from "lucide-react"

export type NewsStory = {
  id: string
  title: string
  content: string
  createdAt: string
  mediaUrl?: string | null
  mediaType?: string | null
}

export function formatNewsDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export default function NewsStoryDialog({
  post,
  onClose,
}: {
  post: NewsStory | null
  onClose: () => void
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [viewState, setViewState] = useState<{ postId: string; view: "story" | "media" }>({
    postId: "",
    view: "story",
  })

  useEffect(() => {
    if (!post) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [post, onClose])

  if (!post) return null

  const activeView = viewState.postId === post.id ? viewState.view : "story"
  const showMedia = Boolean(post.mediaUrl)

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#03110e]/72 p-3 backdrop-blur-md sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-story-title"
        className="relative h-[88vh] max-h-[760px] min-h-[480px] w-full max-w-4xl overflow-hidden rounded-lg border border-white/18 bg-[#061713] text-white shadow-[0_0_52px_rgba(247,201,40,0.3),0_30px_90px_rgba(0,0,0,0.55)]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[#071512]/90 text-white shadow-lg backdrop-blur-md transition duration-200 hover:scale-105 hover:bg-[#d71920] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7c928]"
          aria-label="Close full story"
          title="Close story"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>

        {showMedia ? (
          <button
            type="button"
            onClick={() => setViewState({ postId: post.id, view: activeView === "story" ? "media" : "story" })}
            className="absolute right-17 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[#f7c928]/70 bg-[#f7c928] text-[#071512] shadow-[0_0_24px_rgba(247,201,40,0.45)] transition duration-300 hover:scale-110 hover:rotate-12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={activeView === "story" ? "Flip to view the uploaded media" : "Flip back to the story"}
            title={activeView === "story" ? "View uploaded media" : "Return to story"}
          >
            <RefreshCw className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}

        <div className="h-full w-full" style={{ perspective: "1400px" }}>
          <div
            className="relative h-full w-full transform-gpu transition-transform duration-700 ease-in-out motion-reduce:transition-none"
            style={{
              transformStyle: "preserve-3d",
              transform: activeView === "media" ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <section
              className="absolute inset-0 overflow-hidden"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              aria-hidden={activeView !== "story"}
            >
              {post.mediaUrl ? (
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                  {post.mediaType === "VIDEO" ? (
                    <video src={post.mediaUrl} autoPlay muted loop playsInline className="h-full w-full scale-105 object-cover blur-[4px]" />
                  ) : (
                    <Image src={post.mediaUrl} alt="" fill sizes="(max-width:896px) 100vw, 896px" className="scale-105 object-cover blur-[4px]" />
                  )}
                </div>
              ) : null}
              <div className="pointer-events-none absolute inset-0 bg-[#031a15]/82" aria-hidden="true" />
              <div className="relative z-10 flex h-full flex-col overflow-y-auto px-6 pb-12 pt-24 sm:px-12 sm:pb-16">
                <p className="text-xs font-black uppercase text-[#f7c928]">{formatNewsDate(post.createdAt)}</p>
                <h2 id="news-story-title" className="mt-3 max-w-3xl text-balance text-3xl font-black leading-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                  {post.title}
                </h2>
                <div className="mt-6 h-1 w-16 shrink-0 bg-[#f7c928]" aria-hidden="true" />
                <div className="mt-7 max-w-3xl whitespace-pre-wrap text-base font-medium leading-8 text-white/92 drop-shadow-md sm:text-lg">
                  {post.content}
                </div>
              </div>
            </section>

            <section
              className="absolute inset-0 bg-black px-3 pb-3 pt-20 sm:px-5 sm:pb-5"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              aria-hidden={activeView !== "media"}
            >
              {post.mediaUrl && post.mediaType === "VIDEO" ? (
                <video src={post.mediaUrl} controls playsInline className="h-full w-full object-contain" />
              ) : post.mediaUrl ? (
                <div className="relative h-full w-full">
                  <Image src={post.mediaUrl} alt={post.title} fill sizes="(max-width:896px) 100vw, 896px" className="object-contain" />
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </article>
    </div>,
    document.body,
  )
}
