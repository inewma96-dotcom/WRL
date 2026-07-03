import NewsUpdateCard from "@/components/NewsUpdateCard"
import { PageHero, SectionHeading } from "@/components/sections/PublicPageSections"
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

  return (
    <main className="min-h-screen bg-[#003b36] text-white">
      <PageHero
        eyebrow="News & Updates"
        title="News & Updates"
        description="Stories, announcements, station updates, and community news from Wantok Radio Light."
        image="/images/news.png"
      />

      <section className="bg-[#071512] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Published Updates"
            title="Latest news from the WRL team"
            description="Every visible news post uploaded from the admin or journalist dashboard appears here with the newest update first."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {news.length > 0 ? (
              news.map((item) => (
                <NewsUpdateCard
                  key={item.id}
                  title={item.title}
                  content={item.content}
                  createdAt={item.createdAt}
                  mediaUrl={item.mediaUrl}
                  mediaType={item.mediaType}
                />
              ))
            ) : (
              <div className="rounded-lg border border-white/12 bg-white/[0.06] p-6 text-white/76 sm:col-span-2 xl:col-span-4">
                No news has been published yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
