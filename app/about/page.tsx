import { BookOpen, HeartHandshake, History, Radio, ShieldCheck, Users } from "lucide-react"
import { CTASection, FeaturePanel, InfoCard, LightCard, PageHero, SectionHeading } from "@/components/sections/PublicPageSections"

const values = [
  { title: "Faithfulness", description: "We serve Christ and share biblical truth with humility and care.", icon: ShieldCheck },
  { title: "Encouragement", description: "We speak hope to families, churches, and communities across PNG.", icon: HeartHandshake },
  { title: "Service", description: "We use radio and media to support people in their daily walk with God.", icon: Users },
]

const impact = [
  { title: "Daily ministry", description: "Christian music, prayer, Bible teaching, and community programming.", icon: BookOpen },
  { title: "Nationwide heart", description: "A ministry for urban listeners and remote communities alike.", icon: Radio },
  { title: "Partner supported", description: "Sustained by churches, listeners, sponsors, and ministry friends.", icon: HeartHandshake },
]

export default function AboutPage() {
  return (
    <main className="bg-[#003b36] text-white">
      <PageHero
        eyebrow="About Us"
        title="About Wantok Radio Light"
        description="Wantok Radio Light is a Christian radio ministry serving Papua New Guinea with Gospel-centered programs, prayer, worship, family encouragement, and community information."
        image="/images/hero.jpg"
        actions={[
          { label: "View Programs", href: "/programs" },
          { label: "Support the Ministry", href: "/support-us" },
        ]}
      />

      <section className="px-6 py-20">
        <FeaturePanel
          eyebrow="Who We Are"
          title="PNG's Christian radio station"
          image="/images/bible.png"
          imageAlt="Bible and Christian broadcasting ministry"
          description={
            <p>
              WRL exists to share Jesus Christ through radio and media. The station serves listeners with simple, warm, and practical programs that help people grow in faith and find encouragement for everyday life.
            </p>
          }
        />
      </section>

      <section className="bg-[#071512] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <InfoCard
            eyebrow="Vision"
            title="Reach PNG with the hope of Jesus Christ"
            description="To see people, families, and communities encouraged and transformed through Christian radio and media."
            icon={Radio}
          />
          <InfoCard
            eyebrow="Mission"
            title="Broadcast biblical truth in a clear and accessible way"
            description="To provide Christian programs, prayer, teaching, worship, and community-focused media for listeners across Papua New Guinea."
            icon={BookOpen}
          />
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Core Values"
            title="What guides the ministry"
            description="The work is shaped by faith in Christ, love for people, and a desire to serve PNG well."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <InfoCard key={value.title} {...value} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Ministry Impact"
            title="Encouraging listeners every day"
            description="The station continues because people pray, give, listen, share, and partner with the ministry."
            tone="light"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {impact.map((item) => (
              <LightCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <FeaturePanel
          eyebrow="Short History Preview"
          title="Serving PNG since 2002"
          image="/images/timeline.png"
          imageAlt="Wantok Radio Light history"
          reverse
          description={
            <p>
              Wantok Radio Light began broadcasting in Port Moresby in 2002 and has grown through the prayers, giving, and partnership of churches, listeners, and Christian organizations. The story continues as WRL strengthens radio, shortwave, online, and community ministry.
            </p>
          }
        >
          <div className="mt-6 inline-flex items-center gap-3 rounded border border-yellow-300/35 bg-white/[0.06] px-4 py-3 text-sm font-bold text-yellow-300">
            <History className="h-4 w-4" aria-hidden="true" />
            A longer project history belongs with ministry projects and station updates.
          </div>
        </FeaturePanel>
      </section>

      <CTASection
        eyebrow="Partner With Us"
        title="Support the ministry"
        description="Your prayers and practical support help keep Christian radio available for listeners across PNG."
        primary={{ label: "Support the Ministry", href: "/support-us" }}
        secondary={{ label: "Contact WRL", href: "/contact" }}
      />
    </main>
  )
}
