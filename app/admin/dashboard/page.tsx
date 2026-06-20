import { prisma } from "@/lib/prisma"
import AdminDashboardContent from "@/components/AdminDashboardContent"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const airwaves = await prisma.airwaveContent.findMany({
    where: { mediaType: "AUDIO" },
    orderBy: { createdAt: "desc" },
  })
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  })
  const serializedAirwaves = airwaves.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }))
  const serializedNews = news.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }))

  return (
    <AdminDashboardContent airwaves={serializedAirwaves} news={serializedNews} />
  )
}
