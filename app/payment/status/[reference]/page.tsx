import Link from "next/link"
import { getPaymentStatus } from "@/lib/payments/payment-service"
import { formatMoney } from "@/lib/payments/money"

export default async function PaymentStatusPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params
  const payment = await getPaymentStatus(reference)
  return (
    <main className="min-h-[70vh] bg-[#071512] px-6 py-16 text-white">
      <section className="mx-auto max-w-2xl rounded-lg border border-white/12 bg-[#082b52] p-8">
        <h1 className="text-4xl font-black">Payment status</h1>
        <dl className="mt-6 grid gap-3 text-sm">
          <Row label="Payment reference" value={payment.publicReference} />
          <Row label="Order reference" value={payment.order.publicReference} />
          <Row label="Status" value={payment.status} />
          <Row label="Amount" value={formatMoney(payment.amountMinor, payment.currency)} />
          <Row label="Provider" value={payment.provider} />
        </dl>
        <Link href={`/receipt/${payment.publicReference}`} className="mt-8 inline-block rounded bg-yellow-300 px-5 py-3 font-black text-[#071512]">Open receipt</Link>
      </section>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b border-white/10 pb-2"><dt className="text-white/65">{label}</dt><dd className="text-right font-bold">{value}</dd></div>
}
