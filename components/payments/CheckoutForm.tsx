"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, LockKeyhole, ReceiptText, ShieldCheck, UserRound } from "lucide-react"

type Quote = {
  description: string
  purpose: string
  currency: string
  quantity: number
  unitPriceMinor: number
  subtotalMinor: number
  processingFeeMinor: number
  totalMinor: number
}

type Provider = {
  code: "MOCK" | "BSP" | "KINA"
  name: string
  available: boolean
  testMode: boolean
}

const products = [
  { slug: "general-donation", label: "General Donation" },
  { slug: "hope-behind-bars-sponsorship", label: "Program Sponsorship" },
  { slug: "wrl-ministry-support", label: "Ministry Support" },
  { slug: "broadcast-equipment-project", label: "Project Support" },
]

const amounts = [1000, 2500, 5000, 10000, 25000, 50000]

const PNG_PROVINCES = [
  "National Capital District",
  "Central",
  "Gulf",
  "Western",
  "Milne Bay",
  "Oro",
  "Morobe",
  "Madang",
  "East Sepik",
  "West Sepik",
  "Eastern Highlands",
  "Western Highlands",
  "Southern Highlands",
  "Enga",
  "Hela",
  "Jiwaka",
  "Chimbu",
  "East New Britain",
  "West New Britain",
  "New Ireland",
  "Manus",
  "Autonomous Region of Bougainville",
]

