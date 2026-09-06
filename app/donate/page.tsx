import Link from "next/link"
import Image from "next/image"
import { Building2, HeartHandshake, Landmark } from "lucide-react"

const bankAccounts = [
  {
    bank: "BSP",
    name: "Wantok Radio Light",
    branch: "Port Moresby",
    accountNumber: "Contact WRL to confirm",
  },
  {
    bank: "Kina Bank",
    name: "Wantok Radio Light",
    branch: "Port Moresby",
    accountNumber: "Contact WRL to confirm",
  },
]

export default function DonatePage() {
  return (
    <main className="bg-[#071512] text-white">
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-300">Support Wantok Radio Light</p>
            <h1 className="mt-5 text-5xl font-black leading-tight tracking-normal md:text-7xl">
              Support Christian radio through bank deposit.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              Your gift helps WRL keep worship, prayer, Bible teaching, news, and encouragement on air for families across PNG. For now, please give directly through BSP or Kina Bank.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#bank-details" className="inline-flex items-center gap-2 rounded bg-yellow-300 px-6 py-4 font-black uppercase tracking-normal text-[#071512] hover:bg-white">
                View bank details
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </a>
              <Link href="/support-us" className="inline-flex items-center gap-2 rounded border border-white/30 px-6 py-4 font-black uppercase tracking-normal text-white hover:border-yellow-300 hover:text-yellow-300">
                Ways to support
              </Link>
            </div>
            <div className="mt-8 flex gap-3 rounded-lg border border-yellow-300/25 bg-yellow-300/10 p-4 text-sm leading-6 text-white/78">
              <Landmark className="mt-1 h-5 w-5 shrink-0 text-yellow-300" aria-hidden="true" />
              <p>Online giving is not available on the website at this time. Please use the bank details below or contact WRL before making a transfer.</p>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/10 bg-[#082b52]">
            <Image src="/images/supportbg.png" alt="WRL ministry support" fill className="object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071512] via-[#071512]/20 to-transparent" />
            <div className="absolute bottom-0 p-8">
              <h2 className="text-3xl font-black">Support the ministry</h2>
              <p className="mt-3 max-w-md text-white/78">Contact WRL about donations, ministry support, program sponsorships, project gifts, and future giving options.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="bank-details" className="bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d71920]">Bank Details</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Give through BSP or Kina Bank
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#26332f]">
            Use one of the bank options below for direct deposits and transfers. Please include your name or purpose in the transfer description where possible.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {bankAccounts.map((account) => (
              <article key={account.bank} className="rounded-lg border border-[#071512]/10 bg-white p-6 shadow-[0_18px_48px_rgba(7,21,18,0.12)]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-yellow-300 text-[#071512]">
                    <Building2 className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-normal text-[#d71920]">Bank Transfer</p>
                    <h3 className="text-2xl font-black">{account.bank}</h3>
                  </div>
                </div>
                <dl className="mt-6 grid gap-3 text-sm">
                  <BankDetail label="Account Name" value={account.name} />
                  <BankDetail label="Branch" value={account.branch} />
                  <BankDetail label="Account Number" value={account.accountNumber} />
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-[#d71920]/20 bg-[#d71920]/8 p-5 text-sm font-semibold leading-7 text-[#26332f]">
            Please confirm the account number with Wantok Radio Light before depositing funds.
          </div>
        </div>
      </section>
    </main>
  )
}

function BankDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md bg-[#f8f6ef] p-4 sm:grid-cols-[150px_1fr] sm:gap-4">
      <dt className="font-black text-[#003b36]">{label}</dt>
      <dd className="font-semibold text-[#26332f]">{value}</dd>
    </div>
  )
}
