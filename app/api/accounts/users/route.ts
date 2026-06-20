import { randomBytes } from "crypto"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/password"
import { enforceAdminApi } from "@/lib/api-security"

import { USER_ROLES, isUserRole, type UserRole } from "@/lib/constants"

function generatePassword() {
  return randomBytes(6).toString("hex")
}

function cleanUsername(username: string) {
  return username.trim().toLowerCase()
}

function makeEmail(username: string, role: UserRole) {
  return `${username}@${role.toLowerCase()}.wrl.local`
}

function accountSelect() {
  return {
    id: true,
    username: true,
    displayPassword: true,
    role: true,
    createdAt: true,
  } as const
}

export async function GET(req: Request) {
  const blocked = await enforceAdminApi(req, {
    roles: ["ADMIN"],
  })

  if (blocked) return blocked

  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: [
            USER_ROLES.JOURNALIST,
            USER_ROLES.PRAYER,
          ],
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      select: accountSelect(),
    })

    return NextResponse.json(users)

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Failed to load accounts" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const blocked = await enforceAdminApi(req, {
    roles: ["ADMIN"],
  })

  if (blocked) return blocked

  try {
    const body = await req.json()

    const username = cleanUsername(String(
      body.username || ""
    ))

    const password = String(
      body.password ||
        generatePassword()
    ).trim()

    const role = String(body.role || "") as UserRole

    if (
      !username ||
      !password ||
      !role
    ) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    if (
      !isUserRole(role) ||
      (role !== USER_ROLES.JOURNALIST &&
        role !== USER_ROLES.PRAYER)
    ) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const email = makeEmail(username, role)

    const existingUser =
      await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email },
          ],
        },
      })

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "User already exists",
        },
        { status: 400 }
      )
    }

    const user =
      await prisma.user.create({
        data: {
          username,
          email,
          role,
          password:
            hashPassword(password),
          displayPassword:
            password,
        },
        select: accountSelect(),
      })

    return NextResponse.json(user)

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  const blocked = await enforceAdminApi(req, {
    roles: ["ADMIN"],
  })

  if (blocked) return blocked

  try {
    const body = await req.json()
    const id = String(body.id || "")
    const action = String(body.action || "reset")

    if (!id) {
      return NextResponse.json(
        { error: "Account id is required" },
        { status: 400 }
      )
    }

    if (action === "update") {
      const username = cleanUsername(String(body.username || ""))
      const password = String(body.password || "").trim()
      const role = String(body.role || "") as UserRole

      if (!username || username.length < 3) {
        return NextResponse.json(
          { error: "Username must be at least 3 characters" },
          { status: 400 }
        )
      }

      if (!password || password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        )
      }

      if (
        !isUserRole(role) ||
        (role !== USER_ROLES.JOURNALIST &&
          role !== USER_ROLES.PRAYER)
      ) {
        return NextResponse.json(
          { error: "Invalid role" },
          { status: 400 }
        )
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          id: { not: id },
          OR: [
            { username },
            { email: makeEmail(username, role) },
          ],
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        )
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          username,
          email: makeEmail(username, role),
          role,
          password: hashPassword(password),
          displayPassword: password,
        },
        select: accountSelect(),
      })

      await prisma.authSession.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      })

      await prisma.refreshToken.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      })

      return NextResponse.json(user)
    }

    const newPassword = generatePassword()

    const user = await prisma.user.update({
      where: { id },

      data: {
        password:
          hashPassword(newPassword),

        displayPassword:
          newPassword,
      },
      select: accountSelect(),
    })

    await prisma.authSession.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    })

    await prisma.refreshToken.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    })

    return NextResponse.json(user)

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        error:
          "Failed to reset password",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const blocked = await enforceAdminApi(req, {
    roles: ["ADMIN"],
  })

  if (blocked) return blocked

  try {
    const { id } =
      await req.json()

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
    })

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        error:
          "Failed to delete user",
      },
      { status: 500 }
    )
  }
}
