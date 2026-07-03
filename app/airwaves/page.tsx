import { prisma } from "@/lib/prisma"
import AirwaveAudioCard from "@/components/AirwaveAudioCard"
import {
  formatAirwavesPostTime,
  groupAirwavesByMonth,
} from "@/lib/airwaves-timeline"

export const dynamic = "force-dynamic"

export default async function AirwavesPage() {
  const content = await prisma.airwaveContent.findMany({
    where: { isHidden: false, mediaType: "AUDIO" },
    orderBy: { createdAt: "desc" },
  })
  const timeline = groupAirwavesByMonth(content)

  return (
    <div className="relative isolate min-h-screen overflow-hidden p-10 text-white">
      <div
        className="absolute inset-0 -z-30 scale-105 bg-cover bg-center opacity-45 blur-[0.5px]"
        style={{ backgroundImage: "url('/images/mainwall.png')" }}
      />
      <div className="absolute inset-0 -z-20 bg-black/55" />
      <div className="absolute inset-0 -z-20 bg-[#003b36]/35" />

      <section className="mb-10 py-12">
        <section className="mx-auto max-w-5xl text-center">
          <p className="text-2xl font-bold leading-10 text-white md:text-4xl md:leading-[1.25]">
            Listen to your favourite programs everyday here where we upload a day programs so that you don&apos;t ever miss out and as always listen to your inspiration station.
          </p>
        </section>
      </section>

      {timeline.length === 0 ? (
        <p className="text-gray-300">No Airwaves posts yet.</p>
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

                  <div className="grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {day.items.map((item) => (
                      <AirwaveAudioCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        mediaUrl={item.mediaUrl}
                        timeLabel={formatAirwavesPostTime(item.createdAt)}
                        dateTime={item.createdAt.toISOString()}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
