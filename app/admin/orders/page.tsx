import { prisma } from "@/lib/prisma"
import { formatMoney } from "@/lib/payments/money"

export default async function AdminOrdersPage() {
  const orders = await prisma.paymentOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, items: true },
  })
  return (
    <div>
      <h1 className="text-3xl font-black text-yellow-300">Orders</h1>
      <div className="mt-6 grid gap-3">
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
            <div className="flex justify-between gap-4">
              <strong className="font-mono">{order.publicReference}</strong>
              <span>{order.status}</span>
            </div>
            <p className="mt-2">{order.description} - {formatMoney(order.totalMinor, order.currency)}</p>
            <p className="text-sm text-white/60">{order.customer.fullName} / {order.customer.email}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
