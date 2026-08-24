import Link from "next/link"
import Image from "next/image"
import { HeartHandshake, ShieldCheck } from "lucide-react"

export default function DonatePage() {
  return (
    <main className="bg-[#071512] text-white">
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-300">Support Wantok Radio Light</p>
            <h1 className="mt-5 text-5xl font-black leading-tight tracking-normal md:text-7xl">
              Donate securely to Christian radio in Papua New Guinea.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              Your gift helps WRL keep worship, prayer, Bible teaching, news, and encouragement on air for families across PNG.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/checkout?item=general-donation" className="inline-flex items-center gap-2 rounded bg-yellow-300 px-6 py-4 font-black uppercase tracking-normal text-[#071512] hover:bg-white">
                Give now
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href="/checkout?item=broadcast-equipment-project" className="inline-flex items-center gap-2 rounded border border-white/30 px-6 py-4 font-black uppercase tracking-normal text-white hover:border-yellow-300 hover:text-yellow-300">
                Support a project
              </Link>
            </div>
            <div className="mt-8 flex gap-3 rounded-lg border border-sky-300/25 bg-sky-300/10 p-4 text-sm leading-6 text-white/78">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-sky-300" aria-hidden="true" />
              <p>WRL never collects or stores card numbers or CVV. Card details are entered only on the selected bank-hosted payment page.</p>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/10 bg-[#082b52]">
            <Image src="/images/supportbg.png" alt="WRL ministry support" fill className="object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071512] via-[#071512]/20 to-transparent" />
            <div className="absolute bottom-0 p-8">
              <h2 className="text-3xl font-black">Secure hosted checkout</h2>
              <p className="mt-3 max-w-md text-white/78">Donations, ministry support, program sponsorships, project gifts, and future products flow through one server-verified payment system.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
