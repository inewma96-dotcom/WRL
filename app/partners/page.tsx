import Image from "next/image"
import { Church, Handshake, HeartHandshake, Radio, RadioTower, Users } from "lucide-react"
import { CTASection, InfoCard, LightCard, PageHero, SectionHeading } from "@/components/sections/PublicPageSections"

const strategicPartners = [
  { name: "PNG Bible Church", logo: "/images/pngbc.png" },
  { name: "Sonset Solutions", logo: "/images/SonSet.png" },
  { name: "New Life FM", logo: "/images/newlifeFM.png" },
]

const programPartners = [
  "Focus on the Family",
  "Back to the Bible",
  "Reach Beyond",
  "Leading The Way",
  "Women of Hope",
  "Keys for Kids",
  "Champions Arise",
  "Unshackled",
]

export default function PartnersPage() {
  return (
    <main className="bg-[#003b36] text-white">
      <PageHero
        eyebrow="Partners"
        title="Our Partners"
        description="Wantok Radio Light is strengthened by churches, broadcasters, technical ministries, program partners, sponsors, and community supporters."
        image="/images/partnershipBG.png"
        actions={[
          { label: "Become A Partner", href: "/contact" },
          { label: "Support WRL", href: "/support-us" },
        ]}
      />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Strategic Partners"
            title="Key ministry relationships"
            description="These partners have helped shape the ministry through broadcasting, technical support, and Christian partnership."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {strategicPartners.map((partner) => (
              <article key={partner.name} className="rounded-lg border border-white/12 bg-white/[0.06] p-6 text-center shadow-[0_18px_55px_rgba(0,0,0,0.2)] transition hover:-translate-y-2 hover:border-yellow-300/60">
                <div className="relative mx-auto h-32 w-full max-w-56 overflow-hidden rounded bg-white p-5">
                  <Image src={partner.logo} alt={partner.name} fill sizes="224px" className="object-contain p-4" />
                </div>
                <h2 className="mt-6 text-2xl font-black">{partner.name}</h2>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071512] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Program Partners"
            title="Christian programs for daily encouragement"
            description="Trusted ministry partners provide Bible teaching, family encouragement, stories, and discipleship content."
          />
          <div className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {programPartners.map((partner) => (
              <div key={partner} className="rounded border border-white/10 bg-white/[0.06] px-4 py-3 font-semibold text-white/86">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="More Supporters"
            title="Technical partners and community supporters"
            description="WRL depends on practical help, technical skill, prayer, sponsorship, and community encouragement."
            tone="light"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <LightCard title="Technical Partners" description="Broadcast, engineering, and media support for reliable ministry." icon={RadioTower} />
            <LightCard title="Community Supporters" description="Listeners, churches, businesses, and friends who stand with WRL." icon={Users} />
            <LightCard title="Church Partners" description="Churches that pray, support, and share the Gospel vision." icon={Church} />
            <LightCard title="Sponsors" description="Organizations and individuals who sponsor programs and ministry needs." icon={Handshake} />
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          <InfoCard title="Program Partnership" description="Share trusted Christian teaching and family content with PNG listeners." icon={Radio} />
          <InfoCard title="Technical Partnership" description="Help improve broadcast systems, digital media, and infrastructure." icon={RadioTower} />
          <InfoCard title="Ministry Partnership" description="Pray, sponsor, give, volunteer, or connect WRL with churches and communities." icon={HeartHandshake} />
        </div>
      </section>

      <CTASection
        eyebrow="Become A Partner"
        title="Partner with Wantok Radio Light"
        description="Partnership helps WRL keep Christian radio strong, practical, and accessible for PNG listeners."
        primary={{ label: "Contact WRL", href: "/contact" }}
        secondary={{ label: "Support Us", href: "/support-us" }}
      />
    </main>
  )
}
