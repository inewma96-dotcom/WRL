import type { ElementType } from "react"
import Image from "next/image"
import Link from "next/link"
import ContactMapSection from "@/components/ContactMapSection"
import ContactForm from "@/components/forms/contact-form"
import {
  ArrowRight,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquareHeart,
  Phone,
  Radio,
  Smartphone,
  Users,
} from "lucide-react"

const team = [
  { title: "Billy Yasi", description: "General Manager", icon: Users },
  { title: "Alois Ok", description: "Business Development Manager", icon: Users },
  { title: "Linda Nangunduo", description: "Program Director", icon: Radio },
  { title: "Dorish Asang", description: "Administration & Finance", icon: Users },
]

const categories = [
  {
    title: "Prayer Request",
    description: "Share a request through WRL's dedicated prayer-request page.",
    icon: MessageSquareHeart,
    href: "/prayer-request",
    label: "Share a prayer request",
  },
  { title: "Share Your Testimony", description: "Tell the station how God is working in your life.", icon: MessageSquareHeart },
  { title: "Advertising & Sponsorship", description: "Ask about announcements, sponsorship, or program support.", icon: Radio },
  { title: "Partnership Opportunities", description: "Connect about church, ministry, technical, or community partnership.", icon: Users },
  { title: "Reception Reports / QSL", description: "Send shortwave reception reports and QSL questions.", icon: Mail },
]

const faqs = [
  {
    title: "Where is Wantok Radio Light located?",
    description: "Gerehu Stage 2, Sivari Road, Port Moresby, Papua New Guinea.",
  },
  {
    title: "How can I contact the studio?",
    description: "Call the studio mobile on (675) 73560346 or contact the office lines listed above.",
  },
  {
    title: "Can I send a prayer request?",
    description: "Yes. Use WRL's dedicated prayer-request page to share your request with the prayer team.",
    href: "/prayer-request",
  },
]

type ContactMethodProps = {
  title: string
  icon: ElementType
  children: React.ReactNode
}

function ContactMethod({ title, icon: Icon, children }: ContactMethodProps) {
  return (
    <article className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 border-t border-black/10 py-6 first:border-t-0 first:pt-0 last:pb-0">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--wrl-primary)] text-[var(--wrl-accent-gold)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#52605b]">{title}</h3>
        <div className="mt-2 text-base font-bold leading-7 text-[var(--wrl-secondary-foreground)]">{children}</div>
      </div>
    </article>
  )
}

