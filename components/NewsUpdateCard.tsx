import Image from "next/image"
import { HandHeart } from "lucide-react"
import ResponsiveVideoPlayer from "@/components/ResponsiveVideoPlayer"

type NewsUpdateCardProps = {
  title: string
  content: string
  createdAt: Date
  mediaUrl?: string | null
  mediaType?: string | null
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function summarize(content: string) {
  return content.length > 105 ? `${content.slice(0, 105)}...` : content
}

export default function NewsUpdateCard({
  title,
  content,
  createdAt,
  mediaUrl,
  mediaType,
}: NewsUpdateCardProps) {
  return (
    <article className="group flex h-full min-h-[360px] flex-col overflow-hidden rounded-lg border border-white/12 bg-white/[0.065] shadow-[0_16px_42px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1.5 hover:border-yellow-300/55 hover:bg-white/[0.095] hover:shadow-[0_26px_70px_rgba(0,0,0,0.28)]">
      {mediaUrl ? (
        <div className="border-b border-white/10 bg-black/35">
          {mediaType === "VIDEO" ? (
            <ResponsiveVideoPlayer src={mediaUrl} title={title} compact />
          ) : (
            <div className="relative h-52 w-full overflow-hidden">
              <Image
                src={mediaUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          )}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-yellow-300 text-[#071512] shadow-[0_10px_24px_rgba(250,204,21,0.18)]">
          <HandHeart className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="mt-4 text-xs font-black uppercase tracking-normal text-yellow-300">
          {formatDate(createdAt)}
        </p>
        <h3 className="mt-2 text-xl font-black leading-snug text-white">
          {title}
        </h3>
        {content ? (
          <p className="mt-3 text-sm leading-6 text-white/76">
            {summarize(content)}
          </p>
        ) : null}
      </div>
    </article>
  )
}
