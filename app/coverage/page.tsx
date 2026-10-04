import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Globe2, Mail, MapPin, Radio, RadioTower, Smartphone, Wifi } from "lucide-react"
import { CTASection, InfoCard, LightCard, SectionHeading } from "@/components/sections/PublicPageSections"
import { Button } from "@/components/ui/button"

const coverageLocations = [
  {
    type: "FM Coverage",
    location: "Port Moresby",
    frequency: "93.9 FM",
    description: "Local FM broadcast coverage for listeners in the capital city.",
    icon: Radio,
  },
  {
    type: "Shortwave Coverage",
    location: "Mt Hagen",
    frequency: "7325 kHz",
    detail: "41 metre band",
    description: "Shortwave transmission for wider regional listening and remote communities.",
    icon: RadioTower,
  },
]

const listeningWays = [
  { title: "FM Radio", description: "Listen locally through FM broadcast where coverage is available.", icon: Radio },
  { title: "Shortwave Radio", description: "Use 7325 kHz on the 41 metre band for wider regional listening.", icon: RadioTower },
  { title: "Live Stream", description: "Listen online from your browser when internet access is available.", icon: Wifi },
  { title: "Mobile Apps", description: "Stay connected through mobile listening options.", icon: Smartphone },
]

const onlineOptions = [
  { title: "Listen Online", description: "Use the live player to hear Christian music, teaching, prayer, and ministry updates.", icon: Globe2 },
  { title: "Mobile Apps", description: "Mobile listening helps supporters and listeners stay connected away from a radio receiver.", icon: Smartphone },
  { title: "Reception Reports / QSL", description: "Shortwave listeners can contact WRL with reception reports and QSL requests.", icon: Mail },
]

export default function CoveragePage() {
  return (
    <main className="bg-[var(--wrl-page-background)] text-white">
      <section className="relative isolate overflow-hidden bg-[var(--wrl-page-background)] text-white">
        <Image
          src="/images/rural.png"
          alt=""
          fill
          priority
          quality={82}
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-black/62" />
        <div className="absolute inset-0 -z-10 bg-[image:var(--wrl-hero-overlay)]" />

        <div className="wrl-shell-wide pb-16 pt-28 sm:pb-18 sm:pt-32 lg:pb-20">
          <div className="max-w-4xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Broadcast Coverage</p>
            <h1 className="wrl-page-title mt-5 text-balance text-white [overflow-wrap:anywhere]">
              Where You Can Hear WRL
            </h1>
            <p className="wrl-prose-width mt-6 text-base font-medium leading-8 text-white/85 md:text-lg">
              Wantok Radio Light reaches listeners through FM radio, shortwave radio, live stream, and mobile listening options.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link href="#ways-to-listen">
                  Ways To Listen
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/35 text-white hover:bg-white/10"
              >
                <Link href="/contact">Send Reception Report</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="coverage-locations" className="wrl-section-light scroll-mt-28 py-16 md:py-20">
        <div className="wrl-shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end lg:gap-14">
            <SectionHeading
              eyebrow="Coverage Overview"
              title="Verified broadcast listening points"
              description="Use the available location and frequency information below to identify WRL broadcast options. Online listening remains available through the website player when internet access is available."
              tone="light"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              {coverageLocations.map((item) => {
                const Icon = item.icon

                return (
                  <article
                    key={item.location}
                    className="h-full rounded-lg border border-black/10 bg-white p-6 shadow-[var(--wrl-shadow-soft)] sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-extrabold uppercase text-[var(--wrl-live-red)]">
                          {item.type}
                        </p>
                        <h3 className="mt-2 text-xl font-extrabold text-[var(--wrl-secondary-foreground)] [overflow-wrap:anywhere]">
                          {item.location}
                        </h3>
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--wrl-primary)] text-white">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>

                    <p className="mt-6 text-3xl font-black text-[var(--wrl-primary)] [overflow-wrap:anywhere]">
                      {item.frequency}
                    </p>
                    {item.detail ? (
                      <p className="mt-1 text-sm font-bold text-[#52605b]">{item.detail}</p>
                    ) : null}
                    <p className="mt-4 text-sm leading-6 text-[#52605b]">{item.description}</p>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="mt-8 flex items-start gap-3 border-t border-black/10 pt-6 text-sm leading-6 text-[#52605b]">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--wrl-primary)]" aria-hidden="true" />
            <p>Radio reception can vary by location and local conditions. The information above identifies available WRL broadcast points without guaranteeing reception at a specific address.</p>
          </div>
        </div>
      </section>

      <section id="ways-to-listen" className="wrl-section-dark scroll-mt-28 py-16 md:py-20">
        <div className="wrl-shell">
          <SectionHeading
            eyebrow="Ways To Listen"
            title="Choose the best way to hear WRL"
            description="Radio remains important for many PNG listeners, while online options help people listen from more places."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {listeningWays.map((way) => (
              <InfoCard key={way.title} {...way} />
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-brand py-16 md:py-20">
        <div className="wrl-shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.78fr)] lg:items-center lg:gap-14">
          <div>
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">FM Coverage</p>
            <h2 className="wrl-section-title mt-4 text-balance text-white [overflow-wrap:anywhere]">
              Port Moresby 93.9 FM
            </h2>
            <p className="wrl-prose-width mt-5 text-base leading-8 text-white/78 md:text-lg">
              WRL continues to serve local listeners through FM broadcast coverage, with Port Moresby 93.9 FM as a key listening point for the capital city.
            </p>
            <div className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-md border border-white/20 px-4 py-2 text-sm font-bold text-white">
              <Radio className="h-5 w-5 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
              Tune to 93.9 FM in Port Moresby
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-lg border border-white/12 shadow-[var(--wrl-shadow-elevated)]">
            <Image
              src="/images/playout.png"
              alt="Wantok Radio Light broadcast studio"
              fill
              quality={80}
              sizes="(max-width: 1023px) 100vw, 520px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="wrl-section-light py-16 md:py-20">
        <div className="wrl-shell">
          <SectionHeading
            eyebrow="Shortwave Coverage"
            title="Reaching remote communities"
            description="Shortwave remains useful where terrain, distance, and local infrastructure make ordinary media access difficult."
            tone="light"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <LightCard title="Frequency" description="7325 kHz" icon={RadioTower} />
            <LightCard title="Band" description="41 metre band" icon={Radio} />
            <LightCard title="Transmission Site" description="Mt Hagen" icon={RadioTower} />
            <LightCard title="Purpose" description="Reaching remote communities with Christian radio." icon={Globe2} />
          </div>
        </div>
      </section>

      <section className="wrl-section-dark py-16 md:py-20">
        <div className="wrl-shell">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Online & Reports"
              title="Mobile listening and reception reports"
              description="Listeners can use online options and send reception reports when they hear WRL by shortwave."
            />
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-fit border-white/35 text-white hover:bg-white/10"
            >
              <Link href="/contact">
                Contact WRL
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {onlineOptions.map((option) => (
              <InfoCard key={option.title} {...option} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Listen Now"
        title="Tune in today"
        description="Use the live player below the navigation bar, or contact WRL for reception reports and QSL information."
        primary={{ label: "Ways To Listen", href: "#ways-to-listen" }}
        secondary={{ label: "Contact WRL", href: "/contact" }}
      />
    </main>
  )
}
