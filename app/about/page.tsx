import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, HandHeart, HeartHandshake, Radio, ShieldCheck, Users } from "lucide-react"

const values = [
  { title: "Faithfulness", description: "We serve Christ and share biblical truth with humility and care.", icon: ShieldCheck },
  { title: "Encouragement", description: "We speak hope to families, churches, and communities across PNG.", icon: HeartHandshake },
  { title: "Service", description: "We use radio and media to support people in their daily walk with God.", icon: Users },
]

const ministryWork = [
  { title: "Daily ministry", description: "Christian music, prayer, Bible teaching, and community programming.", icon: BookOpen },
  { title: "Nationwide heart", description: "A ministry for urban listeners and remote communities alike.", icon: Radio },
  { title: "Partner supported", description: "Sustained by churches, listeners, sponsors, and ministry friends.", icon: HandHeart },
]

export default function AboutPage() {
  return (
    <main className="bg-[var(--wrl-page-background)] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="-z-30 object-cover object-[center_58%]" />
        <div className="absolute inset-0 -z-20 bg-black/60" />
        <div className="absolute inset-0 -z-10 bg-[image:var(--wrl-hero-overlay)]" />
        <div className="wrl-premium-grid absolute inset-0 -z-10 opacity-25" />
        <div className="wrl-shell-wide pb-16 pt-28 sm:pb-18 sm:pt-32 lg:pb-20">
          <div className="max-w-4xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">About Wantok Radio Light</p>
            <h1 className="wrl-page-title mt-5 max-w-4xl text-balance text-white [overflow-wrap:anywhere]">
              Faith, hope and light through radio
            </h1>
            <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-white/84 sm:text-lg sm:leading-9">
              Wantok Radio Light is a Christian radio ministry serving Papua New Guinea with Gospel-centered programs, prayer, worship, family encouragement, and community information.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/programs" className="wrl-button-primary group">
                View Programs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <p className="border-l border-white/25 pl-4 text-sm font-bold text-white/76">
                93.9 FM <span className="font-medium text-white/58">— Port Moresby</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrl-section-light wrl-section">
        <div className="wrl-shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Who We Are</p>
            <h2 className="wrl-section-title mt-4 text-balance text-[var(--wrl-secondary-foreground)]">PNG&apos;s Christian radio station</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-[#34423d] sm:text-lg">
              <p>WRL exists to share Jesus Christ through radio and media. The station serves listeners with simple, warm, and practical programs that help people grow in faith and find encouragement for everyday life.</p>
              <p>Through Christian music, prayer, Bible teaching, worship, and community-focused programming, the ministry seeks to remain accessible to families, churches, and communities across Papua New Guinea.</p>
            </div>
          </div>
          <figure>
            <div className="wrl-shadow-elevated relative aspect-[4/5] overflow-hidden rounded-lg border border-black/10 bg-[#dfe6e1]">
              <Image src="/images/entrence.png" alt="Entrance to Wantok Radio Light in Port Moresby" fill sizes="(max-width: 1024px) 100vw, 480px" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-sm leading-6 text-[#52605b]">Wantok Radio Light, Port Moresby</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrl-section-brand wrl-section">
        <div className="wrl-shell grid gap-10 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/15 bg-black/20 shadow-[var(--wrl-shadow-hero)]">
            <Image src="/images/timeline.png" alt="Wantok Radio Light broadcast identity with radio tower and studio microphone" fill sizes="(max-width: 1024px) 100vw, 480px" className="object-cover" />
          </div>
          <div className="max-w-2xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Our Story</p>
            <h2 className="wrl-section-title mt-4 text-balance">Serving PNG since 2002</h2>
            <p className="mt-6 text-base leading-8 text-white/78 sm:text-lg sm:leading-9">
              Wantok Radio Light began broadcasting in Port Moresby in 2002 and has grown through the prayers, giving, and partnership of churches, listeners, and Christian organizations. The story continues as WRL strengthens radio, shortwave, online, and community ministry.
            </p>
            <div className="mt-8 border-l-2 border-[var(--wrl-accent-gold)] pl-5">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-white">A continuing ministry story</p>
              <p className="mt-2 text-sm leading-7 text-white/66">A longer project history belongs with ministry projects and station updates.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrl-section-light wrl-section">
        <div className="wrl-shell">
          <div className="max-w-3xl">
            <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Purpose &amp; Direction</p>
            <h2 className="wrl-section-title mt-4 text-balance text-[var(--wrl-secondary-foreground)]">Why the ministry exists</h2>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 lg:grid-cols-2">
            <article className="bg-white p-7 sm:p-9 lg:p-11">
              <Radio className="h-7 w-7 text-[var(--wrl-live-red)]" aria-hidden="true" />
              <p className="wrl-eyebrow mt-8 text-[var(--wrl-live-red)]">Vision</p>
              <h3 className="mt-4 text-2xl font-black leading-tight text-[var(--wrl-secondary-foreground)] sm:text-3xl">Reach PNG with the hope of Jesus Christ</h3>
              <p className="mt-5 text-base leading-8 text-[#44514c]">To see people, families, and communities encouraged and transformed through Christian radio and media.</p>
            </article>
            <article className="bg-[#e9ece8] p-7 sm:p-9 lg:p-11">
              <BookOpen className="h-7 w-7 text-[var(--wrl-primary)]" aria-hidden="true" />
              <p className="wrl-eyebrow mt-8 text-[var(--wrl-primary)]">Mission</p>
              <h3 className="mt-4 text-2xl font-black leading-tight text-[var(--wrl-secondary-foreground)] sm:text-3xl">Broadcast biblical truth in a clear and accessible way</h3>
              <p className="mt-5 text-base leading-8 text-[#44514c]">To provide Christian programs, prayer, teaching, worship, and community-focused media for listeners across Papua New Guinea.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="wrl-section-dark wrl-section">
        <div className="wrl-shell grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <div>
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Core Values</p>
            <h2 className="wrl-section-title mt-4 text-balance">What guides the ministry</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/72">The work is shaped by faith in Christ, love for people, and a desire to serve PNG well.</p>
          </div>
          <div className="divide-y divide-white/12 border-y border-white/12">
            {values.map(({ title, description, icon: Icon }, index) => (
              <article key={title} className="grid gap-4 py-6 sm:grid-cols-[3rem_1fr] sm:items-start sm:gap-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--wrl-accent-gold)] text-[var(--wrl-accent-gold-foreground)]"><Icon className="h-5 w-5" aria-hidden="true" /></div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/45">0{index + 1}</p>
                  <h3 className="mt-2 text-xl font-extrabold text-white">{title}</h3>
                  <p className="mt-2 leading-7 text-white/70">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-light wrl-section">
        <div className="wrl-shell grid gap-10 lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-black/10 bg-[#dfe6e1] shadow-[var(--wrl-shadow-soft)]">
            <Image src="/images/bible.png" alt="Open faith journal illustrating Christian teaching, hope, and service" fill sizes="(max-width: 1024px) 100vw, 480px" className="object-cover" />
          </div>
          <div>
            <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Ministry &amp; Broadcasting</p>
            <h2 className="wrl-section-title mt-4 text-balance text-[var(--wrl-secondary-foreground)]">Encouraging listeners every day</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#44514c]">The station continues because people pray, give, listen, share, and partner with the ministry.</p>
            <div className="mt-8 space-y-6">
              {ministryWork.map(({ title, description, icon: Icon }) => (
                <article key={title} className="grid grid-cols-[2.75rem_1fr] gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--wrl-primary)] text-[var(--wrl-accent-gold)]"><Icon className="h-5 w-5" aria-hidden="true" /></div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[var(--wrl-secondary-foreground)]">{title}</h3>
                    <p className="mt-1 leading-7 text-[#52605b]">{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wrl-section-brand py-12 sm:py-16">
        <div className="wrl-shell-wide">
          <div className="grid gap-8 border-y border-white/15 py-9 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:py-11">
            <div className="max-w-3xl">
              <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Partner With Us</p>
              <h2 className="wrl-section-title mt-3 text-balance">Support the ministry</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/74">Your prayers and practical support help keep Christian radio available for listeners across PNG.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/support-us" className="wrl-button-primary group">Support WRL<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></Link>
              <Link href="/contact" className="wrl-button-secondary">Contact WRL</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
