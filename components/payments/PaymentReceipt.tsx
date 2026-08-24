import Image from "next/image"
import { formatMoney } from "@/lib/payments/money"

type ReceiptPayment = {
  publicReference: string
  provider: string
  status: string
  amountMinor: number
  currency: string
  verifiedAt: Date | null
  order: {
    publicReference: string
    purpose: string
    description: string
    customer: { fullName: string; email: string }
    items: { descriptionSnapshot: string; quantity: number; lineTotalMinor: number }[]
  }
}

export default function PaymentReceipt({ payment }: { payment: ReceiptPayment }) {
  return (
    <article className="mx-auto max-w-3xl rounded-lg bg-white p-8 text-[#071512] print:rounded-none print:shadow-none">
      <div className="flex items-center justify-between gap-6 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black">Payment Receipt</h1>
          <p className="mt-2 font-bold">Wantok Radio Light</p>
        </div>
        <Image src="/logo.png" alt="WRL Logo" width={120} height={60} className="object-contain" />
      </div>
      <dl className="mt-6 grid gap-3 text-sm">
        <Row label="Payment reference" value={payment.publicReference} />
        <Row label="Order reference" value={payment.order.publicReference} />
        <Row label="Customer name" value={payment.order.customer.fullName} />
        <Row label="Customer email" value={payment.order.customer.email} />
        <Row label="Payment purpose" value={payment.order.purpose} />
        <Row label="Item" value={payment.order.description} />
        <Row label="Amount" value={formatMoney(payment.amountMinor, payment.currency)} />
        <Row label="Provider" value={payment.provider} />
        <Row label="Verified date" value={payment.verifiedAt?.toLocaleString() || "Not verified"} />
        <Row label="Payment status" value={payment.status} />
      </dl>
      <p className="mt-8 rounded bg-[#f8f6ef] p-4 text-sm leading-6">
        Thank you for supporting Wantok Radio Light. This receipt confirms the server-verified payment status shown above.
      </p>
    </article>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-black/10 py-2">
      <dt className="font-bold text-black/60">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  )
}
