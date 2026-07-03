import { BadgeDollarSign, HandHeart, HeartHandshake, Megaphone, Radio, UserRoundPlus, Users } from "lucide-react"
import { CTASection, InfoCard, LightCard, PageHero, SectionHeading } from "@/components/sections/PublicPageSections"

const waysToSupport = [
  { title: "Pray", description: "Pray for listeners, staff, programs, equipment, and open doors for the Gospel.", icon: HandHeart },
  { title: "Donate", description: "Give toward daily operations, broadcast costs, projects, and ministry needs.", icon: BadgeDollarSign },
  { title: "Sponsor a Program", description: "Help keep life-giving Christian programs on air for PNG listeners.", icon: Radio },
  { title: "Become a Partner", description: "Stand with WRL through church, ministry, technical, or business partnership.", icon: HeartHandshake },
  { title: "Share-a-thon", description: "Support fundraising seasons that help keep the station strong.", icon: Users },
  { title: "Volunteer", description: "Offer practical help, skills, encouragement, and ministry support.", icon: UserRoundPlus },
  { title: "Advertise", description: "Connect with listeners through appropriate announcements and sponsorship.", icon: Megaphone },
]

export default function SupportUsPage() {
  return (
    <main className="bg-[#003b36] text-white">
      <PageHero
        eyebrow="Support Us"
        title="Support the Ministry"
        description="Your prayers, giving, sponsorship, and partnership help Wantok Radio Light continue broadcasting Christian hope across Papua New Guinea."
        image="/images/supportbg.png"
        actions={[
          { label: "Contact Sponsorship", href: "/contact" },
          { label: "Become A Partner", href: "/partners" },
        ]}
      />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Why Support WRL"
            title="Christian radio can reach people where other ministry cannot easily go"
            description="Radio brings prayer, worship, biblical teaching, and encouragement into homes, workplaces, vehicles, villages, and remote communities."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <InfoCard title="Listeners Need Hope" description="Many people tune in for comfort, truth, prayer, and encouragement." icon={HandHeart} />
            <InfoCard title="Programs Need Support" description="Daily broadcast ministry depends on faithful giving and sponsorship." icon={Radio} />
            <InfoCard title="Partnership Multiplies Impact" description="Churches, families, sponsors, and donors help the Gospel go further." icon={HeartHandshake} />
          </div>
        </div>
      </section>

      <section className="bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Ways To Support"
            title="Choose a practical way to stand with the ministry"
            description="Every form of support matters, from prayer to program sponsorship."
            tone="light"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {waysToSupport.map((way) => (
              <LightCard key={way.title} {...way} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071512] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Sponsorship Opportunities"
            title="Sponsor programs, projects, and community outreach"
            description="Sponsors can help with program airtime, broadcast operations, project needs, Share-a-thon, mobile listening, and community ministry."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <InfoCard title="Program Sponsorship" description="Support local and international Christian programs on air." icon={Radio} />
            <InfoCard title="Project Sponsorship" description="Help with equipment, studio upgrades, digital ministry, and coverage projects." icon={BadgeDollarSign} />
            <InfoCard title="Ministry Partnership" description="Partner through prayer, funding, services, or shared ministry opportunities." icon={UserRoundPlus} />
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Donation CTA"
        title="Ready to support Wantok Radio Light?"
        description="Contact WRL about donations, sponsorship, partnership, Share-a-thon support, volunteering, or advertising."
        primary={{ label: "Contact for Sponsorship", href: "/contact" }}
        secondary={{ label: "Our Partners", href: "/partners" }}
      />
    </main>
  )
}
