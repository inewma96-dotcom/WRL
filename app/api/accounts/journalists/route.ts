import { randomBytes } from "crypto"
import { NextResponse } from "next/server"

import { enforceAdminApi } from "@/lib/api-security"
import { hashPassword } from "@/lib/password"
import { prisma } from "@/lib/prisma"

function cleanUsername(username: string) {
  return username.trim().toLowerCase()
}

function generatePassword() {
  return randomBytes(6).toString("base64url")
}

function makeEmail(
  username: string,
  role: string
) {
  return `${username}@${role.toLowerCase()}.wrl.local`
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
          in: ["JOURNALIST", "PRAYER"],
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        username: true,
        displayPassword: true,
        role: true,
        createdAt: true,
      },
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

    const username = cleanUsername(
      String(body.username || "")
    )

    const password = String(
      body.password || generatePassword()
    ).trim()

    const role =
      body.role === "PRAYER"
        ? "PRAYER"
        : "JOURNALIST"

    if (!username || username.length < 3) {
      return NextResponse.json(
        {
          error:
            "Username must be at least 3 characters",
        },
        { status: 400 }
      )
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 6 characters",
        },
        { status: 400 }
      )
    }

    const existing =
      await prisma.user.findFirst({
        where: {
          username,
        },
      })

    if (existing) {
      return NextResponse.json(
        {
          error: "Username already exists",
        },
        { status: 409 }
      )
    }

    const user = await prisma.user.create({
      data: {
        email: makeEmail(username, role),
        username,
        password: hashPassword(password),
        displayPassword: password,
        role,
      },

      select: {
        id: true,
        username: true,
        displayPassword: true,
        role: true,
        createdAt: true,
      },
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
    const { id } = await req.json()

    const password = generatePassword()

    const user =
      await prisma.user.update({
        where: {
          id,
        },

        data: {
          password: hashPassword(password),
          displayPassword: password,
        },

        select: {
          id: true,
          username: true,
          displayPassword: true,
          role: true,
          createdAt: true,
        },
      })

    return NextResponse.json(user)

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Reset failed" },
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
    const { id } = await req.json()

    await prisma.user.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      success: true,
    })

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    )
  }
}
