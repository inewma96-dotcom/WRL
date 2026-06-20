import { prisma } from "@/lib/prisma"

export const PRAYER_REQUEST_RETENTION_DAYS = 7

export function getPrayerRequestExpiryDate() {
  const expiryDate = new Date()
  expiryDate.setDate(
    expiryDate.getDate() - PRAYER_REQUEST_RETENTION_DAYS
  )

  return expiryDate
}

export async function deleteExpiredPrayerRequests() {
  return prisma.prayerRequest.deleteMany({
    where: {
      createdAt: {
        lt: getPrayerRequestExpiryDate(),
      },
    },
  })
}
