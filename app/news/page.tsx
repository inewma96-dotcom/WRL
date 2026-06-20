import { prisma } from "@/lib/prisma"
import Image from "next/image"
import ResponsiveVideoPlayer from "@/components/ResponsiveVideoPlayer"
import {
  formatAirwavesPostTime,
  groupAirwavesByMonth,
} from "@/lib/airwaves-timeline"

export const dynamic = "force-dynamic"

function formatCardDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    where: {
      isHidden: false,
      OR: [
        { mediaType: null },
        { mediaType: "IMAGE" },
        { mediaType: "VIDEO" },
      ],
    },
    orderBy: { createdAt: "desc" },
  })
  const timeline = groupAirwavesByMonth(news)

  return (
    <main className="min-h-screen bg-[#003b36] px-6 py-12 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-yellow-400 md:text-5xl">
            Daily News Update
          </h1>
          <p className="mt-4 text-white/75">
            Stories, Announcements, and Media Updates from One Talk Radio Light.
          </p>
        </div>

        {news.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/30 p-8 text-white/75">
            No news has been published yet.
          </div>
        ) : (
          <div className="space-y-12">
            {timeline.map((month) => (
              <section key={month.key} className="space-y-6">
                <div className="border-b border-yellow-400/30 pb-3">
                  <h2 className="text-2xl font-bold text-yellow-400">
                    {month.label}
                  </h2>
                </div>

                {month.days.map((day) => (
                  <div key={day.key} className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      {day.label}
                    </h3>

                    <div className="grid justify-center gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {day.items.map((item) => (
                        <article
                          key={item.id}
                          className="overflow-hidden rounded-xl border border-yellow-300/20 bg-black/35 shadow-xl transition duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-yellow-300/80 hover:shadow-[0_24px_55px_rgba(0,0,0,0.45)]"
                        >
                          {item.mediaUrl ? (
                            <div className="relative flex w-full items-center justify-center bg-black">
                              {item.mediaType === "VIDEO" ? (
                                <ResponsiveVideoPlayer src={item.mediaUrl} title={item.title} />
                              ) : (
                                <div className="relative h-[240px] w-full">
                                <Image
                                  src={item.mediaUrl}
                                  alt={item.title}
                                  fill
                                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                                  className="object-cover"
                                />
                                </div>
                              )}
                            </div>
                          ) : null}

                          <div className="p-5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300/80">
                                {formatCardDate(item.createdAt)}
                              </p>
                              <time
                                dateTime={item.createdAt.toISOString()}
                                className="text-xs font-semibold text-yellow-300"
                              >
                                {formatAirwavesPostTime(item.createdAt)}
                              </time>
                            </div>
                            <h2 className="mt-3 text-xl font-bold text-white">
                              {item.title}
                            </h2>
                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/75">
                              {item.content}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
