import Image from "next/image"
import LatestNewsFeature from "@/components/LatestNewsFeature"
import NewsPostsGrid from "@/components/NewsPostsGrid"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getPublishedNews() {
  try {
    return await prisma.news.findMany({
      where: { isHidden: false },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Failed to load news page posts:", error)
    return []
  }
}

export default async function NewsPage() {
  const news = await getPublishedNews()
  const serializedNews = news.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    createdAt: item.createdAt.toISOString(),
    mediaUrl: item.mediaUrl,
    mediaType: item.mediaType,
  }))
  const latestPost = serializedNews[0]
  const previousPosts = serializedNews.slice(1)

  return (
    <main className="min-h-screen bg-[var(--wrl-page-background)] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/news.png?refresh=20261005')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-20 bg-black/62" />
        <div className="absolute inset-0 -z-10 bg-[image:var(--wrl-hero-overlay)]" />
        <div className="wrl-premium-grid absolute inset-0 -z-10 opacity-25" />

        <div className="wrl-shell-wide grid gap-8 pb-10 pt-24 sm:pb-12 sm:pt-28 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-center">
          <div className="max-w-4xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">WRL News</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-black leading-tight text-white [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl">
              News &amp; Updates
            </h1>
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/84 sm:text-lg">
              Stories, announcements, station updates, and community news from Wantok Radio Light.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm font-bold text-white/68">
              <span className="h-px w-10 bg-[var(--wrl-accent-gold)]" aria-hidden="true" />
              <span>93.9 FM — Port Moresby</span>
            </div>
          </div>
          {latestPost ? <LatestNewsFeature post={latestPost} /> : null}
        </div>
      </section>

      {news.length > 0 ? (
        <section className="wrl-section-dark py-10 sm:py-12">
          <div className="wrl-shell-wide">
            <div className="mb-7 flex flex-col gap-3 border-b border-white/12 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Published Updates</p>
                <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">Previous news</h2>
              </div>
              <p className="text-sm font-semibold text-white/60">Four stories per row</p>
            </div>
            {previousPosts.length > 0 ? (
              <NewsPostsGrid posts={previousPosts} />
            ) : (
              <p className="py-8 text-base text-white/65">Previous stories will appear here as new updates are published.</p>
            )}
          </div>
        </section>
      ) : (
        <section className="wrl-section-light py-16 sm:py-20 lg:py-24">
          <div className="wrl-shell">
            <div className="mx-auto max-w-3xl border-y border-black/10 py-12 text-center sm:py-16">
              <div className="mx-auto flex h-20 w-40 items-center justify-center">
                <Image
                  src="/logo.png"
                  alt=""
                  width={756}
                  height={276}
                  sizes="160px"
                  className="h-auto w-full object-contain"
                />
              </div>
              <p className="wrl-eyebrow mt-7 text-[var(--wrl-live-red)]">WRL News</p>
              <h2 className="mt-4 text-2xl font-black text-[var(--wrl-secondary-foreground)] sm:text-3xl">
                No news updates are currently available.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[#52605b]">
                Please check again later for stories, announcements, station updates, and community news.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
