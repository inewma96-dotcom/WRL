import { Baby, BookOpen, CalendarDays, Heart, Mic2, Music, Radio, Users } from "lucide-react"
import { CTASection, InfoCard, LightCard, PageHero, SectionHeading } from "@/components/sections/PublicPageSections"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

const programSettingsId = "default"

const featured = [
  "Belo-Taim Devotion",
  "Story Bilong Mi",
  "Praying For The Nation",
  "Sunday Service",
  "Focus on the Family",
  "Back to the Bible",
]

const localPrograms = [
  "Belo-Taim Devotion",
  "Story Bilong Mi",
  "Praying For The Nation",
  "Sunday Service",
  "Krai Bilong ol Meri",
  "Kirapim Gutpela Sindaun",
  "Health Nuggets",
  "Choice Bilong Listener",
  "NBC News Relay",
]

const internationalPrograms = [
  "Focus on the Family",
  "Back to the Bible",
  "Leading The Way",
  "Women of Hope",
  "Keys for Kids",
  "Champions Arise",
  "Unshackled",
  "Reach Beyond",
  "Heritage & Hope",
]

const audiences = [
  { title: "Families", description: "Marriage, parenting, relationships, and daily Christian living.", icon: Users },
  { title: "Women", description: "Encouragement, prayer, testimony, and practical discipleship.", icon: Heart },
  { title: "Children", description: "Bible stories and faith-building content for young listeners.", icon: Baby },
  { title: "Churches", description: "Teaching, worship, Sunday services, and national prayer.", icon: Radio },
]

const schedule = [
  { title: "Morning", description: "Devotions, prayer, music, and encouragement to begin the day.", icon: CalendarDays },
  { title: "Daytime", description: "Teaching, family programs, interviews, and community content.", icon: Mic2 },
  { title: "Evening", description: "Bible programs, worship, youth features, and listener favorites.", icon: Music },
]

export default async function ProgramsPage() {
  const [programSettings, programs] = await Promise.all([
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

  return (
    <main className="bg-[#003b36] text-white">
      <PageHero
        eyebrow="Programs"
        title="Programs That Inspire, Encourage & Transform Lives"
        description="Wantok Radio Light broadcasts local PNG programs and trusted international Christian programs for families, churches, and communities."
        image="/images/programbg.png"
        actions={[
          { label: "Listen Live", href: "/coverage" },
          { label: "Support Programs", href: "/support-us" },
        ]}
      >
        <section aria-labelledby="program-schedule-heading" className="max-w-6xl">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
                On-Air Schedule
              </p>
              <h2 id="program-schedule-heading" className="mt-2 text-2xl font-black leading-tight md:text-4xl">
                {programSettings.heading}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/78 md:text-base">
                {programSettings.subheading}
              </p>
            </div>
            <div className="w-fit rounded border border-yellow-300/50 bg-yellow-300 px-4 py-2 text-xs font-black uppercase tracking-normal text-[#071512]">
              PNG Time UTC+10
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/16 bg-[#071512]/78 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur">
            {programs.length > 0 ? (
              <>
                <div className="hidden grid-cols-[0.72fr_0.9fr_1.5fr] border-b border-white/14 bg-white/[0.08] text-sm font-black uppercase tracking-normal text-yellow-300 md:grid">
                  <div className="border-r border-white/14 px-5 py-4">
                    {programSettings.timeSlotHeading}
                  </div>
                  <div className="border-r border-white/14 px-5 py-4">
                    {programSettings.programHeading}
                  </div>
                  <div className="px-5 py-4">
                    {programSettings.contentFocusHeading}
                  </div>
                </div>

                <div className="max-h-[22rem] overflow-y-auto">
                  {programs.map((program) => (
                    <article
                      key={program.id}
                      className="group grid gap-2 border-b border-white/10 px-5 py-4 text-sm text-white/86 transition last:border-b-0 hover:bg-yellow-300 hover:text-[#071512] md:grid-cols-[0.72fr_0.9fr_1.5fr] md:gap-0 md:px-0 md:py-0"
                    >
                      <div className="font-black text-yellow-300 group-hover:text-[#071512] md:border-r md:border-white/10 md:px-5 md:py-4 md:text-white">
                        {program.timeSlot}
                      </div>
                      <div className="font-black md:border-r md:border-white/10 md:px-5 md:py-4">
                        {program.program}
                      </div>
                      <div className="leading-6 md:px-5 md:py-4">
                        {program.contentFocus}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-6 text-white/76">
                No program schedule has been published yet.
              </div>
            )}
          </div>
        </section>
      </PageHero>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Featured Programs"
            title="Listener favorites on Wantok Radio Light"
            description="These programs bring devotion, testimony, prayer, teaching, and family encouragement to the airwaves."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((program) => (
              <InfoCard
                key={program}
                title={program}
                description="Christian radio content for daily encouragement and spiritual growth."
                icon={BookOpen}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071512] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Local PNG Programs"
              title="Local voices for local listeners"
              description="Programs made for PNG communities, churches, and families."
            />
            <div className="mt-8 grid gap-3">
              {localPrograms.map((program) => (
                <div key={program} className="rounded border border-white/10 bg-white/[0.06] px-4 py-3 font-semibold text-white/86">
                  {program}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="International Programs"
              title="Trusted Christian teaching and stories"
              description="Global ministry partners help strengthen the broadcast with biblical teaching and family content."
            />
            <div className="mt-8 grid gap-3">
              {internationalPrograms.map((program) => (
                <div key={program} className="rounded border border-white/10 bg-white/[0.06] px-4 py-3 font-semibold text-white/86">
                  {program}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Programs By Audience"
            title="Content for every season of life"
            description="WRL programs are shaped for families, women, children, churches, and everyday listeners."
            tone="light"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map((audience) => (
              <LightCard key={audience.title} {...audience} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Weekly Schedule"
            title="A steady rhythm of faith and encouragement"
            description="Exact program times may change, but the station keeps a balanced schedule of devotion, teaching, music, prayer, and community content."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {schedule.map((slot) => (
              <InfoCard key={slot.title} {...slot} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Listen Live"
        title="Tune in to Wantok Radio Light"
        description="Listen by FM, shortwave, live stream, or mobile app where available."
        primary={{ label: "View Coverage", href: "/coverage" }}
        secondary={{ label: "Support Programs", href: "/support-us" }}
      />
    </main>
  )
}
