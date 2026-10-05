"use client"

import Image from "next/image"
import { useCallback, useState } from "react"
import { ArrowRight } from "lucide-react"
import NewsStoryDialog, { formatNewsDate, type NewsStory } from "@/components/NewsStoryDialog"

export default function LatestNewsFeature({ post }: { post: NewsStory }) {
  const [isOpen, setIsOpen] = useState(false)
  const closeStory = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative min-h-60 w-full overflow-hidden rounded-lg border border-[#f7c928]/70 bg-[#071512] text-left shadow-[0_0_34px_rgba(247,201,40,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_44px_rgba(247,201,40,0.42)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7c928]"
        aria-label={`Read the latest story: ${post.title}`}
      >
        {post.mediaUrl && post.mediaType !== "VIDEO" ? (
          <Image src={post.mediaUrl} alt="" fill sizes="(max-width: 1024px) 100vw, 440px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : null}
        <div className="absolute inset-0 bg-[#031a15]/76" aria-hidden="true" />
        <div className="relative z-10 flex min-h-60 flex-col justify-end p-6">
          <span className="text-xs font-black uppercase text-[#f7c928]">Latest news · {formatNewsDate(post.createdAt)}</span>
          <h2 className="mt-3 text-balance text-2xl font-black leading-tight text-white">{post.title}</h2>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase text-white">
            Read full story
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </button>
      <NewsStoryDialog post={isOpen ? post : null} onClose={closeStory} />
    </>
  )
}
