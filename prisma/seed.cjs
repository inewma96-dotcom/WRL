const { PrismaClient } = require("@prisma/client")
const { randomBytes, scryptSync } = require("crypto")

const prisma = new PrismaClient()

const SCRYPT_KEYLEN = 64
const SCRYPT_SALT_BYTES = 16
const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
}

function hashPassword(password) {
  const salt = randomBytes(SCRYPT_SALT_BYTES).toString("hex")
  const derived = scryptSync(
    password,
    salt,
    SCRYPT_KEYLEN,
    SCRYPT_OPTIONS
  ).toString("hex")

  return `scrypt$${salt}$${derived}`
}

async function upsertUser({ email, username, password, role }) {
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      username,
      password: hashPassword(password),
      displayPassword: password,
      role,
      status: "ACTIVE",
    },
  })

  console.log(`Seeded ${role.toLowerCase()} user: ${user.email}`)
}

async function main() {
  await upsertUser({
    email: "admin@wrl.com",
    username: "admin",
    password: "admin123",
    role: "ADMIN",
  })

  await upsertUser({
    email: "journalist@wrl.com",
    username: "journalist",
    password: "journalist123",
    role: "JOURNALIST",
  })

  await upsertUser({
    email: "prayer@wrl.com",
    username: "prayer",
    password: "prayer123",
    role: "PRAYER",
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
