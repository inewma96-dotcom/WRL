import Image from "next/image"
import NewsUpdateCard from "@/components/NewsUpdateCard"
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
  const latestNews = news[0]
  const previousNews = news.slice(1)

  return (
    <main className="min-h-screen bg-[var(--wrl-page-background)] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/images/news.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-black/62" />
        <div className="absolute inset-0 -z-10 bg-[image:var(--wrl-hero-overlay)]" />
        <div className="wrl-premium-grid absolute inset-0 -z-10 opacity-25" />

        <div className="wrl-shell-wide pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-18">
          <div className="max-w-4xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">WRL News</p>
            <h1 className="wrl-page-title mt-5 max-w-4xl text-balance text-white [overflow-wrap:anywhere]">
              News &amp; Updates
            </h1>
            <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-white/84 sm:text-lg sm:leading-9">
              Stories, announcements, station updates, and community news from Wantok Radio Light.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm font-bold text-white/68">
              <span className="h-px w-10 bg-[var(--wrl-accent-gold)]" aria-hidden="true" />
              <span>93.9 FM — Port Moresby</span>
            </div>
          </div>
        </div>
      </section>

      {latestNews ? (
        <>
          <section className="wrl-section-light py-16 sm:py-20 lg:py-24">
            <div className="wrl-shell">
              <div className="mb-8 flex items-end justify-between gap-6 border-b border-black/10 pb-5">
                <div>
                  <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Latest Update</p>
                  <h2 className="mt-3 text-2xl font-black text-[var(--wrl-secondary-foreground)] sm:text-3xl">
                    Most recently published
                  </h2>
                </div>
                <p className="hidden text-sm font-semibold text-[#66736e] sm:block">Wantok Radio Light</p>
              </div>
              <NewsUpdateCard
                title={latestNews.title}
                content={latestNews.content}
                createdAt={latestNews.createdAt}
                mediaUrl={latestNews.mediaUrl}
                mediaType={latestNews.mediaType}
                variant="featured"
              />
            </div>
          </section>

          {previousNews.length > 0 ? (
            <section className="wrl-section-dark py-16 sm:py-20 lg:py-24">
              <div className="wrl-shell">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end lg:gap-16">
                  <div>
                    <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Published Updates</p>
                    <h2 className="wrl-section-title mt-4 text-balance">More from WRL</h2>
                  </div>
                  <p className="max-w-2xl text-base leading-8 text-white/72">
                    Every visible news post uploaded from the admin or journalist dashboard appears here with the newest update first.
                  </p>
                </div>
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {previousNews.map((item) => (
                    <NewsUpdateCard
                      key={item.id}
                      title={item.title}
                      content={item.content}
                      createdAt={item.createdAt}
                      mediaUrl={item.mediaUrl}
                      mediaType={item.mediaType}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </>
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
