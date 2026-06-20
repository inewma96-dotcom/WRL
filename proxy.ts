import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import {
  AUTH_COOKIE_NAME,
  verifyAccessTokenEdge,
} from "@/lib/auth-edge"

import type { UserRole } from "@/lib/constants"

//////////////////////////////////////////////////////////////
// ROUTE CONFIG
//////////////////////////////////////////////////////////////

const ROUTES = {
  admin: {
    path: "/admin",
    roles: ["ADMIN"] as UserRole[],
    dashboard: "/admin/dashboard",
  },

  journalist: {
    path: "/journalist",
    roles: ["ADMIN", "JOURNALIST"] as UserRole[],
    dashboard: "/journalist/news",
  },

  prayer: {
    path: "/prayer",
    roles: ["ADMIN", "PRAYER"] as UserRole[],
    dashboard: "/prayer/dashboard",
  },
}

//////////////////////////////////////////////////////////////
// LOGIN ROUTES
//////////////////////////////////////////////////////////////

const LOGIN_ROUTES = [
  "/login",
  "/admin/login",
  "/journalist/login",
  "/prayer/login",
]

//////////////////////////////////////////////////////////////
// PROXY
//////////////////////////////////////////////////////////////

export async function proxy(
  request: NextRequest
) {
  const pathname =
    request.nextUrl.pathname

  //////////////////////////////////////////////////////////////
  // TOKEN
  //////////////////////////////////////////////////////////////

  const token =
    request.cookies.get(
      AUTH_COOKIE_NAME
    )?.value

  //////////////////////////////////////////////////////////////
  // VERIFY TOKEN
  //////////////////////////////////////////////////////////////

  const session = token
    ? await verifyAccessTokenEdge(
        token,
        process.env.JWT_SECRET || ""
      )
    : null

  //////////////////////////////////////////////////////////////
  // LOGIN PAGE REDIRECTS
  //////////////////////////////////////////////////////////////

  if (
    LOGIN_ROUTES.includes(pathname)
  ) {
    if (!session) {
      return NextResponse.next()
    }

    //////////////////////////////////////////////////////////////
    // ROLE REDIRECT
    //////////////////////////////////////////////////////////////

    if (session.role === "ADMIN") {
      return NextResponse.redirect(
        new URL(
          ROUTES.admin.dashboard,
          request.url
        )
      )
    }

    if (
      session.role ===
      "JOURNALIST"
    ) {
      return NextResponse.redirect(
        new URL(
          ROUTES.journalist.dashboard,
          request.url
        )
      )
    }

    if (
      session.role ===
      "PRAYER"
    ) {
      return NextResponse.redirect(
        new URL(
          ROUTES.prayer.dashboard,
          request.url
        )
      )
    }

    return NextResponse.redirect(
      new URL("/", request.url)
    )
  }

  //////////////////////////////////////////////////////////////
  // ADMIN
  //////////////////////////////////////////////////////////////

  if (
    pathname.startsWith(
      ROUTES.admin.path
    )
  ) {
    if (!session) {
      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      )
    }

    if (
      !ROUTES.admin.roles.includes(
        session.role
      )
    ) {
      return NextResponse.redirect(
        new URL("/", request.url)
      )
    }
  }

  //////////////////////////////////////////////////////////////
  // JOURNALIST
  //////////////////////////////////////////////////////////////

  if (
    pathname.startsWith(
      ROUTES.journalist.path
    )
  ) {
    if (!session) {
      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      )
    }

    if (
      !ROUTES.journalist.roles.includes(
        session.role
      )
    ) {
      return NextResponse.redirect(
        new URL("/", request.url)
      )
    }
  }

  //////////////////////////////////////////////////////////////
  // PRAYER
  //////////////////////////////////////////////////////////////

  if (
    pathname.startsWith(
      ROUTES.prayer.path
    )
  ) {
    if (!session) {
      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      )
    }

    if (
      !ROUTES.prayer.roles.includes(
        session.role
      )
    ) {
      return NextResponse.redirect(
        new URL("/", request.url)
      )
    }
  }

  //////////////////////////////////////////////////////////////
  // ALLOW
  //////////////////////////////////////////////////////////////

  return NextResponse.next()
}

//////////////////////////////////////////////////////////////
// MATCHER
//////////////////////////////////////////////////////////////

export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/journalist/:path*",
    "/prayer/:path*",
  ],
}
