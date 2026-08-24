import Link from "next/link"
import { BookOpen, Globe2, Headphones, Radio, RadioTower, Smartphone, Users } from "lucide-react"
import AirwaveAudioCard from "@/components/AirwaveAudioCard"
import FacebookPageSection from "@/components/FacebookPageSection"
import HomeProgramTabs from "@/components/HomeProgramTabs"
import NewsUpdateCard from "@/components/NewsUpdateCard"
import { CTASection, InfoCard, LightCard, PageHero, SectionHeading } from "@/components/sections/PublicPageSections"
import { formatAirwavesPostTime } from "@/lib/airwaves-timeline"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

const localPrograms = [
  {
    title: "Belo-Taim Devotion",
    description: "A midday devotion that gives listeners a quiet pause for Scripture, prayer, and encouragement during the day.",
  },
  {
    title: "Story Bilong Mi",
    description: "Local testimonies and life stories from PNG voices, sharing how faith brings hope through real experiences.",
  },
  {
    title: "Praying For The Nation",
    description: "A daily prayer focus lifting Papua New Guinea, its leaders, churches, families, and communities before God.",
  },
]

const internationalPrograms = [
  {
    title: "Focus on the Family",
    description: "Trusted Christian teaching for marriage, parenting, relationships, and building stronger family life.",
  },
  {
    title: "Back to the Bible",
    description: "Clear Bible teaching that helps listeners understand Scripture and apply God's Word in everyday life.",
  },
  {
    title: "Leading The Way",
    description: "International Bible teaching that encourages listeners to follow Christ with courage, clarity, and hope.",
  },
]

const impact = [
  { title: "Serving PNG since 2002", description: "A faithful Christian broadcast ministry for listeners across Papua New Guinea.", icon: Radio },
  { title: "Christian programs daily", description: "Bible teaching, prayer, family programs, worship, and community encouragement.", icon: BookOpen },
  { title: "FM, shortwave, and online", description: "Listeners can tune in through radio, live stream, and mobile listening options.", icon: Headphones },
  { title: "Ministry partners", description: "Local and international partners help keep the Gospel on the air.", icon: Users },
]

const coverage = [
  { title: "FM Radio", description: "Tune in to local FM broadcasts, including Port Moresby 93.9 FM.", icon: Radio },
  { title: "Shortwave Radio", description: "7325 kHz on the 41 metre band helps reach remote communities.", icon: RadioTower },
  { title: "Live Stream", description: "Listen online when internet access is available.", icon: Globe2 },
  { title: "Mobile Apps", description: "Stay connected through mobile listening options.", icon: Smartphone },
]

function getRecentProgramCutoff() {
  return new Date(Date.now() - 48 * 60 * 60 * 1000)
}

async function getLatestNews() {
  try {
    return await prisma.news.findMany({
      where: { isHidden: false },
      orderBy: { createdAt: "desc" },
      take: 4,
    })
  } catch (error) {
    console.error("Failed to load homepage news:", error)
    return []
  }
}

async function getTodaysPrograms(recentProgramCutoff: Date) {
  try {
    return await prisma.airwaveContent.findMany({
      where: {
        isHidden: false,
        mediaType: "AUDIO",
        createdAt: {
          gte: recentProgramCutoff,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    })
  } catch (error) {
    console.error("Failed to load homepage programs:", error)
    return []
  }
}

export default async function HomePage() {
  const recentProgramCutoff = getRecentProgramCutoff()
  const [latestNews, todaysPrograms] = await Promise.all([
    getLatestNews(),
    getTodaysPrograms(recentProgramCutoff),
  ])

  return (
    <main className="bg-[#003b36] text-white">
      <PageHero
        eyebrow="PNG's Christian Radio Station"
        title="Wantok Radio Light"
        description="Reaching Papua New Guinea with the love of Jesus Christ through the airwaves."
        image="/images/hero.jpg"
        actions={[
          {
            label: "Today's Playout",
            href: "/airwaves",
            title: "Click here to visit our daily programs that has being played out aready",
            variant: "primary",
          },
        ]}
      />

      <section className="bg-[#071512] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeading
            eyebrow="Who We Are"
            title="A Christian radio ministry for PNG families and communities"
            description="Wantok Radio Light exists to encourage listeners, strengthen faith, share biblical truth, and serve churches and communities through accessible media."
          />
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-7">
            <p className="text-lg leading-8 text-white/78">
              From devotion programs and prayer to family teaching and community updates, WRL keeps the message simple: Jesus brings hope, truth, and new life.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex rounded bg-yellow-400 px-5 py-3 text-sm font-black uppercase text-[#071512] transition hover:-translate-y-1 hover:bg-white"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Featured Programs"
            title="Programs that inspire, encourage, and transform lives"
            description="A mix of local PNG voices and trusted international Christian programs for daily listening."
          />
          <HomeProgramTabs localPrograms={localPrograms} internationalPrograms={internationalPrograms} />
        </div>
      </section>

      <section className="bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Impact"
            title="Serving PNG through radio, prayer, and partnership"
            description="The ministry is built on faithful broadcasting, practical support, and Gospel-centered relationships."
            tone="light"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {impact.map((item) => (
              <LightCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Coverage"
              title="Listen by radio, online, or mobile"
              description="Choose the listening option that works best for your location."
            />
            <Link href="/coverage" className="inline-flex w-fit rounded bg-yellow-400 px-5 py-3 text-sm font-black uppercase text-[#071512] transition hover:-translate-y-1 hover:bg-white">
              View Coverage
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {coverage.map((item) => (
              <InfoCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071512] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Today's Program"
              title="Daily program posts for listeners"
              description="The WRL team can post a daily program here for quick listening. Programs stay on the homepage for 48 hours, then automatically drop off."
            />
            <Link href="/airwaves" className="inline-flex w-fit rounded bg-yellow-400 px-5 py-3 text-sm font-black uppercase text-[#071512] transition hover:-translate-y-1 hover:bg-white">
              View Today&apos;s Program
            </Link>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {todaysPrograms.length > 0 ? (
              todaysPrograms.map((item) => (
                <AirwaveAudioCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  mediaUrl={item.mediaUrl}
                  timeLabel={formatAirwavesPostTime(item.createdAt)}
                  dateTime={item.createdAt.toISOString()}
                />
              ))
            ) : (
              <div className="rounded-lg border border-white/12 bg-white/[0.06] p-6 text-white/76 sm:col-span-2 xl:col-span-4">
                No program has been posted in the last 48 hours.
              </div>
            )}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Support Preview"
        title="Help keep Christian radio on the air"
        description="Prayer partners, sponsors, donors, ministry partners, and Share-a-thon supporters make this work possible."
        primary={{ label: "Support Us", href: "/support-us" }}
        secondary={{ label: "Contact WRL", href: "/contact" }}
      />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Latest News"
              title="News and updates from the ministry"
              description="Recent stories, announcements, and station updates published by the WRL team."
            />
            <Link href="/news" className="inline-flex w-fit rounded border border-yellow-300/50 px-5 py-3 text-sm font-black uppercase text-yellow-300 transition hover:-translate-y-1 hover:bg-yellow-300 hover:text-[#003b36]">
              View All News
            </Link>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {latestNews.length > 0 ? (
              latestNews.map((item) => (
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

      <FacebookPageSection />
    </main>
  )
}
