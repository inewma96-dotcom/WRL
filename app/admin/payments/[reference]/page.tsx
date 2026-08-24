import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { formatMoney } from "@/lib/payments/money"
import AdminPaymentActions from "@/components/payments/AdminPaymentActions"

export default async function AdminPaymentDetailPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params
  const payment = await prisma.paymentTransaction.findUnique({
    where: { publicReference: reference },
    include: {
      order: { include: { customer: true, items: true } },
      events: { orderBy: { receivedAt: "desc" } },
      refunds: { orderBy: { createdAt: "desc" } },
      auditLogs: { orderBy: { createdAt: "desc" } },
    },
  })
  if (!payment) notFound()

  return (
    <div>
      <Link href="/admin/payments" className="text-sm font-bold text-sky-300">Back to payments</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-yellow-300">{payment.publicReference}</h1>
          <p className="mt-2 text-white/70">{payment.status} via {payment.provider}</p>
        </div>
        <AdminPaymentActions reference={payment.publicReference} />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Panel title="Payment details">
          <Row label="Order" value={payment.order.publicReference} />
          <Row label="Amount" value={formatMoney(payment.amountMinor, payment.currency)} />
          <Row label="Provider transaction" value={payment.providerTransactionId || "Not available"} />
          <Row label="Created" value={payment.createdAt.toLocaleString()} />
          <Row label="Verified" value={payment.verifiedAt?.toLocaleString() || "Not verified"} />
        </Panel>
        <Panel title="Customer details">
          <Row label="Name" value={payment.order.customer.fullName} />
          <Row label="Email" value={payment.order.customer.email} />
          <Row label="Phone" value={payment.order.customer.phone || ""} />
          <Row label="Province" value={payment.order.customer.province || ""} />
          <Row label="Address" value={payment.order.customer.billingAddress || ""} />
        </Panel>
        <Panel title="Order items">
          {payment.order.items.map((item) => <Row key={item.id} label={`${item.quantity} x ${item.descriptionSnapshot}`} value={formatMoney(item.lineTotalMinor, payment.currency)} />)}
        </Panel>
        <Panel title="Callback events">
          {payment.events.map((event) => <Row key={event.id} label={event.eventType} value={event.receivedAt.toLocaleString()} />)}
          {payment.events.length === 0 ? <p className="text-white/65">No callback events recorded.</p> : null}
        </Panel>
        <Panel title="Refund history">
          {payment.refunds.map((refund) => <Row key={refund.id} label={refund.publicReference} value={`${refund.status} ${formatMoney(refund.amountMinor, payment.currency)}`} />)}
          {payment.refunds.length === 0 ? <p className="text-white/65">No refunds recorded.</p> : null}
        </Panel>
        <Panel title="Audit history">
          {payment.auditLogs.map((log) => <Row key={log.id} label={log.action} value={log.createdAt.toLocaleString()} />)}
        </Panel>
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5"><h2 className="mb-4 text-xl font-black text-yellow-300">{title}</h2>{children}</section>
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b border-white/10 py-2 text-sm"><dt className="text-white/65">{label}</dt><dd className="max-w-[60%] text-right font-bold">{value}</dd></div>
}
