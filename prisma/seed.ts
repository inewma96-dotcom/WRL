import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/password'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = hashPassword('admin123')

  const admin = await prisma.user.upsert({
    where: { email: 'admin@wrl.com' },
    update: {},
    create: {
      email: 'admin@wrl.com',
      username: 'admin',
      password: hashedPassword,
      displayPassword: 'admin123',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  console.log('Created admin user:', admin.email)

  // Create journalist user
  const journalistPassword = hashPassword('journalist123')

  const journalist = await prisma.user.upsert({
    where: { email: 'journalist@wrl.com' },
    update: {},
    create: {
      email: 'journalist@wrl.com',
      username: 'journalist',
      password: journalistPassword,
      displayPassword: 'journalist123',
      role: 'JOURNALIST',
      status: 'ACTIVE',
    },
  })

  console.log('Created journalist user:', journalist.email)

  // Create prayer user
  const prayerPassword = hashPassword('prayer123')

  const prayer = await prisma.user.upsert({
    where: { email: 'prayer@wrl.com' },
    update: {},
    create: {
      email: 'prayer@wrl.com',
      username: 'prayer',
      password: prayerPassword,
      displayPassword: 'prayer123',
      role: 'PRAYER',
      status: 'ACTIVE',
    },
  })

  console.log('Created prayer user:', prayer.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })