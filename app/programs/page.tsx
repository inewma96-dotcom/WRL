import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Baby, BookOpen, CalendarDays, Heart, Mic2, Music, Radio, Users } from "lucide-react"
import ProgramsSchedule from "@/components/ProgramsSchedule"
import { CTASection, InfoCard, LightCard, SectionHeading } from "@/components/sections/PublicPageSections"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

const programSettingsId = "default"

const featured = [
  "Hope Behind Bars",
  "Heralds of Hope",
  "Let My People Think",
  "Bill Gaither Home Coming Radio",
  "Story Behind the Song",
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
  "Hope Behind Bars",
  "NBC News Relay",
  "Live Church Broadcast",
  "Live RMNC Broadcast",
]

const internationalPrograms = [
  "Focus on the Family",
  "Back to the Bible",
  "Leading The Way",
  "Women of Hope",
  "Keys for Kids",
  "Champions Arise",
  "Unshackled",
  "Heralds of Hope",
  "Heritage & Hope",
  "Bill Gaither Home Coming Radio",
  "Story Behind the Song",
  "Let My People Think",
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

const defaultProgramSettings = {
  heading: "24-Hour Radio Program List",
  subheading: "Wantok Radio Light daily broadcast schedule",
  timeSlotHeading: "Time Slot",
  programHeading: "Program",
  contentFocusHeading: "Content Focus",
}

const dayIds = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const

function getCurrentPngDay() {
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Pacific/Port_Moresby",
  })
    .format(new Date())
    .toLowerCase()

  return dayIds.find((dayId) => dayId === day) || "monday"
}

async function getProgramSchedule() {
  try {
    return await Promise.all([
      prisma.programListSettings.upsert({
        where: { id: programSettingsId },
        update: {},
        create: {
          id: programSettingsId,
          ...defaultProgramSettings,
        },
      }),
      prisma.radioProgram.findMany({
        where: { isHidden: false },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
    ])
  } catch (error) {
    console.error("Failed to load programs page schedule:", error)
    return [defaultProgramSettings, []] as const
  }
}

export default async function ProgramsPage() {
  const [programSettings, programs] = await getProgramSchedule()
  const currentDay = getCurrentPngDay()
  const publicSettings = {
    heading: programSettings.heading,
    subheading: programSettings.subheading,
    timeSlotHeading: programSettings.timeSlotHeading,
    programHeading: programSettings.programHeading,
    contentFocusHeading: programSettings.contentFocusHeading,
  }
  const publicPrograms = programs.map(({ id, timeSlot, program, contentFocus }) => ({
    id,
    timeSlot,
    program,
    contentFocus,
  }))

  return (
    <main className="bg-[var(--wrl-page-background)] text-white">
      <section className="relative isolate overflow-hidden bg-[var(--wrl-page-background)] text-white">
        <Image
          src="/images/programbg.png"
          alt=""
          fill
          priority
          quality={82}
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-black/60" />
        <div className="absolute inset-0 -z-10 bg-[image:var(--wrl-hero-overlay)]" />

        <div className="wrl-shell-wide pb-16 pt-28 sm:pb-18 sm:pt-32 lg:pb-20">
          <div className="max-w-4xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">WRL Programming</p>
            <h1 className="wrl-page-title mt-5 text-balance text-white [overflow-wrap:anywhere]">
              Programs &amp; Schedule
            </h1>
            <p className="wrl-prose-width mt-6 text-base font-medium leading-8 text-white/85 md:text-lg">
              Wantok Radio Light broadcasts local PNG programs and trusted international Christian programs for families, churches, and communities.
            </p>

            <div className="mt-6 flex items-center gap-3 text-sm font-bold text-white">
              <Radio className="h-5 w-5 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
              <span>Wantok Radio Light</span>
              <span className="border-l border-white/25 pl-3 text-white/72">93.9 FM</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link href="/coverage">
                  Listen Live
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/35 text-white hover:bg-white/10"
              >
                <Link href="/support-us">Support Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ProgramsSchedule
        currentDay={currentDay}
        programs={publicPrograms}
        settings={publicSettings}
      />

      <section className="wrl-section-dark py-16 md:py-20">
        <div className="wrl-shell">
          <SectionHeading
            eyebrow="Featured Programs"
            title="Listener favorites on Wantok Radio Light"
            description="These programs bring devotion, testimony, prayer, teaching, and family encouragement to the airwaves."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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

      <section className="wrl-section-brand py-16 md:py-20">
        <div className="wrl-shell grid gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Local PNG Programs"
              title="Local voices for local listeners"
              description="Programs made for PNG communities, churches, and families."
            />
            <div className="mt-8 grid gap-3">
              {localPrograms.map((program) => (
                <div key={program} className="min-h-12 rounded-md border border-[var(--wrl-border)] bg-white/[0.06] px-4 py-3 font-semibold text-white/86">
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
                <div key={program} className="min-h-12 rounded-md border border-[var(--wrl-border)] bg-white/[0.06] px-4 py-3 font-semibold text-white/86">
                  {program}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wrl-section-light py-16 md:py-20">
        <div className="wrl-shell">
          <SectionHeading
            eyebrow="Programs By Audience"
            title="Content for every season of life"
            description="WRL programs are shaped for families, women, children, churches, and everyday listeners."
            tone="light"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map((audience) => (
              <LightCard key={audience.title} {...audience} />
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-dark py-16 md:py-20">
        <div className="wrl-shell">
          <SectionHeading
            eyebrow="Weekly Schedule"
            title="A steady rhythm of faith and encouragement"
            description="Exact program times may change, but the station keeps a balanced schedule of devotion, teaching, music, prayer, and community content."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
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
