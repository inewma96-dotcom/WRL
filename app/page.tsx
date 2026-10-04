import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, Clock3, HandHeart, Headphones, Library, Radio, RadioTower, Users, Video } from "lucide-react"
import AirwaveAudioCard from "@/components/AirwaveAudioCard"
import FacebookPageSection from "@/components/FacebookPageSection"
import HomeProgramTabs from "@/components/HomeProgramTabs"
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
  { title: "Serving PNG since 2002", description: "A faithful Christian broadcast ministry for listeners across Papua New Guinea.", icon: Radio },
  { title: "Christian programs daily", description: "Bible teaching, prayer, family programs, worship, and community encouragement.", icon: BookOpen },
  { title: "FM, shortwave, and online", description: "Listeners can tune in through radio, live stream, and mobile listening options.", icon: Headphones },
  { title: "Ministry partners", description: "Local and international partners help keep the Gospel on the air.", icon: Users },
]

const broadcastCoverage = [
  {
    eyebrow: "FM Coverage",
    location: "Port Moresby",
    frequency: "93.9 FM",
    description: "Local FM broadcast coverage for listeners in the capital city.",
    icon: Radio,
  },
  {
    eyebrow: "Shortwave Coverage",
    location: "Mt Hagen",
    frequency: "7325 kHz",
    description: "Shortwave transmission on the 41 metre band for wider regional listening.",
    icon: RadioTower,
  },
]

