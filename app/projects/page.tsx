import { Antenna, Building2, Globe2, HandHeart, RadioTower, Smartphone, Wrench } from "lucide-react"
import { CTASection, FeaturePanel, InfoCard, LightCard, PageHero, SectionHeading } from "@/components/sections/PublicPageSections"

const categories = [
  { title: "Shortwave Expansion", description: "Strengthening wider broadcast reach for remote listeners.", icon: RadioTower },
  { title: "FM Coverage Expansion", description: "Planning for stronger local broadcast access where possible.", icon: Antenna },
  { title: "Digital Ministry", description: "Improving online listening, media, and ministry communication.", icon: Globe2 },
  { title: "Studio Upgrades", description: "Keeping the broadcast home reliable for daily ministry.", icon: Wrench },
  { title: "Mobile App Improvements", description: "Helping more listeners stay connected on mobile devices.", icon: Smartphone },
  { title: "Community Outreach", description: "Supporting ministry activity beyond the studio.", icon: HandHeart },
]

export default function ProjectsPage() {
  return (
    <main className="bg-[#003b36] text-white">
      <PageHero
        eyebrow="Projects"
        title="Ministry Projects"
        description="Wantok Radio Light continues to plan, build, and improve ministry tools that help Christian radio reach more people across Papua New Guinea."
        image="/images/80m.png"
        actions={[
          { label: "Help With Projects", href: "/support-us" },
          { label: "Talk With WRL", href: "/contact" },
        ]}
      />

      <section className="px-6 py-20">
        <FeaturePanel
          eyebrow="Featured Project"
          title="Shortwave Expansion"
          image="/images/tower.png"
          imageAlt="Broadcast tower"
          description={
            <p>
              Shortwave helps WRL reach listeners beyond easy FM coverage, especially in remote communities where terrain and distance can make communication difficult.
            </p>
          }
        />
      </section>

      <section className="bg-[#071512] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Broadcast Coverage Expansion"
            title="Planning for stronger radio reach"
            description="FM, shortwave, and future broadcast planning all support the same mission: keep Christian radio accessible to listeners who need encouragement."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <InfoCard title="FM Coverage Expansion" description="Future local broadcast improvements as resources and licensing allow." icon={Antenna} />
            <InfoCard title="Shortwave Support" description="Ongoing attention to remote listening and reception quality." icon={RadioTower} />
            <InfoCard title="Engineering Planning" description="Careful technical planning for reliable broadcast ministry." icon={Wrench} />
          </div>
        </div>
      </section>

      <section className="bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Project Categories"
            title="Where support can make a difference"
            description="Each project area helps WRL serve listeners with clearer, stronger, and more accessible ministry."
            tone="light"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((project) => (
              <LightCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          <InfoCard
            title="Digital Ministry Projects"
            description="Better online listening, web communication, and media access for supporters and listeners."
            icon={Globe2}
          />
          <InfoCard
            title="Studio & Infrastructure Projects"
            description="Studio upgrades, equipment care, and infrastructure improvements for daily broadcasting."
            icon={Building2}
          />
          <InfoCard
            title="Community Impact Projects"
            description="Outreach and listener-focused ministry that brings hope beyond the broadcast desk."
            icon={HandHeart}
          />
        </div>
      </section>

      <section className="bg-[#071512] px-6 py-20">
        <FeaturePanel
          eyebrow="Vision 2030"
          title="A stronger Christian media ministry for the next generation"
          image="/images/mainwall.png"
          imageAlt="Wantok Radio Light studio"
          reverse
          description={
            <p>
              Vision 2030 looks toward stronger coverage, improved digital ministry, reliable studios, and deeper partnerships so WRL can continue serving PNG with the Gospel for years to come.
            </p>
          }
        />
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
