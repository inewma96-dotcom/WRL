import { HandHeart, Mail, MapPin, Phone } from "lucide-react"
import PledgeForm from "@/components/forms/PledgeForm"

export const metadata = {
  title: "Share-a-thon Pledge | Wantok Radio Light",
  description: "Make a Share-a-thon pledge to support Wantok Radio Light's Christian broadcasting ministry.",
}

export default function PledgePage() {
  return (
    <main className="bg-[var(--wrl-page-background)]">
      <section className="wrl-section-brand border-b border-white/12 pb-14 pt-28 sm:pb-16 sm:pt-32">
        <div className="wrl-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-4xl">
            <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Share-a-thon</p>
            <h1 className="wrl-page-title mt-4 text-balance text-white">Pledge Form</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              Stand with Wantok Radio Light and help us carry the Gospel to towns and remote communities across Papua New Guinea.
            </p>
          </div>
          <HandHeart className="hidden h-16 w-16 text-[var(--wrl-accent-gold)] lg:block" aria-hidden="true" />
        </div>
      </section>

      <section className="wrl-section-light py-12 sm:py-16 lg:py-20">
        <div className="wrl-shell grid gap-10 lg:grid-cols-[minmax(250px,0.42fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <aside className="lg:sticky lg:top-28">
            <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Wantok Radio Light</p>
            <h2 className="mt-4 text-3xl font-black text-[#071512]">Thank you for standing with us.</h2>
            <p className="mt-4 leading-7 text-[#52605b]">Your pledge supports Christian radio ministry throughout Papua New Guinea and overseas.</p>
            <div className="mt-7 space-y-4 border-t border-black/10 pt-6 text-sm font-semibold text-[#44514c]">
              <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-[#007a52]" aria-hidden="true" />P.O. Box 1273, Port Moresby, NCD</p>
              <p className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-[#007a52]" aria-hidden="true" />(675) 326 0946</p>
              <p className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-[#007a52]" aria-hidden="true" />wantok@wantokradio.org</p>
            </div>
          </aside>
          <PledgeForm />
        </div>
      </section>
    </main>
  )
}
