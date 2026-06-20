/**
 * SERVER-SIDE AUTH VERIFICATION
 * ==============================
 * 
 * Used by API routes and server components to safely extract and verify
 * the authenticated user's session.
 * 
 * This replaces the old `requireAuth.ts` with a more robust implementation
 * that properly verifies tokens and sessions.
 */

import { cookies, headers } from "next/headers"
import { verifyAccessToken, verifySession, updateSessionActivity } from "@/lib/auth-service"
import { AUTH_COOKIE_NAME } from "@/lib/auth-service"
import { AuthenticationError, AuthorizationError } from "@/lib/api-utils"
import { isUserRole, type UserRole } from "@/lib/constants"
import { prisma } from "@/lib/prisma"

// ============================================================
// TYPES
// ============================================================

export interface AuthenticatedUser {
  id: string
  email: string
  username?: string
  displayName?: string
  role: UserRole
  sessionId: string
}

// ============================================================
// GET AUTHENTICATED USER
// ============================================================

/**
 * Gets the authenticated user from the request
 * Used in API routes and server components
 * 
 * Throws AuthenticationError if not authenticated
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

    if (!token) {
      throw new AuthenticationError("No auth token found")
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      throw new AuthenticationError("Invalid or expired auth token")
    }

    // Verify session is still valid
    const session = await verifySession(payload.sessionId)
    if (!session) {
      throw new AuthenticationError("Session expired or revoked")
    }

    // Update session activity
    try {
      await updateSessionActivity(payload.sessionId)
    } catch (error) {
      console.error("Failed to update session activity:", error)
    }

    // Get full user data
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
      },
    })

    if (!user) {
      throw new AuthenticationError("User not found")
    }

    if (!isUserRole(user.role)) {
      throw new AuthenticationError("Invalid user role")
    }

    if (user.role !== payload.role) {
      // Role mismatch - token tampering?
      throw new AuthenticationError("Token validation failed")
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username || undefined,
      displayName: user.displayName || undefined,
      role: user.role,
      sessionId: payload.sessionId,
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }
    throw new AuthenticationError("Authentication failed")
  }
}

// ============================================================
// REQUIRE AUTHENTICATED USER
// ============================================================

/**
 * Assert that a user is authenticated
 * Returns the authenticated user or throws error
 * 
 * Usage:
 * const user = await requireAuthenticatedUser()
 * console.log(user.email)
 */
export async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  return getAuthenticatedUser()
}

// ============================================================
// REQUIRE SPECIFIC ROLE(S)
// ============================================================

/**
 * Assert that the user has one of the specified roles
 * Returns the authenticated user or throws error
 * 
 * Usage:
 * const user = await requireRole("ADMIN")
 * const user = await requireRole(["ADMIN", "JOURNALIST"])
 */
export async function requireRole(
  allowedRoles: UserRole | UserRole[]
): Promise<AuthenticatedUser> {
  const user = await requireAuthenticatedUser()

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  if (!roles.includes(user.role)) {
    throw new AuthorizationError(
      `This action requires one of these roles: ${roles.join(", ")}`
    )
  }

  return user
}

// ============================================================
// CHECK AUTHENTICATION (OPTIONAL)
// ============================================================

/**
 * Check if user is authenticated without throwing
 * Returns user or null
 * 
 * Usage:
 * const user = await checkAuthenticated()
 * if (user) {
 *   console.log("User is authenticated")
 * }
 */
export async function checkAuthenticated(): Promise<AuthenticatedUser | null> {
  try {
    return await getAuthenticatedUser()
  } catch (error) {
    return null
  }
}

/**
 * Check if user has a specific role without throwing
 * Returns true/false
 */
export async function checkRole(role: UserRole | UserRole[]): Promise<boolean> {
  try {
    await requireRole(role)
    return true
  } catch (error) {
    return false
  }
}

// ============================================================
// GET CLIENT INFO
// ============================================================

/**
 * Get client IP address from request headers
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    headersList.get("x-client-ip") ||
    "unknown"
  )
}

/**
 * Get user agent from request headers
 */
export async function getUserAgent(): Promise<string | null> {
  const headersList = await headers()
  return headersList.get("user-agent")
}
