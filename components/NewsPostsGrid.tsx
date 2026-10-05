"use client"

import { useCallback, useState } from "react"
import { ArrowRight } from "lucide-react"
import NewsUpdateCard from "@/components/NewsUpdateCard"
import NewsStoryDialog, { type NewsStory } from "@/components/NewsStoryDialog"

type NewsPost = NewsStory

const newsThemes = [
  "rgba(37, 99, 235, 0.68)",
  "rgba(247, 201, 40, 0.7)",
  "rgba(0, 122, 82, 0.68)",
  "rgba(215, 25, 32, 0.66)",
  "rgba(156, 47, 111, 0.66)",
  "rgba(57, 73, 171, 0.66)",
]

export default function NewsPostsGrid({ posts }: { posts: NewsPost[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null)
  const closeStory = useCallback(() => setSelectedPost(null), [])

  return (
    <>
      {activeIndex !== null && !selectedPost ? (
        <div className="pointer-events-none fixed inset-0 z-50 bg-[#071512]/50 backdrop-blur-[3px]" aria-hidden="true" />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post, index) => {
          const isActive = activeIndex === index
          const glow = newsThemes[index % newsThemes.length]

          return (
            <div
              key={post.id}
              onPointerEnter={() => setActiveIndex(index)}
              onPointerLeave={() => setActiveIndex(null)}
              className="relative flex h-full transform-gpu flex-col overflow-hidden rounded-lg transition-[transform,box-shadow] duration-300 [&>article]:flex-1 [&>article]:rounded-b-none"
              style={isActive ? {
                zIndex: 60,
                transform: "scale(1.045)",
                boxShadow: `0 0 34px ${glow}, 0 24px 58px rgba(0, 0, 0, 0.42)`,
              } : undefined}
            >
              <NewsUpdateCard
                title={post.title}
                content={post.content}
                createdAt={new Date(post.createdAt)}
                mediaUrl={post.mediaUrl}
                mediaType={post.mediaType}
                variant="compact"
              />
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(null)
                  setSelectedPost(post)
                }}
                className="group/read flex w-full items-center justify-between border-t border-white/12 bg-[#f7c928] px-4 py-3 text-left text-xs font-black uppercase text-[#071512] transition-colors duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7c928]"
                aria-label={`Read the full story: ${post.title}`}
              >
                <span>Read full story</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/read:translate-x-1" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>

      <NewsStoryDialog post={selectedPost} onClose={closeStory} />
    </>
  )
}
