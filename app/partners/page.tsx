import type { ElementType } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Church,
  Handshake,
  HeartHandshake,
  Radio,
  RadioTower,
  Users,
} from "lucide-react"

type NamedPartner = {
  name: string
  logo?: string
}

const strategicPartners: NamedPartner[] = [
  { name: "PNG Bible Church", logo: "/images/pngbc.png" },
  { name: "Sonset Solutions", logo: "/images/SonSet.png" },
  { name: "New Life FM", logo: "/images/newlifeFM.png" },
]

const programPartners: NamedPartner[] = [
  { name: "Focus on the Family", logo: "/images/fotf.png" },
  { name: "Back to the Bible", logo: "/images/bttb.png" },
  { name: "Reach Beyond", logo: "/images/reachbyond.png" },
  { name: "Leading The Way", logo: "/images/leadingTheWay.png" },
  { name: "Women of Hope" },
  { name: "Keys for Kids" },
  { name: "Champions Arise" },
  { name: "Unshackled" },
]

const supporters = [
  { title: "Technical Partners", description: "Broadcast, engineering, and media support for reliable ministry.", icon: RadioTower },
  { title: "Community Supporters", description: "Listeners, churches, businesses, and friends who stand with WRL.", icon: Users },
  { title: "Church Partners", description: "Churches that pray, support, and share the Gospel vision.", icon: Church },
  { title: "Sponsors", description: "Organizations and individuals who sponsor programs and ministry needs.", icon: Handshake },
]

const partnershipPaths = [
  { title: "Program Partnership", description: "Share trusted Christian teaching and family content with PNG listeners.", icon: Radio },
  { title: "Technical Partnership", description: "Help improve broadcast systems, digital media, and infrastructure.", icon: RadioTower },
  { title: "Ministry Partnership", description: "Pray, sponsor, give, volunteer, or connect WRL with churches and communities.", icon: HeartHandshake },
]

function PartnerLogo({ partner, priority = false }: { partner: NamedPartner; priority?: boolean }) {
  return (
    <div className="relative flex min-h-44 items-center justify-center overflow-hidden rounded-md border border-black/10 bg-white p-6 sm:min-h-48">
      {partner.logo ? (
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          fill
          priority={priority}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 360px"
          className="object-contain p-6"
        />
      ) : (
        <span className="max-w-xs text-center text-xl font-black leading-snug text-[var(--wrl-secondary-foreground)] sm:text-2xl">
          {partner.name}
        </span>
      )}
    </div>
  )
}

function PartnershipPath({ title, description, icon: Icon }: { title: string; description: string; icon: ElementType }) {
  return (
    <article className="grid grid-cols-[2.75rem_1fr] gap-4 border-t border-white/12 py-6 first:border-t-0 first:pt-0 last:pb-0">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--wrl-accent-gold)] text-[var(--wrl-accent-gold-foreground)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-white">{title}</h3>
        <p className="mt-2 leading-7 text-white/70">{description}</p>
      </div>
    </article>
  )
}

