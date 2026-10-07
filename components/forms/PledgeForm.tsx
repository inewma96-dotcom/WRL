"use client"

import { useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

const categories = ["Individual", "Family", "Church", "Group", "Company", "Government", "School"]
const schedules = ["Single", "Fortnightly", "Monthly", "Other"]
const paymentMethods = ["Cash", "Mobile/Internet Banking", "Bank Deposit"]

const initialForm = {
  fullName: "",
  category: "Individual",
  address: "",
  location: "PNG",
  email: "",
  mobile: "",
  church: "",
  congregation: "",
  pledgeAmount: "",
  paymentSchedule: "Single",
  scheduleDetails: "",
  paymentMethod: "Bank Deposit",
  signedName: "",
  pledgeDate: new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Port_Moresby" }).format(new Date()),
}

const inputClass = "mt-2 h-12 w-full rounded-md border border-black/20 bg-white px-3.5 text-base text-[#071512] outline-none transition focus:border-[#007a52] focus:ring-2 focus:ring-[#007a52]/18"

export default function PledgeForm() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  function update(name: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submitPledge(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setMessage("")

    try {
      const response = await fetch("/api/pledges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to submit pledge.")

      setStatus("success")
      setMessage(result.message)
      setForm(initialForm)
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Unable to submit pledge.")
    }
  }

  return (
    <form onSubmit={submitPledge} className="overflow-hidden rounded-lg border border-black/12 bg-white shadow-[var(--wrl-shadow-elevated)]">
      <div className="border-b border-black/10 bg-[#f4f6f3] px-5 py-5 sm:px-8">
        <p className="text-sm font-bold leading-6 text-[#44514c]">
          Complete the form below to make your Share-a-thon pledge. Fields marked with * are required.
        </p>
      </div>

      <div className="space-y-9 p-5 sm:p-8">
        <fieldset>
          <legend className="text-xl font-black text-[#071512]">Your details</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2 text-sm font-bold text-[#34423d]">Full name *
              <input required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} autoComplete="name" />
            </label>
            <ChoiceGroup label="Category *" name="category" options={categories} value={form.category} onChange={(value) => update("category", value)} className="sm:col-span-2" />
            <label className="sm:col-span-2 text-sm font-bold text-[#34423d]">Address
              <input value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} autoComplete="street-address" />
            </label>
            <ChoiceGroup label="Location *" name="location" options={["PNG", "Overseas"]} value={form.location} onChange={(value) => update("location", value)} className="sm:col-span-2" />
            <label className="text-sm font-bold text-[#34423d]">Email *
              <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} autoComplete="email" />
            </label>
            <label className="text-sm font-bold text-[#34423d]">Mobile number *
              <input required type="tel" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} className={inputClass} autoComplete="tel" />
            </label>
            <label className="text-sm font-bold text-[#34423d]">Church
              <input value={form.church} onChange={(e) => update("church", e.target.value)} className={inputClass} />
            </label>
            <label className="text-sm font-bold text-[#34423d]">Congregation
              <input value={form.congregation} onChange={(e) => update("congregation", e.target.value)} className={inputClass} />
            </label>
          </div>
        </fieldset>

        <fieldset className="border-t border-black/10 pt-8">
          <legend className="px-1 text-xl font-black text-[#071512]">Pledge details</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2 text-sm font-bold text-[#34423d]">Pledge amount (PGK) *
              <input required type="number" min="1" step="0.01" value={form.pledgeAmount} onChange={(e) => update("pledgeAmount", e.target.value)} className={inputClass} placeholder="K 0.00" />
            </label>
            <ChoiceGroup label="Payment schedule *" name="paymentSchedule" options={schedules} value={form.paymentSchedule} onChange={(value) => update("paymentSchedule", value)} className="sm:col-span-2" />
            <label className="sm:col-span-2 text-sm font-bold text-[#34423d]">Schedule notes
              <input value={form.scheduleDetails} onChange={(e) => update("scheduleDetails", e.target.value)} className={inputClass} placeholder="Add timing or instalment details" />
            </label>
            <ChoiceGroup label="Payment method *" name="paymentMethod" options={paymentMethods} value={form.paymentMethod} onChange={(value) => update("paymentMethod", value)} className="sm:col-span-2" />
          </div>
        </fieldset>

        <section className="border-t border-black/10 pt-8" aria-labelledby="bank-details-heading">
          <h2 id="bank-details-heading" className="text-xl font-black text-[#071512]">Bank transfer or deposit</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <BankDetails bank="Bank of South Pacific" account="1000908049" branch="088-950" swift="BOSPPGPM" />
            <BankDetails bank="Kina Bank" account="11757718" branch="028-038" swift="KINIPGPG" />
          </div>
          <p className="mt-3 text-sm leading-6 text-[#52605b]">Account name: Wantok Radio Light. Include your name as the payment reference.</p>
        </section>

        <fieldset className="border-t border-black/10 pt-8">
          <legend className="px-1 text-xl font-black text-[#071512]">Confirmation</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-bold text-[#34423d]">Signed name *
              <input required value={form.signedName} onChange={(e) => update("signedName", e.target.value)} className={inputClass} />
            </label>
            <label className="text-sm font-bold text-[#34423d]">Date *
              <input required type="date" value={form.pledgeDate} onChange={(e) => update("pledgeDate", e.target.value)} className={inputClass} />
            </label>
          </div>
        </fieldset>

        {message ? (
          <div role="status" className={`rounded-md border px-4 py-3 text-sm font-bold ${status === "success" ? "border-[#007a52]/30 bg-[#007a52]/8 text-[#006342]" : "border-[#d71920]/30 bg-[#d71920]/8 text-[#a71318]"}`}>
            {message}
          </div>
        ) : null}

        <button type="submit" disabled={status === "submitting"} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#007a52] px-5 text-sm font-black uppercase text-white transition hover:bg-[#006342] disabled:cursor-wait disabled:opacity-70">
          {status === "submitting" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
          {status === "submitting" ? "Submitting pledge" : "Submit pledge"}
        </button>
      </div>
    </form>
  )
}

function ChoiceGroup({ label, name, options, value, onChange, className = "" }: { label: string; name: string; options: string[]; value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <div className={className}>
      <p className="text-sm font-bold text-[#34423d]">{label}</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
        {options.map((option) => (
          <label key={option} className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-[#44514c]">
            <input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} className="h-4 w-4 accent-[#007a52]" />
            {option}
          </label>
        ))}
      </div>
    </div>
  )
}

function BankDetails({ bank, account, branch, swift }: { bank: string; account: string; branch: string; swift: string }) {
  return (
    <article className="rounded-md border border-black/12 bg-[#f4f6f3] p-4">
      <h3 className="font-black text-[#071512]">{bank}</h3>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-[#44514c]">
        <dt className="font-bold">Account</dt><dd>{account}</dd>
        <dt className="font-bold">Branch</dt><dd>{branch}</dd>
        <dt className="font-bold">SWIFT</dt><dd>{swift}</dd>
      </dl>
    </article>
  )
}
