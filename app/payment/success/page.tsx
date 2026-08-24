import Link from "next/link"
import { CheckCircle2, ReceiptText } from "lucide-react"
import { getPaymentStatus } from "@/lib/payments/payment-service"
import { formatMoney } from "@/lib/payments/money"

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const params = await searchParams
  const payment = params.reference ? await getPaymentStatus(params.reference) : null

  return (
    <main className="min-h-[70vh] bg-[#071512] px-6 py-16 text-white">
      <section className="mx-auto max-w-2xl rounded-lg border border-emerald-300/35 bg-[#082b52] p-8">
        <CheckCircle2 className="h-12 w-12 text-emerald-300" aria-hidden="true" />
        <h1 className="mt-5 text-4xl font-black">Payment successful</h1>
        <p className="mt-4 text-white/78">Thank you for supporting Wantok Radio Light and its ministry across Papua New Guinea.</p>
        {payment ? (
          <dl className="mt-6 grid gap-3 text-sm">
            <Row label="Order reference" value={payment.order.publicReference} />
            <Row label="Payment reference" value={payment.publicReference} />
            <Row label="Purpose" value={payment.order.purpose} />
            <Row label="Amount" value={formatMoney(payment.amountMinor, payment.currency)} />
            <Row label="Provider" value={payment.provider} />
            <Row label="Date" value={payment.verifiedAt?.toLocaleString() || payment.updatedAt.toLocaleString()} />
            <Row label="Customer email" value={payment.order.customer.email} />
          </dl>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          {payment ? <Link href={`/receipt/${payment.publicReference}`} className="inline-flex items-center gap-2 rounded bg-yellow-300 px-5 py-3 font-black text-[#071512]"><ReceiptText className="h-4 w-4" />Receipt</Link> : null}
          <Link href="/" className="rounded border border-white/30 px-5 py-3 font-black text-white">Return home</Link>
        </div>
      </section>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b border-white/10 pb-2"><dt className="text-white/65">{label}</dt><dd className="text-right font-bold">{value}</dd></div>
}