export default function PartnersPage() {
  return (
    <main className="bg-[var(--wrl-page-background)] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/images/partnershipBG.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-black/60" />
        <div className="absolute inset-0 -z-10 bg-[image:var(--wrl-hero-overlay)]" />
        <div className="wrl-premium-grid absolute inset-0 -z-10 opacity-25" />

        <div className="wrl-shell-wide pb-16 pt-28 sm:pb-18 sm:pt-32 lg:pb-20">
          <div className="max-w-4xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Working Together</p>
            <h1 className="wrl-page-title mt-5 max-w-4xl text-balance text-white [overflow-wrap:anywhere]">
              Our Partners
            </h1>
            <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-white/84 sm:text-lg sm:leading-9">
              Wantok Radio Light is strengthened by churches, broadcasters, technical ministries, program partners, sponsors, and community supporters.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="wrl-button-primary group">
                Become A Partner
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link href="/support-us" className="wrl-button-secondary">Support WRL</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrl-section-light wrl-section">
        <div className="wrl-shell grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-end lg:gap-16">
          <div>
            <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Partnership</p>
            <h2 className="wrl-section-title mt-4 text-balance text-[var(--wrl-secondary-foreground)]">
              Ministry is strengthened through shared service
            </h2>
          </div>
          <div className="border-l-2 border-[var(--wrl-accent-gold)] pl-5 sm:pl-7">
            <p className="text-base leading-8 text-[#34423d] sm:text-lg sm:leading-9">
              WRL depends on practical help, technical skill, prayer, sponsorship, and community encouragement. These relationships support Christian broadcasting and trusted programming for listeners across Papua New Guinea.
            </p>
          </div>
        </div>
      </section>

      <section className="wrl-section-brand wrl-section">
        <div className="wrl-shell">
          <div className="max-w-3xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Strategic Partners</p>
            <h2 className="wrl-section-title mt-4 text-balance">Key ministry relationships</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/74">
              These partners have helped shape the ministry through broadcasting, technical support, and Christian partnership.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {strategicPartners.map((partner, index) => (
              <article
                key={partner.name}
                className="rounded-lg border border-white/14 bg-white/[0.055] p-4 shadow-[var(--wrl-shadow-soft)] transition-colors duration-200 hover:border-[var(--wrl-border-strong)] sm:p-5"
              >
                <PartnerLogo partner={partner} priority={index < 3} />
                <h3 className="px-2 pb-2 pt-6 text-xl font-black leading-snug text-white sm:text-2xl">
                  {partner.name}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-light wrl-section">
        <div className="wrl-shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end lg:gap-16">
            <div>
              <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Program Partners</p>
              <h2 className="wrl-section-title mt-4 text-balance text-[var(--wrl-secondary-foreground)]">
                Christian programs for daily encouragement
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[#44514c] sm:text-lg">
              Trusted ministry partners provide Bible teaching, family encouragement, stories, and discipleship content.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {programPartners.map((partner) => (
              <article
                key={partner.name}
                className="flex flex-col rounded-lg border border-black/10 bg-[#e9ece8] p-4 shadow-[var(--wrl-shadow-soft)] transition-colors duration-200 hover:border-black/20"
              >
                <PartnerLogo partner={partner} />
                <h3 className="px-1 pb-2 pt-5 text-lg font-extrabold leading-snug text-[var(--wrl-secondary-foreground)]">
                  {partner.name}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-dark wrl-section">
        <div className="wrl-shell grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <div>
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">More Supporters</p>
            <h2 className="wrl-section-title mt-4 text-balance">Practical support for reliable ministry</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/72">
              Technical partners and community supporters contribute through practical help, prayer, sponsorship, and encouragement.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-lg border border-white/12 bg-white/12 sm:grid-cols-2">
            {supporters.map(({ title, description, icon: Icon }) => (
              <article key={title} className="bg-[var(--wrl-surface)] p-6 sm:p-7">
                <Icon className="h-6 w-6 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-extrabold text-white">{title}</h3>
                <p className="mt-3 leading-7 text-white/68">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-brand wrl-section">
        <div className="wrl-shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)] lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Become A Partner</p>
            <h2 className="wrl-section-title mt-4 text-balance">Partner with Wantok Radio Light</h2>
            <p className="mt-5 text-base leading-8 text-white/74 sm:text-lg">
              Partnership helps WRL keep Christian radio strong, practical, and accessible for PNG listeners.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="wrl-button-primary group">
                Contact WRL
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link href="/support-us" className="wrl-button-secondary">Support Us</Link>
            </div>
          </div>
          <div className="rounded-lg border border-white/14 bg-white/[0.055] p-6 sm:p-8">
            {partnershipPaths.map((path) => <PartnershipPath key={path.title} {...path} />)}
          </div>
        </div>
      </section>
    </main>
  )
}
