import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { ArrowRight, BookOpen, Building2, HandHeart, Headphones, Heart, Quote, Radio, Users } from "lucide-react"
import AirwaveAudioCard from "@/components/AirwaveAudioCard"
import FacebookPageSection from "@/components/FacebookPageSection"
import HomeProgramTabs from "@/components/HomeProgramTabs"
import HomeHistoryTimeline from "@/components/HomeHistoryTimeline"
import NewsUpdateCard from "@/components/NewsUpdateCard"
import { SectionHeading } from "@/components/sections/PublicPageSections"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

const localPrograms = [
  {
    title: "Belo-Taim Devotion",
    description: "A midday devotion that gives listeners a quiet pause for Scripture, prayer, and encouragement during the day.",
    image: "/images/bible.png",
  },
  {
    title: "Story Bilong Mi",
    description: "Local testimonies and life stories from PNG voices, sharing how faith brings hope through real experiences.",
  },
  {
    title: "Praying For The Nation",
    description: "A daily prayer focus lifting Papua New Guinea, its leaders, churches, families, and communities before God.",
    image: "/images/pray.png",
  },
]

const internationalPrograms = [
  {
    title: "Focus on the Family",
    description: "Trusted Christian teaching for marriage, parenting, relationships, and building stronger family life.",
    image: "/images/fotf.png",
  },
  {
    title: "Back to the Bible",
    description: "Clear Bible teaching that helps listeners understand Scripture and apply God's Word in everyday life.",
    image: "/images/bttb.png",
  },
  {
    title: "Leading The Way",
    description: "International Bible teaching that encourages listeners to follow Christ with courage, clarity, and hope.",
    image: "/images/leadingTheWay.png",
  },
]

const impact = [
  { title: "Serving PNG since 2002", description: "A faithful Christian broadcast ministry for listeners across Papua New Guinea.", icon: Radio, color: "#d71920", foreground: "#ffffff", glow: "rgba(215, 25, 32, 0.42)", titleClass: "font-black" },
  { title: "Christian programs daily", description: "Bible teaching, prayer, family programs, worship, and community encouragement.", icon: BookOpen, color: "#f7c928", foreground: "#071512", glow: "rgba(247, 201, 40, 0.48)", titleClass: "font-serif font-bold italic" },
  { title: "FM, shortwave, and online", description: "Listeners can tune in through radio, live stream, and mobile listening options.", icon: Headphones, color: "#007a52", foreground: "#ffffff", glow: "rgba(0, 122, 82, 0.44)", titleClass: "font-black uppercase" },
  { title: "Ministry partners", description: "Local and international partners help keep the Gospel on the air.", icon: Users, color: "#3949ab", foreground: "#ffffff", glow: "rgba(57, 73, 171, 0.42)", titleClass: "font-serif font-black" },
]

const stationFacts = [
  { label: "On air since January 14", value: "2002" },
  { label: "FM nationwide", value: "105.9" },
  { label: "FM sites across PNG", value: "31" },
  { label: "Live stream worldwide", value: "24/7" },
]

const supportPaths = [
  {
    title: "Prayer Partners",
    description: "Commit to pray for our staff, our listeners, and the reach of the Gospel across PNG.",
    href: "/prayer-request",
    action: "Share a prayer request",
    icon: Heart,
  },
  {
    title: "Sponsors",
    description: "Businesses, churches, and ministry friends can help sustain daily broadcasting operations.",
    href: "/contact",
    action: "Contact WRL",
    icon: Building2,
  },
  {
    title: "Share-a-thon",
    description: "Make a pledge during our annual fundraising drive and help us reach the unreached.",
    href: "/donate",
    action: "View giving details",
    icon: HandHeart,
    featured: true,
  },
]

function getRecentProgramCutoff() {
  return new Date(Date.now() - 48 * 60 * 60 * 1000)
}

function formatPlayoutDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Pacific/Port_Moresby",
    timeZoneName: "short",
  }).format(value)
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
  const featuredPlayout = todaysPrograms[0]
  const featuredNews = latestNews[0]
  const supportingNews = latestNews.slice(1)

  return (
    <main className="bg-[var(--wrl-primary)] text-white">
      <section className="relative isolate overflow-hidden bg-[var(--wrl-page-background)] text-white">
        <Image
          src="/images/mainwall.png"
          alt=""
          fill
          priority
          quality={82}
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-black/55" />
        <div className="absolute inset-0 -z-10 bg-[image:var(--wrl-hero-overlay)]" />

        <div className="wrl-shell-wide flex min-h-[calc(100svh-150px)] flex-col justify-center gap-10 pb-10 pt-28 sm:min-h-[calc(100svh-170px)] sm:gap-12 sm:pb-12 sm:pt-32 lg:py-20">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.75fr)] lg:items-center lg:gap-14">
            <div className="max-w-3xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">
              PNG&apos;s Christian Radio Station
            </p>
            <h1 className="wrl-display mt-5 max-w-3xl text-balance text-white [overflow-wrap:anywhere]">
              Wantok Radio Light
            </h1>
            <p className="wrl-prose-width mt-6 text-base font-medium leading-8 text-white/85 sm:text-lg sm:leading-8">
              Reaching Papua New Guinea with the love of Jesus Christ through the airwaves.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link href="/airwaves">
                  Today&apos;s Playout
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/35 text-white hover:bg-white/10"
              >
                <Link href="/programs">View Programs</Link>
              </Button>
            </div>
            </div>

            <aside
              aria-labelledby="homepage-toksave-title"
              className="wrl-surface-elevated flex flex-col border-[var(--wrl-border-strong)] p-6 sm:p-7 lg:min-h-[420px] lg:p-8"
            >
            <div className="flex w-full items-center justify-between gap-4 border-b border-[var(--wrl-border)] pb-4">
              <div>
                <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Important Information</p>
                <h2 id="homepage-toksave-title" className="mt-2 text-2xl font-extrabold text-white">
                  TOKSAVE
                </h2>
              </div>
              <HandHeart className="h-7 w-7 shrink-0 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
            </div>

            <article className="w-full pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-bold uppercase text-[var(--wrl-muted-foreground)]">
                  Share-a-thon
                </p>
                <span className="wrl-special-tag-wrap">
                  <span className="wrl-special-tag">
                    <span className="absolute left-2 h-1.5 w-1.5 rounded-full bg-white/90" aria-hidden="true" />
                    Special Program
                  </span>
                </span>
              </div>
              <h3 className="mt-2 text-balance text-xl font-extrabold leading-snug text-white sm:text-2xl">
                Help us reach the unreached
              </h3>
              <p className="mt-4 text-sm leading-6 text-white/75">
                Make a pledge during our annual Share-a-thon and help us reach the unreached.
              </p>
            </article>

            <Link
              href="/pledge"
              className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-md text-sm font-bold text-[var(--wrl-accent-gold)] underline-offset-4 hover:text-white hover:underline lg:mt-auto"
            >
              Make a Pledge
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            </aside>
          </div>

          <dl className="grid w-full grid-cols-2 border-y border-white/25 bg-[#071512]/45 sm:grid-cols-4">
            {stationFacts.map((fact, index) => (
              <div
                key={fact.label}
                className={`px-4 py-4 sm:px-6 sm:py-5 ${index < 2 ? "border-b border-white/20 sm:border-b-0" : ""} ${index % 2 === 0 ? "border-r border-white/20" : ""} ${index === 1 ? "sm:border-r" : ""}`}
              >
                <dt className="text-xs font-bold leading-5 text-white/75 sm:text-sm">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-2xl font-black leading-none text-white sm:text-3xl">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative isolate flex min-h-[85svh] overflow-hidden text-white">
        <Image
          src="/images/entrence.png"
          alt="Entrance to Wantok Radio Light in Port Moresby"
          fill
          quality={88}
          sizes="100vw"
          className="-z-30 object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-black/58" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#031b18]/95 via-[#003b36]/78 to-[#031b18]/38" />

        <div className="wrl-shell-wide flex w-full flex-col justify-center py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Who We Are</p>
            <h2 className="wrl-section-title mt-5 max-w-4xl text-balance text-white [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl">
              A Christian radio ministry for PNG families and communities
            </h2>
            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/88 md:text-lg">
              Wantok Radio Light exists to encourage listeners, strengthen faith, share biblical truth, and serve churches and communities through accessible media.
            </p>
          </div>

          <div className="mt-10 grid max-w-5xl gap-4 md:grid-cols-2 md:gap-5">
            <article className="relative overflow-hidden border-l-4 border-[var(--wrl-accent-gold)] bg-[#071512]/88 p-6 shadow-[var(--wrl-shadow-elevated)] backdrop-blur-sm sm:p-8">
              <span className="text-xs font-black uppercase text-[var(--wrl-accent-gold)]">Purpose</span>
              <h3 className="mt-3 text-3xl font-black leading-none text-white sm:text-4xl">Our Mission</h3>
              <p className="mt-5 text-base font-medium leading-7 text-white/82">
                To preach Jesus Christ to as many Papua New Guineans as possible, in urban and remote communities.
              </p>
            </article>
            <article className="relative overflow-hidden border-l-4 border-[var(--wrl-live-red)] bg-[#071512]/88 p-6 shadow-[var(--wrl-shadow-elevated)] backdrop-blur-sm sm:p-8">
              <span className="text-xs font-black uppercase text-[#ff8f89]">Direction</span>
              <h3 className="mt-3 text-3xl font-black leading-none text-white sm:text-4xl">Our Vision</h3>
              <p className="mt-5 text-base font-medium leading-7 text-white/82">
                To use electronic media to spread the Gospel across PNG and internationally while addressing the social issues of our day.
              </p>
            </article>
          </div>

          <Button asChild variant="gold" size="lg" className="mt-8 w-fit">
            <Link href="/about">
              Discover Our Story
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <HomeHistoryTimeline />

      <div className="bg-white px-6 py-12 text-center sm:py-14">
        <p className="wrl-handwritten mx-auto max-w-5xl text-3xl font-bold leading-snug text-[var(--wrl-primary)] sm:text-4xl lg:text-5xl">
          Reaching towns and remote villages with the Gospel of Jesus Christ through radio.
        </p>
      </div>

      <section className="wrl-section-dark relative isolate overflow-hidden py-16 md:py-20">
        <Image
          src="/images/impact.png"
          alt=""
          fill
          sizes="100vw"
          quality={82}
          className="-z-30 object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-black/58" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-[#003b36]/70" aria-hidden="true" />

        <div className="wrl-shell relative">
          <SectionHeading
            eyebrow="Ministry Impact"
            title="Serving PNG through radio, prayer, and partnership"
            description="The ministry is built on faithful broadcasting, practical support, and Gospel-centered relationships."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {impact.map((item) => {
              const Icon = item.icon

              return (
                <article
                  key={item.title}
                  className="wrl-impact-card group flex min-h-[300px] h-full flex-col p-7"
                  style={{
                    "--impact-color": item.color,
                    "--impact-foreground": item.foreground,
                    "--impact-glow": item.glow,
                  } as CSSProperties}
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-[var(--wrl-accent-gold)] text-[var(--wrl-accent-gold-foreground)] transition-colors duration-300 group-hover:bg-white/90 group-hover:text-[#071512]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className={`mt-7 text-2xl leading-tight text-white transition-colors duration-300 ${item.titleClass}`}>
                    {item.title}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-[var(--wrl-muted-foreground)] transition-colors duration-300 group-hover:text-current group-hover:opacity-90">
                    {item.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="wrl-section-brand py-16 md:py-20">
        <div className="wrl-shell">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Featured Programs"
              title="Programs that inspire, encourage, and transform lives"
              description="A mix of local PNG voices and trusted international Christian programs for daily listening."
            />
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-fit border-white/35 text-white hover:bg-white/10"
            >
              <Link href="/programs">
                View All Programs
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <HomeProgramTabs localPrograms={localPrograms} internationalPrograms={internationalPrograms} />
        </div>
      </section>

      <section className="wrl-section-light relative isolate overflow-hidden py-16 md:py-20">
        <Image
          src="/images/listern.png"
          alt=""
          fill
          sizes="100vw"
          quality={82}
          className="-z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[#003b36]/82" aria-hidden="true" />

        <div className="wrl-shell relative">
          <div className="max-w-4xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Where to Listen</p>
            <h2 className="wrl-section-title mt-4 text-balance text-white">
              The whole nation, <span className="font-serif font-bold italic text-[var(--wrl-accent-gold)]">and beyond.</span>
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(320px,1.02fr)_minmax(0,1.18fr)]">
            <article className="relative isolate min-h-[430px] transform-gpu overflow-hidden rounded-lg bg-[var(--wrl-primary)] text-white shadow-[var(--wrl-shadow-elevated)] transition-[transform,box-shadow,border-color] duration-500 hover:z-10 hover:-translate-y-2 hover:scale-[1.035] hover:shadow-[0_0_38px_rgba(37,99,235,0.72),0_28px_68px_rgba(0,0,0,0.46)] focus-within:z-10 focus-within:-translate-y-2 focus-within:scale-[1.035] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100">
              <Image
                src="/images/map.png"
                alt="Map of Papua New Guinea representing Wantok Radio Light nationwide coverage"
                fill
                quality={82}
                sizes="(max-width: 1023px) 100vw, 46vw"
                className="-z-20 object-cover object-center"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071512]/95 via-[#003b36]/52 to-black/10" />
              <div className="flex h-full min-h-[430px] flex-col justify-end p-7 sm:p-8">
                <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Coverage</p>
                <h3 className="mt-4 text-3xl font-black text-white sm:text-4xl">105.9 FM nationwide</h3>
                <p className="mt-4 max-w-lg text-base font-medium leading-7 text-white/86">
                  31 FM sites across Papua New Guinea, with 93.9 FM serving Port Moresby.
                </p>
                <Button asChild variant="gold" size="lg" className="mt-7 w-fit">
                  <Link href="/coverage">See the coverage map<ArrowRight aria-hidden="true" /></Link>
                </Button>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="relative transform-gpu rounded-lg border border-black/10 bg-white p-6 shadow-[var(--wrl-shadow-soft)] transition-[transform,box-shadow,border-color] duration-500 hover:z-10 hover:-translate-y-2 hover:scale-[1.045] hover:border-[#d71920] hover:shadow-[0_0_34px_rgba(215,25,32,0.68),0_24px_52px_rgba(0,0,0,0.3)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100">
                <span className="inline-flex rounded-full bg-[#fbe8e6] px-3 py-1 text-xs font-black uppercase text-[#a52a22]">Closed</span>
                <h3 className="mt-4 text-xl font-black text-[var(--wrl-secondary-foreground)]">Shortwave</h3>
                <p className="mt-3 text-sm leading-6 text-[#52605b]">7325 kHz from Teka, Mt. Hagen, is closed and awaiting an upgrade.</p>
              </article>
              <article className="relative transform-gpu rounded-lg border border-black/10 bg-white p-6 shadow-[var(--wrl-shadow-soft)] transition-[transform,box-shadow,border-color] duration-500 hover:z-10 hover:-translate-y-2 hover:scale-[1.045] hover:border-[var(--wrl-accent-gold)] hover:shadow-[0_0_34px_rgba(247,201,40,0.72),0_24px_52px_rgba(0,0,0,0.3)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100">
                <p className="wrl-eyebrow text-[#9a7100]">FM</p>
                <h3 className="mt-4 text-xl font-black text-[var(--wrl-secondary-foreground)]">93.9 &amp; 105.9 FM</h3>
                <p className="mt-3 text-sm leading-6 text-[#52605b]">93.9 FM in Port Moresby and 105.9 FM nationwide across 31 FM sites in PNG.</p>
              </article>
              <article className="relative transform-gpu rounded-lg border border-black/10 bg-white p-6 shadow-[var(--wrl-shadow-soft)] transition-[transform,box-shadow,border-color] duration-500 hover:z-10 hover:-translate-y-2 hover:scale-[1.045] hover:border-[#2563eb] hover:shadow-[0_0_34px_rgba(37,99,235,0.7),0_24px_52px_rgba(0,0,0,0.3)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100">
                <p className="wrl-eyebrow text-[#9a7100]">Online</p>
                <h3 className="mt-4 text-xl font-black text-[var(--wrl-secondary-foreground)]">Live Stream</h3>
                <p className="mt-3 text-sm leading-6 text-[#52605b]">Press play at the top of any page. The live stream keeps playing as you browse.</p>
              </article>
              <article className="relative transform-gpu rounded-lg border border-black/10 bg-white p-6 shadow-[var(--wrl-shadow-soft)] transition-[transform,box-shadow,border-color] duration-500 hover:z-10 hover:-translate-y-2 hover:scale-[1.045] hover:border-[#007a52] hover:shadow-[0_0_34px_rgba(0,122,82,0.72),0_24px_52px_rgba(0,0,0,0.3)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100">
                <p className="wrl-eyebrow text-[#9a7100]">Mobile</p>
                <h3 className="mt-4 text-xl font-black text-[var(--wrl-secondary-foreground)]">Apps</h3>
                <p className="mt-3 text-sm leading-6 text-[#52605b]">Listen on the go with our Android and iPhone apps.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="wrl-section-dark py-16 md:py-20">
        <div className="wrl-shell">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Listen Again"
              title="Latest from Airwaves"
              description="Hear the newest recorded WRL program posted within the last 48 hours, or browse the full Airwaves archive."
            />
            <Button asChild variant="gold" size="lg" className="w-fit">
              <Link href="/airwaves">
                Browse All Airwaves
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-10">
            {featuredPlayout ? (
              <AirwaveAudioCard
                title={featuredPlayout.title}
                description={featuredPlayout.description}
                mediaUrl={featuredPlayout.mediaUrl}
                timeLabel={formatPlayoutDateTime(featuredPlayout.createdAt)}
                dateTime={featuredPlayout.createdAt.toISOString()}
                variant="featured"
              />
            ) : (
              <div className="wrl-surface-elevated px-6 py-10 text-center sm:px-8">
                <Radio className="mx-auto h-9 w-9 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-extrabold text-white">No recent program available</h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--wrl-muted-foreground)]">
                  No recorded program has been posted in the last 48 hours. Previous recordings may still be available in Airwaves.
                </p>
                <Button asChild variant="outline" size="lg" className="mt-6 border-white/30 text-white hover:bg-white/10">
                  <Link href="/airwaves">
                    Browse Airwaves
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="wrl-section-light py-10 md:py-12">
        <div className="wrl-shell">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Reach the Unreached"
              title="Keep the light on air"
              description="Every broadcast is made possible by people like you. Share-a-thon is our yearly fundraising drive, and there are practical ways to stand with WRL all year round."
              tone="light"
            />
            <Button asChild variant="default" size="lg" className="w-fit">
              <Link href="/support-us">All ways to support<ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {supportPaths.map(({ title, description, href, action, icon: Icon, featured }) => (
              <article key={title} className={featured ? "flex h-full flex-col rounded-lg bg-[var(--wrl-accent-gold)] p-5 text-[var(--wrl-accent-gold-foreground)] shadow-[var(--wrl-shadow-soft)] md:p-6" : "flex h-full flex-col rounded-lg border border-black/10 bg-white p-5 text-[var(--wrl-secondary-foreground)] shadow-[var(--wrl-shadow-soft)] md:p-6"}>
                <div className={featured ? "flex h-10 w-10 items-center justify-center rounded-md bg-[var(--wrl-primary)] text-[var(--wrl-accent-gold)]" : "flex h-10 w-10 items-center justify-center rounded-md bg-[var(--wrl-primary)] text-[var(--wrl-accent-gold)]"}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-extrabold">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 opacity-80">{description}</p>
                <Link href={href} className={featured ? "mt-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[var(--wrl-primary)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#071512] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" : "mt-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-md font-bold text-[var(--wrl-primary)] underline decoration-[var(--wrl-accent-gold)] underline-offset-4 hover:text-[var(--wrl-live-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wrl-primary)]"}>
                  {action}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center font-serif text-xl font-bold italic text-[var(--wrl-primary)]">
            Thank you for your continued support.
          </p>
        </div>
      </section>

      <section className="wrl-section-brand py-16 md:py-20">
        <div className="wrl-shell">
          <div className="flex flex-col gap-7 border-b border-white/12 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="From WRL"
              title="Latest News"
              description="Recent stories, announcements, and station updates published by the WRL team."
            />
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-fit border-white/35 text-white hover:bg-white/10"
            >
              <Link href="/news">
                View All News
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {featuredNews ? (
            <div className="mt-10">
              <NewsUpdateCard
                title={featuredNews.title}
                content={featuredNews.content}
                createdAt={featuredNews.createdAt}
                mediaUrl={featuredNews.mediaUrl}
                mediaType={featuredNews.mediaType}
                variant="featured"
              />

              {supportingNews.length > 0 ? (
                <div
                  className={`mt-6 grid gap-5 sm:grid-cols-2 ${
                    supportingNews.length === 1
                      ? "max-w-xl"
                      : supportingNews.length === 2
                        ? "lg:grid-cols-2"
                        : "lg:grid-cols-3"
                  }`}
                >
                  {supportingNews.map((item) => (
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
              ) : null}
            </div>
          ) : (
            <div className="mt-10 rounded-lg border border-white/12 bg-white/[0.055] p-7 text-center sm:p-10">
              <h3 className="text-xl font-extrabold text-white">No news has been published yet</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/72">
                Visit the News page for future stories, announcements, and station updates from WRL.
              </p>
              <Button asChild variant="outline" size="lg" className="mt-6 border-white/35 text-white hover:bg-white/10">
                <Link href="/news">
                  View News
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="wrl-section-light py-16 md:py-20">
        <div className="wrl-shell">
          <figure className="mx-auto max-w-4xl text-center">
            <p className="wrl-eyebrow text-[var(--wrl-live-red)]">A Testimony</p>
            <Quote className="mx-auto mt-5 h-10 w-10 fill-[var(--wrl-accent-gold)] text-[var(--wrl-accent-gold)]" aria-hidden="true" />
            <blockquote className="mt-6 text-balance font-serif text-2xl font-bold leading-relaxed text-[var(--wrl-secondary-foreground)] sm:text-3xl sm:leading-relaxed">
              “Mind, I&apos;m not a regular listener to this Godly station, but I broke down crying softly in my car. I have fallen from grace, backslidden. This story just opened my stubborn mind and heart.”
            </blockquote>
            <figcaption className="mt-8">
              <p className="font-extrabold text-[var(--wrl-secondary-foreground)]">Eddie Siavor</p>
              <p className="mt-1 text-sm text-[#52605b]">Port Moresby, Papua New Guinea</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <FacebookPageSection />
    </main>
  )
}
