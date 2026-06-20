/**
 * LOGOUT ENDPOINT
 * ===============
 * 
 * Revokes the user's session and clears the auth cookie
 */

import { NextRequest } from "next/server"
import {
  checkAuthenticated,
} from "@/lib/auth-verify"
import {
  apiSuccess,
  apiError,
  withErrorHandling,
} from "@/lib/api-utils"
import { revokeSession, AUTH_COOKIE_NAME } from "@/lib/auth-service"

// ============================================================
// REQUEST HANDLER
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function logoutHandler(_req: NextRequest): Promise<Response> {
  //////////////////////////////////////////////////////
  // GET AUTHENTICATED USER
  //////////////////////////////////////////////////////

  const user = await checkAuthenticated()

  //////////////////////////////////////////////////////
  // REVOKE SESSION
  //////////////////////////////////////////////////////

  if (user) {
    try {
      await revokeSession(user.sessionId)
    } catch (error) {
      console.error("Failed to revoke session:", error)
      // Continue anyway - clear cookie regardless
    }
  }

  //////////////////////////////////////////////////////
  // RESPONSE - CLEAR AUTH COOKIE
  //////////////////////////////////////////////////////

  const response = apiSuccess({ message: "Logged out successfully" }, 200)

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // Expire immediately
  })

  return response
}

//////////////////////////////////////////////////////
// EXPORT HANDLERS
//////////////////////////////////////////////////////

export const POST = withErrorHandling(logoutHandler)
export const GET = () => apiError(new Error("Method not allowed"))
