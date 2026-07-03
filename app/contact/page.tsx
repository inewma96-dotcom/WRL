import ContactMapSection from "@/components/ContactMapSection"
import ContactForm from "@/components/forms/contact-form"
import { CTASection, InfoCard, LightCard, PageHero, SectionHeading } from "@/components/sections/PublicPageSections"
import { HelpCircle, Mail, MapPin, MessageSquareHeart, Phone, Radio, Smartphone, Users } from "lucide-react"

const team = [
  { title: "Billy Yasi", description: "General Manager", icon: Users },
  { title: "Alois Ok", description: "Business Development Manager", icon: Users },
  { title: "Linda Nangunduo", description: "Program Director", icon: Radio },
  { title: "Dorish Asang", description: "Administration & Finance", icon: Users },
]

const categories = [
  { title: "Prayer Request", description: "Share a request for the WRL team to pray with you.", icon: MessageSquareHeart },
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
    description: "Yes. Use the contact form and choose prayer request in your message.",
  },
]

export default function ContactPage() {
  return (
    <main className="bg-[#003b36] text-white">
      <PageHero
        eyebrow="Contact"
        title="Contact Wantok Radio Light"
        description="Reach out for prayer, testimonies, sponsorship, partnership, reception reports, program enquiries, and ministry support."
        image="/images/entrence.png"
        actions={[
          { label: "Send A Message", href: "#contact-form" },
          { label: "Support WRL", href: "/support-us" },
        ]}
      />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Contact Information"
            title="We would love to hear from you"
            description="Use these details for office, studio, sponsorship, partnership, and reception enquiries."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard title="Address" description="Gerehu Stage 2, Sivari Road, Port Moresby, Papua New Guinea" icon={MapPin} />
            <InfoCard title="Phone" description="(675) 326 0946, (675) 326 2933" icon={Phone} />
            <InfoCard title="Studio Mobile" description="(675) 73560346" icon={Smartphone} />
            <InfoCard title="Email" description="wantok@wantokradio.org" icon={Mail} />
          </div>
        </div>
      </section>

      <section className="bg-[#071512] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Team Directory"
            title="Send your enquiry to the right team"
            description="These team roles can help guide messages about station leadership, business, programs, and administration."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {team.map((person) => (
              <InfoCard key={person.title} {...person} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact-form" className="bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Contact Categories"
              title="How can WRL help?"
              description="Tell us what kind of message you are sending so the right person can respond."
              tone="light"
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {categories.map((category) => (
                <LightCard key={category.title} {...category} />
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Map"
            title="Find Wantok Radio Light"
            description="The map uses the existing Leaflet setup already included in the project."
          />
          <div className="mt-10">
            <ContactMapSection />
          </div>
        </div>
      </section>

      <section className="bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Quick answers"
            description="A few common questions before you contact or visit the station."
            tone="light"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {faqs.map((faq) => (
              <LightCard key={faq.title} {...faq} icon={HelpCircle} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Final CTA"
        title="Connect with the ministry"
        description="Send a message, share a testimony, ask about sponsorship, or let WRL know how you are listening."
        primary={{ label: "Send A Message", href: "#contact-form" }}
        secondary={{ label: "Support Us", href: "/support-us" }}
      />
    </main>
  )
}
