import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatMoney } from "@/lib/payments/money"

export const dynamic = "force-dynamic"

export default async function AdminPaymentsPage() {
  const [payments, succeeded, pending, failed, refunded, providerBreakdown, purposeBreakdown] = await Promise.all([
    prisma.paymentTransaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { order: { include: { customer: true } } },
    }),
    prisma.paymentTransaction.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amountMinor: true }, _count: true }),
    prisma.paymentTransaction.count({ where: { status: { in: ["CREATED", "PENDING", "PROCESSING", "REQUIRES_ACTION"] } } }),
    prisma.paymentTransaction.count({ where: { status: "FAILED" } }),
    prisma.paymentTransaction.count({ where: { status: { in: ["REFUNDED", "PARTIALLY_REFUNDED"] } } }),
    prisma.paymentTransaction.groupBy({ by: ["provider"], _count: true }),
    prisma.paymentOrder.groupBy({ by: ["purpose"], _count: true, _sum: { totalMinor: true } }),
  ])

  return (
    <div>
      <h1 className="text-3xl font-black text-yellow-300">Payments</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        <Card label="Successful amount" value={formatMoney(succeeded._sum.amountMinor || 0)} />
        <Card label="Successful count" value={`${succeeded._count}`} />
        <Card label="Pending" value={`${pending}`} />
        <Card label="Failed" value={`${failed}`} />
        <Card label="Refunded" value={`${refunded}`} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Breakdown title="Provider breakdown" items={providerBreakdown.map((item) => [item.provider, item._count])} />
        <Breakdown title="Purpose breakdown" items={purposeBreakdown.map((item) => [item.purpose, `${item._count} / ${formatMoney(item._sum.totalMinor || 0)}`])} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-black/30 text-yellow-300">
            <tr>
              <th className="p-3">Payment</th>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Purpose</th>
              <th className="p-3">Provider</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t border-white/10">
                <td className="p-3 font-mono">{payment.publicReference}</td>
                <td className="p-3 font-mono">{payment.order.publicReference}</td>
                <td className="p-3">{payment.order.customer.fullName}<br /><span className="text-white/55">{payment.order.customer.email}</span></td>
                <td className="p-3">{payment.order.purpose}</td>
                <td className="p-3">{payment.provider}</td>
                <td className="p-3 font-bold">{formatMoney(payment.amountMinor, payment.currency)}</td>
                <td className="p-3">{payment.status}</td>
                <td className="p-3">{payment.createdAt.toLocaleString()}</td>
                <td className="p-3"><Link className="font-bold text-sky-300" href={`/admin/payments/${payment.publicReference}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Card({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4"><p className="text-sm text-white/65">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>
}

function Breakdown({ title, items }: { title: string; items: [string, string | number][] }) {
  return <section className="rounded-lg border border-white/10 bg-white/[0.06] p-4"><h2 className="font-black text-yellow-300">{title}</h2><div className="mt-3 grid gap-2">{items.map(([label, value]) => <div key={label} className="flex justify-between border-b border-white/10 pb-2"><span>{label}</span><strong>{value}</strong></div>)}</div></section>
}