export default function ContactPage() {
  return (
    <main className="bg-[var(--wrl-page-background)] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/images/entrence.png"
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
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Get in Touch</p>
            <h1 className="wrl-page-title mt-5 max-w-4xl text-balance text-white [overflow-wrap:anywhere]">
              Contact Wantok Radio Light
            </h1>
            <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-white/84 sm:text-lg sm:leading-9">
              Reach out for testimonies, sponsorship, partnership, reception reports, program enquiries, and ministry support.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a href="#contact-form" className="wrl-button-primary group">
                Send A Message
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
              <p className="border-l border-white/25 pl-4 text-sm font-bold text-white/76">
                93.9 FM <span className="font-medium text-white/58">— Port Moresby</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-form" className="wrl-section-light scroll-mt-36 py-16 sm:py-20 lg:py-24">
        <div className="wrl-shell grid gap-12 lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-16">
          <div>
            <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Contact Information</p>
            <h2 className="wrl-section-title mt-4 text-balance text-[var(--wrl-secondary-foreground)]">
              We would love to hear from you
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#44514c]">
              Use these details for office, studio, sponsorship, partnership, and reception enquiries.
            </p>
            <div className="mt-9 rounded-lg border border-black/10 bg-white p-6 shadow-[var(--wrl-shadow-soft)] sm:p-8">
              <ContactMethod title="Address" icon={MapPin}>
                <address className="not-italic">Gerehu Stage 2, Sivari Road, Port Moresby, Papua New Guinea</address>
              </ContactMethod>
              <ContactMethod title="Office Phones" icon={Phone}>
                <div className="flex flex-col items-start gap-1">
                  <a href="tel:+6753260946" className="rounded-sm hover:text-[var(--wrl-primary)]">(675) 326 0946</a>
                  <a href="tel:+6753262933" className="rounded-sm hover:text-[var(--wrl-primary)]">(675) 326 2933</a>
                </div>
              </ContactMethod>
              <ContactMethod title="Studio Mobile" icon={Smartphone}>
                <a href="tel:+67573560346" className="rounded-sm hover:text-[var(--wrl-primary)]">(675) 73560346</a>
              </ContactMethod>
              <ContactMethod title="Email" icon={Mail}>
                <a href="mailto:wantok@wantokradio.org" className="break-all rounded-sm hover:text-[var(--wrl-primary)]">
                  wantok@wantokradio.org
                </a>
              </ContactMethod>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="wrl-section-brand wrl-section">
        <div className="wrl-shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end lg:gap-16">
            <div>
              <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Contact Categories</p>
              <h2 className="wrl-section-title mt-4 text-balance">How can WRL help?</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/74 sm:text-lg">
              Tell us what kind of message you are sending so the right person can respond.
            </p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/12 bg-white/12 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ title, description, icon: Icon, href, label }) => (
              <article key={title} className="flex min-h-52 flex-col bg-[var(--wrl-surface)] p-6 sm:p-7">
                <Icon className="h-6 w-6 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-extrabold text-white">{title}</h3>
                <p className="mt-3 leading-7 text-white/68">{description}</p>
                {href ? (
                  <Link href={href} className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-5 text-sm font-extrabold text-[var(--wrl-accent-gold)]">
                    {label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-light wrl-section">
        <div className="wrl-shell">
          <div className="max-w-3xl">
            <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Team Directory</p>
            <h2 className="wrl-section-title mt-4 text-balance text-[var(--wrl-secondary-foreground)]">
              Send your enquiry to the right team
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#44514c]">
              These team roles can help guide messages about station leadership, business, programs, and administration.
            </p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map(({ title, description, icon: Icon }) => (
              <article key={title} className="bg-white p-6 sm:p-7">
                <Icon className="h-6 w-6 text-[var(--wrl-live-red)]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-extrabold text-[var(--wrl-secondary-foreground)]">{title}</h3>
                <p className="mt-2 leading-7 text-[#52605b]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-dark wrl-section">
        <div className="wrl-shell">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-end lg:gap-16">
            <div>
              <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Location</p>
              <h2 className="wrl-section-title mt-4 text-balance">Find Wantok Radio Light</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/72">
              Wantok Radio Light is located at Gerehu Stage 2, Sivari Road, Port Moresby, Papua New Guinea.
            </p>
          </div>
          <div className="mt-10"><ContactMapSection /></div>
        </div>
      </section>

      <section className="wrl-section-light wrl-section">
        <div className="wrl-shell grid gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:gap-16">
          <div>
            <p className="wrl-eyebrow text-[var(--wrl-live-red)]">FAQ</p>
            <h2 className="wrl-section-title mt-4 text-balance text-[var(--wrl-secondary-foreground)]">Quick answers</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#44514c]">
              A few common questions before you contact or visit the station.
            </p>
          </div>
          <div className="divide-y divide-black/10 border-y border-black/10">
            {faqs.map((faq) => (
              <article key={faq.title} className="grid grid-cols-[2.5rem_1fr] gap-4 py-6">
                <HelpCircle className="mt-0.5 h-6 w-6 text-[var(--wrl-live-red)]" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-extrabold text-[var(--wrl-secondary-foreground)]">{faq.title}</h3>
                  <p className="mt-2 leading-7 text-[#52605b]">{faq.description}</p>
                  {faq.href ? (
                    <Link href={faq.href} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[var(--wrl-primary)]">
                      Prayer Request
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wrl-section-brand py-12 sm:py-16">
        <div className="wrl-shell-wide">
          <div className="grid gap-8 border-y border-white/15 py-9 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:py-11">
            <div className="max-w-3xl">
              <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Connect With WRL</p>
              <h2 className="wrl-section-title mt-3 text-balance">Connect with the ministry</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/74">
                Send a message, share a testimony, ask about sponsorship, or let WRL know how you are listening.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#contact-form" className="wrl-button-primary">Send A Message</a>
              <Link href="/support-us" className="wrl-button-secondary">Support Us</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
