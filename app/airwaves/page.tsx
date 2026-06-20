import { prisma } from "@/lib/prisma"
import AirwaveAudioCard from "@/components/AirwaveAudioCard"
import {
  formatAirwavesPostTime,
  groupAirwavesByMonth,
} from "@/lib/airwaves-timeline"

export const dynamic = "force-dynamic"

const programSettingsId = "default"

export default async function AirwavesPage() {
  const [content, programSettings, programs] = await Promise.all([
    prisma.airwaveContent.findMany({
      where: { isHidden: false, mediaType: "AUDIO" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.programListSettings.upsert({
      where: { id: programSettingsId },
      update: {},
      create: {
        id: programSettingsId,
        heading: "24-Hour Radio Program List",
        subheading: "Wantok Radio Light daily broadcast schedule",
        timeSlotHeading: "Time Slot",
        programHeading: "Program",
        contentFocusHeading: "Content Focus",
      },
    }),
    prisma.radioProgram.findMany({
      where: { isHidden: false },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ])
  const timeline = groupAirwavesByMonth(content)

  return (
    <div className="p-10 text-white">
      <section className="relative isolate -mx-10 -mt-10 mb-10 overflow-hidden px-10 py-12">
        <div
          className="absolute inset-0 -z-30 scale-105 bg-cover bg-center opacity-45 blur-[0.5px]"
          style={{ backgroundImage: "url('/images/mainwall.png')" }}
        />
        <div className="absolute inset-0 -z-20 bg-black/55" />
        <div className="absolute inset-0 -z-20 bg-[#003b36]/35" />

        {programs.length > 0 && (
          <section className="mx-auto max-w-5xl">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-white">
                {programSettings.heading}
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                {programSettings.subheading}
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-500/70 bg-slate-950/60 shadow-[0_18px_50px_rgba(0,0,0,0.32)]">
              <div className="grid grid-cols-1 border-b border-slate-500/70 bg-slate-900/70 text-sm font-bold text-slate-100 md:grid-cols-[0.8fr_0.82fr_1.9fr]">
                <div className="border-b border-slate-500/70 px-5 py-4 md:border-b-0 md:border-r">
                  {programSettings.timeSlotHeading}
                </div>
                <div className="border-b border-slate-500/70 px-5 py-4 md:border-b-0 md:border-r">
                  {programSettings.programHeading}
                </div>
                <div className="px-5 py-4">
                  {programSettings.contentFocusHeading}
                </div>
              </div>

              {programs.map((program) => (
                <article
                  key={program.id}
                  className="grid grid-cols-1 border-b border-slate-500/70 text-sm text-slate-100 transition duration-300 last:border-b-0 hover:-translate-y-1 hover:scale-[1.01] hover:border-yellow-300/80 hover:bg-yellow-300 hover:text-[#003b36] hover:shadow-[0_18px_42px_rgba(250,204,21,0.24)] md:grid-cols-[0.8fr_0.82fr_1.9fr]"
                >
                  <div className="border-b border-slate-500/60 px-5 py-4 font-bold md:border-b-0 md:border-r">
                    {program.timeSlot}
                  </div>
                  <div className="border-b border-slate-500/60 px-5 py-4 font-bold md:border-b-0 md:border-r">
                    <span className="border-b border-dotted border-slate-400">
                      {program.program}
                    </span>
                  </div>
                  <div className="px-5 py-4 font-semibold">
                    {program.contentFocus}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
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
