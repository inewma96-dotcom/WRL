import { Globe2, Mail, Radio, RadioTower, Smartphone, Wifi } from "lucide-react"
import { CTASection, FeaturePanel, InfoCard, LightCard, PageHero, SectionHeading } from "@/components/sections/PublicPageSections"

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
    <main className="bg-[#003b36] text-white">
      <PageHero
        eyebrow="Coverage"
        title="Listen Anywhere, Anytime"
        description="Wantok Radio Light reaches listeners through FM radio, shortwave radio, live stream, and mobile listening options."
        image="/images/rural.png"
        actions={[
          { label: "Ways To Listen", href: "#ways-to-listen" },
          { label: "Send Reception Report", href: "/contact" },
        ]}
      />

      <section id="ways-to-listen" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Ways To Listen"
            title="Choose the best way to hear WRL"
            description="Radio remains important for many PNG listeners, while online options help people listen from more places."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {listeningWays.map((way) => (
              <InfoCard key={way.title} {...way} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071512] px-6 py-20">
        <FeaturePanel
          eyebrow="FM Coverage"
          title="Port Moresby 93.9 FM"
          image="/images/playout.png"
          imageAlt="Wantok Radio Light broadcast studio"
          description={
            <p>
              WRL continues to serve local listeners through FM broadcast coverage, with Port Moresby 93.9 FM as a key listening point for the capital city.
            </p>
          }
        />
      </section>

      <section className="bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Shortwave Coverage"
            title="Reaching remote communities"
            description="Shortwave remains useful where terrain, distance, and local infrastructure make ordinary media access difficult."
            tone="light"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <LightCard title="Frequency" description="7325 kHz" icon={RadioTower} />
            <LightCard title="Band" description="41 metre band" icon={Radio} />
            <LightCard title="Transmission Site" description="Mt Hagen" icon={RadioTower} />
            <LightCard title="Purpose" description="Reaching remote communities with Christian radio." icon={Globe2} />
          </div>
        </div>
      </section>

      <section className="bg-[#071512] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Online & Reports"
            title="Mobile listening and reception reports"
            description="Listeners can use online options and send reception reports when they hear WRL by shortwave."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {onlineOptions.map((option) => (
              <InfoCard key={option.title} {...option} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Listen Now"
        title="Tune in today"
        description="Use the floating Listen player on the side of the site, or contact WRL for reception reports and QSL information."
        primary={{ label: "Ways To Listen", href: "#ways-to-listen" }}
        secondary={{ label: "Contact WRL", href: "/contact" }}
      />
    </main>
  )
}
