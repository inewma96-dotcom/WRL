import Image from "next/image"
import Link from "next/link"
import { Antenna, ArrowRight, Building2, Globe2, HandHeart, RadioTower, Smartphone, Wrench } from "lucide-react"
import { CTASection, InfoCard, LightCard, SectionHeading } from "@/components/sections/PublicPageSections"
import { Button } from "@/components/ui/button"

const categories = [
  { title: "Shortwave Expansion", description: "Strengthening wider broadcast reach for remote listeners.", icon: RadioTower },
  { title: "FM Coverage Expansion", description: "Planning for stronger local broadcast access where possible.", icon: Antenna },
  { title: "Digital Ministry", description: "Improving online listening, media, and ministry communication.", icon: Globe2 },
  { title: "Studio Upgrades", description: "Keeping the broadcast home reliable for daily ministry.", icon: Wrench },
  { title: "Mobile App Improvements", description: "Helping more listeners stay connected on mobile devices.", icon: Smartphone },
  { title: "Community Outreach", description: "Supporting ministry activity beyond the studio.", icon: HandHeart },
]

const broadcastProjects = [
  {
    title: "FM Coverage Expansion",
    description: "Future local broadcast improvements as resources and licensing allow.",
    icon: Antenna,
  },
  {
    title: "Shortwave Support",
    description: "Ongoing attention to remote listening and reception quality.",
    icon: RadioTower,
  },
  {
    title: "Engineering Planning",
    description: "Careful technical planning for reliable broadcast ministry.",
    icon: Wrench,
  },
]

const ministryProjects = [
  {
    title: "Digital Ministry Projects",
    description: "Better online listening, web communication, and media access for supporters and listeners.",
    icon: Globe2,
  },
  {
    title: "Studio & Infrastructure Projects",
    description: "Studio upgrades, equipment care, and infrastructure improvements for daily broadcasting.",
    icon: Building2,
  },
  {
    title: "Community Impact Projects",
    description: "Outreach and listener-focused ministry that brings hope beyond the broadcast desk.",
    icon: HandHeart,
  },
]

export default function ProjectsPage() {
  return (
    <main className="bg-[var(--wrl-page-background)] text-white">
      <section className="relative isolate overflow-hidden bg-[var(--wrl-page-background)] text-white">
        <Image
          src="/images/80m.png"
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
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Our Work</p>
            <h1 className="wrl-page-title mt-5 text-balance text-white [overflow-wrap:anywhere]">
              Projects &amp; Ministry Initiatives
            </h1>
            <p className="wrl-prose-width mt-6 text-base font-medium leading-8 text-white/85 md:text-lg">
              Wantok Radio Light continues to plan, build, and improve ministry tools that help Christian radio reach more people across Papua New Guinea.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link href="/support-us">
                  Help With Projects
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/35 text-white hover:bg-white/10"
              >
                <Link href="/contact">Talk With WRL</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="wrl-section-light py-14 md:py-16">
        <div className="wrl-shell grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end lg:gap-14">
          <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Ministry Projects</p>
          <div>
            <h2 className="wrl-section-title text-balance text-[var(--wrl-secondary-foreground)] [overflow-wrap:anywhere]">
              Planning, building, and improving ministry tools
            </h2>
            <p className="wrl-prose-width mt-5 text-base leading-8 text-[#34423d] md:text-lg">
              Wantok Radio Light continues to plan, build, and improve ministry tools that help Christian radio reach more people across Papua New Guinea.
            </p>
          </div>
        </div>
      </section>

      <section className="wrl-section-brand py-16 md:py-20">
        <div className="wrl-shell grid gap-10 lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div className="group relative mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-lg border border-white/12 shadow-[var(--wrl-shadow-elevated)]">
            <Image
              src="/images/tower.png"
              alt="Broadcast tower"
              fill
              quality={82}
              sizes="(max-width: 1023px) 100vw, 560px"
              className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.02]"
            />
          </div>

          <div>
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Featured Project</p>
            <h2 className="wrl-section-title mt-4 text-balance text-white [overflow-wrap:anywhere]">
              Shortwave Expansion
            </h2>
            <p className="wrl-prose-width mt-5 text-base leading-8 text-white/78 md:text-lg">
              Shortwave helps WRL reach listeners beyond easy FM coverage, especially in remote communities where terrain and distance can make communication difficult.
            </p>
          </div>
        </div>
      </section>

      <section className="wrl-section-dark py-16 md:py-20">
        <div className="wrl-shell">
          <SectionHeading
            eyebrow="Broadcast Coverage Expansion"
            title="Planning for stronger radio reach"
            description="FM, shortwave, and future broadcast planning all support the same mission: keep Christian radio accessible to listeners who need encouragement."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {broadcastProjects.map((project) => (
              <InfoCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-light py-16 md:py-20">
        <div className="wrl-shell">
          <SectionHeading
            eyebrow="Project Categories"
            title="Where support can make a difference"
            description="Each project area helps WRL serve listeners with clearer, stronger, and more accessible ministry."
            tone="light"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((project) => (
              <LightCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-dark py-16 md:py-20">
        <div className="wrl-shell">
          <div className="grid gap-5 lg:grid-cols-3">
            {ministryProjects.map((project) => (
              <InfoCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-brand py-16 md:py-20">
        <div className="wrl-shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:items-center lg:gap-14">
          <div>
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Vision 2030</p>
            <h2 className="wrl-section-title mt-4 text-balance text-white [overflow-wrap:anywhere]">
              A stronger Christian media ministry for the next generation
            </h2>
            <p className="wrl-prose-width mt-5 text-base leading-8 text-white/78 md:text-lg">
              Vision 2030 looks toward stronger coverage, improved digital ministry, reliable studios, and deeper partnerships so WRL can continue serving PNG with the Gospel for years to come.
            </p>
          </div>

          <div className="group relative mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-lg border border-white/12 shadow-[var(--wrl-shadow-elevated)]">
            <Image
              src="/images/mainwall.png"
              alt="Wantok Radio Light studio"
              fill
              quality={82}
              sizes="(max-width: 1023px) 100vw, 560px"
              className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="How You Can Help"
        title="Pray, give, sponsor, or partner"
        description="Project support helps WRL improve the tools that carry Christian programs to listeners across PNG."
        primary={{ label: "Support Projects", href: "/support-us" }}
        secondary={{ label: "Become A Partner", href: "/partners" }}
      />
    </main>
  )
}
