import { getDefaultPaymentProvider, getMerchantName } from "@/lib/payments/env"

export default function AdminPaymentSettingsPage() {
  const bspReady = Boolean(process.env.BSP_IPG_BASE_URL && process.env.BSP_IPG_MERCHANT_ID && process.env.BSP_IPG_API_KEY)
  const kinaReady = Boolean(process.env.KINA_IPG_BASE_URL && process.env.KINA_IPG_MERCHANT_ID && process.env.KINA_IPG_API_KEY)
  return (
    <div>
      <h1 className="text-3xl font-black text-yellow-300">Payment settings</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card label="Merchant" value={getMerchantName()} />
        <Card label="Default provider" value={getDefaultPaymentProvider()} />
        <Card label="Currency" value={process.env.PAYMENT_CURRENCY || "PGK"} />
        <Card label="BSP IPG" value={bspReady ? "Configured" : "Not configured"} />
        <Card label="Kina Bank IPG" value={kinaReady ? "Configured" : "Not configured"} />
        <Card label="Mock gateway" value="Available locally" />
      </div>
      <p className="mt-6 max-w-3xl rounded-lg border border-white/10 bg-white/[0.06] p-5 text-white/72">
        BSP and Kina Bank adapters are intentionally disabled until WRL enters official merchant credentials and implements the exact request, signing, callback, and refund mappings from the bank documentation.
      </p>
    </div>
  )
}

function Card({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5"><p className="text-sm text-white/60">{label}</p><p className="mt-2 text-xl font-black">{value}</p></div>
}
