import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatMoney } from "@/lib/payments/money"

export default async function AdminDonationsPage() {
  const donations = await prisma.paymentOrder.findMany({
    where: { purpose: { in: ["GENERAL_DONATION", "MINISTRY_SUPPORT", "PROJECT_SUPPORT", "PROGRAM_SPONSORSHIP"] } },
    orderBy: { createdAt: "desc" },
    include: { customer: true, transactions: true },
  })
  return (
    <div>
      <h1 className="text-3xl font-black text-yellow-300">Donations</h1>
      <div className="mt-6 grid gap-3">
        {donations.map((order) => (
          <Link key={order.id} href={`/admin/payments/${order.transactions[0]?.publicReference || ""}`} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
            <strong>{order.description}</strong> - {formatMoney(order.totalMinor, order.currency)} - {order.customer.fullName}
          </Link>
        ))}
      </div>
    </div>
  )
}