const digitalListeningOptions = [
  {
    title: "Watch Live",
    description: "Open the WRL live stream in your browser when internet access is available.",
    href: "/watch-live",
    icon: Video,
  },
  {
    title: "Recorded Programs",
    description: "Visit Airwaves for available WRL program recordings and updates.",
    href: "/airwaves",
    icon: Library,
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

        <div className="wrl-shell-wide grid min-h-[calc(100svh-150px)] gap-8 pb-12 pt-28 sm:min-h-[calc(100svh-170px)] sm:gap-10 sm:pb-16 sm:pt-32 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.75fr)] lg:items-center lg:gap-14 lg:py-24">
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
            aria-labelledby="homepage-playout-title"
            className="wrl-surface-elevated border-[var(--wrl-border-strong)] p-6 sm:p-7 lg:p-8"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[var(--wrl-border)] pb-4">
              <div>
                <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Broadcast Updates</p>
                <h2 id="homepage-playout-title" className="mt-2 text-2xl font-extrabold text-white">
                  Today&apos;s Playout
                </h2>
              </div>
              <Radio className="h-7 w-7 shrink-0 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
            </div>

            {featuredPlayout ? (
              <article className="pt-6">
                <p className="text-xs font-bold uppercase text-[var(--wrl-muted-foreground)]">
                  Recent program post
                </p>
                <h3 className="mt-2 text-balance text-xl font-extrabold leading-snug text-white [overflow-wrap:anywhere] sm:text-2xl">
                  {featuredPlayout.title}
                </h3>
                <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-[var(--wrl-muted-foreground)]">
                  <Clock3 className="mt-1 h-4 w-4 shrink-0 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
                  <time dateTime={featuredPlayout.createdAt.toISOString()}>
                    Posted {formatPlayoutDateTime(featuredPlayout.createdAt)}
                  </time>
                </p>
                {featuredPlayout.description ? (
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/75">
                    {featuredPlayout.description}
                  </p>
                ) : null}
              </article>
            ) : (
              <div className="pt-6">
                <p className="text-base font-bold text-white">No recent playout available</p>
                <p className="mt-2 text-sm leading-6 text-[var(--wrl-muted-foreground)]">
                  Visit Airwaves for available WRL program recordings and updates.
                </p>
              </div>
            )}

            <Link
              href="/airwaves"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-bold text-[var(--wrl-accent-gold)] underline-offset-4 hover:text-white hover:underline"
            >
              View all playouts
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="wrl-section-light py-16 md:py-20">
        <div className="wrl-shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] lg:items-center lg:gap-14">
          <div>
            <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Who We Are</p>
            <h2 className="wrl-section-title mt-4 max-w-3xl text-balance text-[var(--wrl-secondary-foreground)] [overflow-wrap:anywhere]">
              A Christian radio ministry for PNG families and communities
            </h2>
            <p className="wrl-prose-width mt-6 text-base leading-8 text-[#34423d] md:text-lg">
              Wantok Radio Light exists to encourage listeners, strengthen faith, share biblical truth, and serve churches and communities through accessible media.
            </p>
            <p className="wrl-prose-width mt-5 text-base leading-8 text-[#34423d] md:text-lg">
              From devotion programs and prayer to family teaching and community updates, WRL keeps the message simple: Jesus brings hope, truth, and new life.
            </p>
            <Button asChild variant="gold" size="lg" className="mt-8">
              <Link href="/about">
                Learn More
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="wrl-shadow-soft relative mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-lg border border-black/10">
            <Image
              src="/images/entrence.png"
              alt="Entrance to Wantok Radio Light in Port Moresby"
              fill
              quality={80}
              sizes="(max-width: 1023px) 100vw, 420px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="wrl-section-dark py-16 md:py-20">
        <div className="wrl-shell">
          <SectionHeading
            eyebrow="Ministry Impact"
            title="Serving PNG through radio, prayer, and partnership"
            description="The ministry is built on faithful broadcasting, practical support, and Gospel-centered relationships."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {impact.map((item) => {
              const Icon = item.icon

              return (
                <article key={item.title} className="wrl-surface-elevated h-full p-6 md:p-7">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[var(--wrl-accent-gold)] text-[var(--wrl-accent-gold-foreground)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="wrl-card-title mt-5 text-white">{item.title}</h3>
                  <p className="wrl-body mt-3 text-[var(--wrl-muted-foreground)]">
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

      <section className="wrl-section-light py-16 md:py-20">
        <div className="wrl-shell">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Coverage"
              title="Listen by radio or online"
              description="Choose the listening option that works best for your location."
              tone="light"
            />
            <Button asChild variant="default" size="lg" className="w-fit">
              <Link href="/coverage">
                View Coverage
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
            <div className="relative isolate overflow-hidden rounded-lg border border-white/12 bg-[var(--wrl-primary)] p-6 text-white shadow-[var(--wrl-shadow-soft)] sm:p-8">
              <div
                className="pointer-events-none absolute right-5 top-6 -z-10 flex h-16 items-center gap-1 opacity-20 sm:right-8"
                aria-hidden="true"
              >
                {[24, 42, 60, 34, 52, 28, 46, 64, 38].map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="block w-1.5 rounded-full bg-[var(--wrl-accent-gold)]"
                    style={{ height }}
                  />
                ))}
              </div>

              <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Broadcast Frequencies</p>
              <h3 className="mt-4 max-w-xl text-balance text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                Terrestrial coverage
              </h3>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {broadcastCoverage.map((item) => {
                  const Icon = item.icon

                  return (
                    <article
                      key={item.location}
                      className="rounded-lg border border-white/12 bg-white/[0.06] p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--wrl-accent-gold)] text-[var(--wrl-accent-gold-foreground)]">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase text-white/65">{item.eyebrow}</p>
                          <h4 className="mt-1 text-lg font-extrabold text-white [overflow-wrap:anywhere]">
                            {item.location}
                          </h4>
                        </div>
                      </div>
                      <p className="mt-5 text-2xl font-black text-[var(--wrl-accent-gold)] [overflow-wrap:anywhere]">
                        {item.frequency}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/75">{item.description}</p>
                    </article>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {digitalListeningOptions.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    aria-label={`${item.title}: ${item.description}`}
                    className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wrl-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--wrl-secondary)]"
                  >
                    <article className="h-full rounded-lg border border-black/10 bg-white p-6 shadow-[var(--wrl-shadow-soft)] transition-colors duration-200 group-hover:border-[var(--wrl-accent-gold)]">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--wrl-primary)] text-white">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-[var(--wrl-primary)] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                      </div>
                      <h3 className="mt-5 text-xl font-extrabold text-[var(--wrl-secondary-foreground)]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#34423d]">{item.description}</p>
                    </article>
                  </Link>
                )
              })}
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

      <section className="wrl-section-light py-14 md:py-16">
        <div className="wrl-shell-wide">
          <div className="relative isolate overflow-hidden border-y border-black/10 py-10 md:py-12">
            <div
              className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[42%] opacity-20 lg:block"
              aria-hidden="true"
            >
              {[18, 34, 50, 70, 44, 82, 58, 38, 64, 28].map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className="absolute top-1/2 w-2 -translate-y-1/2 rounded-full bg-[var(--wrl-primary)]"
                  style={{ height, right: `${index * 9}%` }}
                />
              ))}
            </div>

            <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center lg:gap-14">
              <div className="max-w-3xl">
                <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Support the Ministry</p>
                <h2 className="wrl-section-title mt-4 text-balance text-[var(--wrl-secondary-foreground)] [overflow-wrap:anywhere]">
                  Stand with Wantok Radio Light
                </h2>
                <p className="wrl-prose-width mt-5 text-base leading-8 text-[#34423d] md:text-lg">
                  Prayer, giving, sponsorship, volunteering, and partnership help WRL continue sharing Christian radio programs with listeners across Papua New Guinea.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button asChild variant="gold" size="lg" className="w-full sm:w-fit">
                    <Link href="/support-us">
                      Support WRL
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full border-[var(--wrl-primary)]/35 text-[var(--wrl-primary)] hover:bg-[var(--wrl-primary)] hover:text-white sm:w-fit"
                  >
                    <Link href="/donate">Donation Information</Link>
                  </Button>
                </div>
              </div>

              <div className="hidden justify-self-end lg:block" aria-hidden="true">
                <div className="flex h-36 w-36 items-center justify-center rounded-full border border-[var(--wrl-primary)]/25 bg-white/55 text-[var(--wrl-primary)] shadow-[var(--wrl-shadow-soft)]">
                  <HandHeart className="h-16 w-16" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
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

      <FacebookPageSection />
    </main>
  )
}