function createBrowserIdempotencyKey() {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function formatMoney(amountMinor: number, currency = "PGK") {
  const kina = Math.floor(Math.abs(amountMinor) / 100)
  const toea = `${Math.abs(amountMinor) % 100}`.padStart(2, "0")
  return `${amountMinor < 0 ? "-" : ""}${currency} ${kina.toLocaleString("en-PG")}.${toea}`
}

export default function CheckoutForm({ initialSlug = "general-donation" }: { initialSlug?: string }) {
  const [step, setStep] = useState<"billing" | "checkout">("billing")
  const [slug, setSlug] = useState(initialSlug)
  const [customAmountMinor, setCustomAmountMinor] = useState(5000)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(true)
  const [quoteError, setQuoteError] = useState("")
  const [providers, setProviders] = useState<Provider[]>([])
  const [provider, setProvider] = useState<"MOCK" | "BSP" | "KINA">("MOCK")
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState("Pay securely")
  const [error, setError] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [consent, setConsent] = useState(false)
  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Papua New Guinea",
    province: "National Capital District",
    city: "",
    postalCode: "",
    billingAddress: "",
    notes: "",
  })

  const idempotencyKey = useMemo(() => createBrowserIdempotencyKey(), [])

  function proceedToCheckout() {
    setError("")
    if (!customer.fullName.trim()) {
      setError("Full name is required.")
      return
    }
    if (!customer.email.trim()) {
      setError("Email is required.")
      return
    }
    if (!customer.city.trim()) {
      setError("City or town is required.")
      return
    }
    if (!customer.billingAddress.trim()) {
      setError("Billing address is required.")
      return
    }
    setStep("checkout")
  }

  useEffect(() => {
    let active = true
    async function loadQuote() {
      setQuoteLoading(true)
      setQuoteError("")
      setQuote(null)
      const response = await fetch("/api/payments/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paymentItemSlug: slug, customAmountMinor, quantity: 1 }),
      })
      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Could not calculate the payment total.")
      }
      if (active) setQuote(json.data.quote)
    }
    loadQuote()
      .catch((err) => {
        if (active) setQuoteError(err instanceof Error ? err.message : "Could not calculate the payment total.")
      })
      .finally(() => {
        if (active) setQuoteLoading(false)
      })
    return () => {
      active = false
    }
  }, [slug, customAmountMinor])

  useEffect(() => {
    fetch("/api/payments/providers")
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) return
        setProviders(json.data.providers)
        const firstAvailable = json.data.providers.find((item: Provider) => item.available)
        if (firstAvailable) setProvider(firstAvailable.code)
      })
      .catch(() => setError("Could not load payment providers."))
  }, [])

  async function submit() {
    setError("")
    if (!consent) {
      setError("Payment terms consent is required")
      return
    }
    setLoading(true)
    try {
      setButtonText("Validating details...")
      if (!quote) throw new Error(quoteError || "Payment quote is not ready")
      setButtonText("Creating payment...")
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          paymentItemSlug: slug,
          customAmountMinor,
          quantity: 1,
          provider,
          idempotencyKey,
          customer,
          notes: customer.notes,
          anonymous,
          consent,
        }),
      })
      const json = await response.json()
      if (!json.success) throw new Error(json.error || "Payment could not be initialized")
      setButtonText("Redirecting securely...")
      window.location.href = json.data.redirectUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment could not be initialized")
      setButtonText("Pay securely")
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`mx-auto grid gap-5 px-5 py-8 sm:px-6 lg:py-10 xl:px-8 ${
        step === "billing" ? "max-w-5xl" : "max-w-7xl lg:grid-cols-[minmax(0,1fr)_380px]"
      }`}
    >
      {step === "billing" ? (
        <section className="overflow-hidden rounded-lg border border-white/14 bg-[#0e211b] shadow-[0_28px_90px_rgba(0,0,0,0.32)]">
          <div className="border-b border-white/10 bg-[#082b52] px-5 py-5 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">Step 1 of 2</p>
                <h2 className="mt-2 text-2xl font-black text-white">Customer and billing details</h2>
              </div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-yellow-300 text-[#071512] shadow-[0_14px_34px_rgba(250,204,21,0.22)]">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" value={customer.fullName} autoComplete="name" onChange={(fullName) => setCustomer({ ...customer, fullName })} />
              <Field label="Email" type="email" value={customer.email} autoComplete="email" onChange={(email) => setCustomer({ ...customer, email })} />
              <Field label="PNG mobile number" value={customer.phone} autoComplete="tel" placeholder="+67571234567" onChange={(phone) => setCustomer({ ...customer, phone })} />
              <Field label="Country" value={customer.country} autoComplete="country-name" onChange={(country) => setCustomer({ ...customer, country })} />
              <label className="block">
                <span className="text-sm font-black text-white">Province</span>
                <select
                  className="mt-2 h-12 w-full rounded-md border border-white/18 bg-[#082b52] px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition focus:border-yellow-300 focus:bg-[#0a3768]"
                  value={customer.province}
                  autoComplete="address-level1"
                  onChange={(event) => setCustomer({ ...customer, province: event.target.value })}
                >
                  {PNG_PROVINCES.map((province) => <option key={province}>{province}</option>)}
                </select>
              </label>
              <Field label="City or town" value={customer.city} autoComplete="address-level2" onChange={(city) => setCustomer({ ...customer, city })} />
              <Field label="Postal code (optional)" value={customer.postalCode} autoComplete="postal-code" onChange={(postalCode) => setCustomer({ ...customer, postalCode })} />
              <Field label="Billing address" value={customer.billingAddress} autoComplete="street-address" onChange={(billingAddress) => setCustomer({ ...customer, billingAddress })} />
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-black text-white">Donation message or order notes (optional)</span>
              <textarea
                className="mt-2 min-h-24 w-full rounded-md border border-white/18 bg-[#162b24] px-4 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none placeholder:text-white/45 transition focus:border-yellow-300 focus:bg-[#1a332b]"
                value={customer.notes}
                onChange={(event) => setCustomer({ ...customer, notes: event.target.value })}
              />
            </label>

            {error ? <p className="mt-4 rounded-md border border-red-300/45 bg-red-500/18 p-3 text-sm font-semibold text-red-50" role="alert">{error}</p> : null}
            <button
              type="button"
              onClick={proceedToCheckout}
              className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-md bg-yellow-300 px-5 text-sm font-black uppercase text-[#071512] shadow-[0_18px_42px_rgba(250,204,21,0.2)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              Proceed to checkout
            </button>
          </div>
        </section>
      ) : null}

      {step === "checkout" ? (
        <>
          <section className="overflow-hidden rounded-lg border border-yellow-300/28 bg-[#082b52] shadow-[0_28px_90px_rgba(0,0,0,0.34)]">
            <div className="border-b border-white/10 bg-[#0a3768] px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">WRL Checkout</p>
                  <h1 className="mt-2 text-3xl font-black leading-tight text-white">Secure payment</h1>
                </div>
                <LockKeyhole className="h-9 w-9 text-yellow-300" aria-hidden="true" />
              </div>

              <button
                type="button"
                onClick={() => {
                  setError("")
                  setStep("billing")
                }}
                className="mt-4 inline-flex w-fit items-center gap-2 rounded-md border border-white/22 bg-white/[0.06] px-3 py-2 text-xs font-black text-white transition hover:border-yellow-300 hover:bg-yellow-300 hover:text-[#071512]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Edit billing details
              </button>
            </div>

            <div className="grid gap-5 p-5 sm:p-7">
              <div>
                <p className="text-sm font-black text-white">Payment purpose</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {products.map((product) => (
                    <button
                      key={product.slug}
                      type="button"
                      onClick={() => setSlug(product.slug)}
                      className={`min-h-12 rounded-md border px-4 py-3 text-left text-sm font-black transition ${slug === product.slug ? "border-yellow-300 bg-yellow-300 text-[#071512] shadow-[0_14px_30px_rgba(250,204,21,0.22)]" : "border-white/18 bg-white/[0.055] text-white hover:border-yellow-300/70 hover:bg-white/[0.1]"}`}
                    >
                      {product.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-black text-white">Amount</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {amounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setCustomAmountMinor(amount)}
                      className={`h-12 rounded-md border px-3 text-sm font-black transition ${customAmountMinor === amount ? "border-yellow-300 bg-yellow-300 text-[#071512] shadow-[0_14px_30px_rgba(250,204,21,0.22)]" : "border-white/18 bg-white/[0.055] text-white hover:border-yellow-300/70 hover:bg-white/[0.1]"}`}
                    >
                      {formatMoney(amount).replace("PGK ", "K")}
                    </button>
                  ))}
                </div>
                <label className="mt-3 block">
                  <span className="text-sm font-bold text-white/78">Custom PGK amount</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={customAmountMinor / 100}
                    onChange={(event) => setCustomAmountMinor(Math.round(Number(event.target.value || 0) * 100))}
                    className="mt-2 h-12 w-full rounded-md border border-white/18 bg-[#123c6b] px-4 text-sm font-semibold text-white outline-none transition focus:border-yellow-300 focus:bg-[#164779]"
                  />
                </label>
              </div>

              <div>
                <p className="text-sm font-black text-white">Payment provider</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {providers.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      disabled={!item.available}
                      onClick={() => setProvider(item.code)}
                      className={`flex min-h-16 items-center gap-3 rounded-md border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${provider === item.code ? "border-yellow-300 bg-yellow-300/16 shadow-[0_14px_30px_rgba(0,0,0,0.16)]" : "border-white/18 bg-white/[0.055] hover:border-yellow-300/70 hover:bg-white/[0.1]"}`}
                    >
                      <CreditCard className="h-5 w-5 shrink-0 text-sky-300" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black text-white">{item.name}</span>
                        <span className="block truncate text-xs font-semibold text-white/70">{item.available ? (item.testMode ? "Local test" : "Configured") : "Not configured"}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-sky-300/28 bg-sky-300/10 p-4 text-sm leading-6 text-white/84">
                <p><span className="font-black text-white">Secure hosted payment.</span> WRL does not store your card number or CVV, and receipts are generated after verification.</p>
              </div>
            </div>
          </section>

          <aside className="rounded-lg border border-white/14 bg-[#0e211b] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.3)] lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">Step 2 of 2</p>
                <h2 className="mt-2 text-2xl font-black text-white">Order summary</h2>
              </div>
              <ReceiptText className="h-7 w-7 text-yellow-300" aria-hidden="true" />
            </div>

            <div className="mt-5 rounded-md border border-white/10 bg-white/[0.045] p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/58">Billing</p>
              <p className="mt-2 text-sm font-black text-white">{customer.fullName}</p>
              <p className="mt-1 text-sm text-white/72">{customer.email}</p>
              <p className="mt-1 text-sm text-white/72">{customer.city}, {customer.province}</p>
            </div>

            <dl className="mt-5 grid gap-3 text-sm">
              <SummaryRow label="Item" value={quote?.description || (quoteLoading ? "Calculating..." : "Unavailable")} />
              <SummaryRow label="Subtotal" value={quote ? formatMoney(quote.subtotalMinor, quote.currency) : "..."} />
              <SummaryRow label="Processing fee" value={quote ? formatMoney(quote.processingFeeMinor, quote.currency) : "..."} />
              <SummaryRow label="Total" value={quote ? formatMoney(quote.totalMinor, quote.currency) : "..."} strong />
            </dl>

            {quoteError ? <p className="mt-3 rounded-md border border-red-300/45 bg-red-500/18 p-3 text-sm font-semibold text-red-50" role="alert">{quoteError}</p> : null}

            <label className="mt-5 flex gap-3 rounded-md border border-white/10 bg-white/[0.045] p-3 text-sm leading-6 text-white/82">
              <input className="mt-1 h-4 w-4 accent-yellow-300" type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} />
              <span>Make this donation anonymous where publicly displayed.</span>
            </label>
            <label className="mt-3 flex gap-3 rounded-md border border-white/10 bg-white/[0.045] p-3 text-sm leading-6 text-white/82">
              <input className="mt-1 h-4 w-4 accent-yellow-300" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              <span>I agree to continue to a secure hosted payment page.</span>
            </label>

            {error ? <p className="mt-3 rounded-md border border-red-300/45 bg-red-500/18 p-3 text-sm font-semibold text-red-50" role="alert">{error}</p> : null}
            <button
              type="button"
              onClick={submit}
              disabled={loading || quoteLoading || !quote}
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-yellow-300 px-5 text-sm font-black uppercase tracking-normal text-[#071512] shadow-[0_18px_42px_rgba(250,204,21,0.2)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {quoteLoading ? "Calculating total..." : buttonText}
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </button>
          </aside>
        </>
      ) : null}
    </motion.div>
  )
}

function Field(props: {
  label: string
  value: string
  type?: string
  placeholder?: string
  autoComplete?: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-white">{props.label}</span>
      <input
        type={props.type || "text"}
        value={props.value}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        onChange={(event) => props.onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-md border border-white/18 bg-[#162b24] px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none placeholder:text-white/45 transition focus:border-yellow-300 focus:bg-[#1a332b]"
      />
    </label>
  )
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "border-t border-white/12 pt-4 text-lg font-black text-yellow-300" : "text-white/82"}`}>
      <dt className={strong ? "text-white" : "text-white/68"}>{label}</dt>
      <dd className="text-right font-black">{value}</dd>
    </div>
  )
}
