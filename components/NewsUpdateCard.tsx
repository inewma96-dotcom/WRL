import Image from "next/image"
import { HandHeart } from "lucide-react"
import ResponsiveVideoPlayer from "@/components/ResponsiveVideoPlayer"

type NewsUpdateCardProps = {
  title: string
  content: string
  createdAt: Date
  mediaUrl?: string | null
  mediaType?: string | null
  variant?: "default" | "featured" | "compact"
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
  variant = "default",
}: NewsUpdateCardProps) {
  if (variant !== "default") {
    const isFeatured = variant === "featured"

    return (
      <article
        className={
          isFeatured
            ? "group overflow-hidden rounded-lg border border-black/10 bg-[var(--wrl-secondary)] text-[var(--wrl-secondary-foreground)] shadow-[var(--wrl-shadow-elevated)] lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)]"
            : "group flex h-full flex-col overflow-hidden rounded-lg border border-white/12 bg-white/[0.055] text-white transition-colors duration-200 hover:border-[var(--wrl-border-strong)]"
        }
      >
        <EditorialMedia
          title={title}
          mediaUrl={mediaUrl}
          mediaType={mediaType}
          featured={isFeatured}
        />

        <div className={isFeatured ? "flex flex-col justify-center p-6 sm:p-8 lg:p-10" : "flex flex-1 flex-col p-5"}>
          <p className={`text-xs font-bold uppercase ${isFeatured ? "text-[var(--wrl-live-red)]" : "text-[var(--wrl-accent-gold)]"}`}>
            {formatDate(createdAt)}
          </p>
          <h3
            className={
              isFeatured
                ? "mt-3 text-balance text-2xl font-extrabold leading-tight [overflow-wrap:anywhere] sm:text-3xl lg:text-4xl"
                : "mt-2 line-clamp-2 min-h-[3.4rem] text-balance text-xl font-extrabold leading-snug text-white [overflow-wrap:anywhere]"
            }
          >
            {title}
          </h3>
          {content ? (
            <p className={isFeatured ? "mt-5 line-clamp-5 text-base leading-7 text-[#34423d]" : "mt-3 line-clamp-1 min-h-6 text-sm leading-6 text-white/72"}>
              {isFeatured ? content : summarize(content)}
            </p>
          ) : null}
        </div>
      </article>
    )
  }

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

function EditorialMedia({
  title,
  mediaUrl,
  mediaType,
  featured,
}: {
  title: string
  mediaUrl?: string | null
  mediaType?: string | null
  featured: boolean
}) {
  const frameClass = featured
    ? "relative min-h-64 overflow-hidden bg-black lg:min-h-[430px]"
    : "relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-black/30"

  if (mediaUrl && mediaType === "VIDEO") {
    return (
      <div className={frameClass}>
        <ResponsiveVideoPlayer src={mediaUrl} title={title} compact={!featured} />
      </div>
    )
  }

  if (mediaUrl) {
    return (
      <div className={frameClass}>
        <Image
          src={mediaUrl}
          alt={title}
          fill
          sizes={featured ? "(max-width: 1023px) 100vw, 58vw" : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"}
          className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.025]"
        />
      </div>
    )
  }

  return (
    <div className={`${frameClass} flex items-center justify-center bg-[var(--wrl-primary)] p-8`}>
      <Image
        src="/logo.png"
        alt=""
        width={756}
        height={276}
        sizes={featured ? "(max-width: 1023px) 70vw, 32vw" : "240px"}
        className="h-auto w-full max-w-sm object-contain opacity-90"
      />
    </div>
  )
}
