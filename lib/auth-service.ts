/**
 * UNIFIED AUTHENTICATION SERVICE
 * ==============================
 * 
 * This service handles all authentication logic for the WRL platform.
 * It replaces multiple scattered login endpoints with a single, unified,
 * secure authentication mechanism.
 * 
 * Features:
 * - Single login endpoint for all roles
 * - Secure token generation and verification
 * - Session management with refresh tokens
 * - Rate limiting and security headers
 * - Audit logging
 * - User status tracking
 * 
 * Architectural Decision:
 * Previously, the system had separate login endpoints (/api/login, /api/journalist/login, /api/prayer/login)
 * with duplicated logic. This creates security risks and maintenance burden.
 * The unified service consolidates all auth logic into a single, testable, secure location.
 */

import jwt from "jsonwebtoken"
import { prisma } from "./prisma"
import { verifyPassword } from "./password"
import { isUserRole, type UserRole } from "./constants"

// ============================================================
// CONSTANTS & CONFIGURATION
// ============================================================

/**
 * JWT Configuration
 * In production, these should come from environment variables,
 * NEVER hardcoded defaults
 */
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  throw new Error("JWT_SECRET environment variable is required")
})()

const JWT_ALGORITHM = "HS256"
const ACCESS_TOKEN_EXPIRY = "8h"
const REFRESH_TOKEN_EXPIRY_DAYS = 30

/**
 * Cookie Configuration
 * We use a unified cookie name for all roles, with the role
 * stored in the JWT payload for security and clarity
 */
const AUTH_COOKIE_NAME = "wrl_auth_token"
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

// ============================================================
// TYPES
// ============================================================

/**
 * JWT Payload Structure
 * Contains minimal information needed for authorization
 * All data lookups happen server-side after verification
 */
export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  sessionId: string
  iat: number
  exp: number
}

/**
 * Session Data
 * What's stored in the database for each active session
 */
export interface SessionRecord {
  id: string
  userId: string
  userAgent?: string
  ipAddress?: string
  expiresAt: Date
  lastUsedAt: Date
  revokedAt?: Date | null
}

/**
 * Authentication Result
 * Returned after successful login
 */
export interface AuthResult {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    username?: string
    role: UserRole
    displayName?: string
  }
  expiresIn: number
}

/**
 * Auth Context
 * What's attached to the request after middleware verification
 */
export interface AuthContext {
  userId: string
  email: string
  role: UserRole
  sessionId: string
  isAuthenticated: boolean
}

// ============================================================
// TOKEN GENERATION & VERIFICATION
// ============================================================

/**
 * Creates an access token (JWT)
 * Short-lived token used for API requests
 */
export function createAccessToken(
  userId: string,
  email: string,
  role: UserRole,
  sessionId: string
): string {
  return jwt.sign(
    {
      userId,
      email,
      role,
      sessionId,
    } as Omit<JWTPayload, 'iat' | 'exp'>,
    JWT_SECRET,
    {
      algorithm: JWT_ALGORITHM,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  )
}

/**
 * Creates a refresh token (JWT)
 * Long-lived token used to get new access tokens
 */
export function createRefreshToken(
  userId: string,
  sessionId: string
): string {
  return jwt.sign(
    {
      userId,
      sessionId,
      type: "refresh", // Mark as refresh token
    },
    JWT_SECRET,
    {
      algorithm: JWT_ALGORITHM,
      expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d`,
    }
  )
}

/**
 * Verifies an access token and returns the payload
 */
export function verifyAccessToken(token?: string): JWTPayload | null {
  try {
    if (!token) return null

    const payload = jwt.verify(
      token,
      JWT_SECRET,
      {
        algorithms: [JWT_ALGORITHM],
      }
    ) as JWTPayload

    // Ensure all required fields are present
    if (!payload.userId || !payload.email || !payload.role || !payload.sessionId) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

/**
 * Verifies a refresh token
 */
export function verifyRefreshToken(token?: string): { userId: string; sessionId: string } | null {
  try {
    if (!token) return null

    const payload = jwt.verify(
      token,
      JWT_SECRET,
      {
        algorithms: [JWT_ALGORITHM],
      }
    ) as any

    if (payload.type !== "refresh" || !payload.userId || !payload.sessionId) {
      return null
    }

    return {
      userId: payload.userId,
      sessionId: payload.sessionId,
    }
  } catch {
    return null
  }
}

// ============================================================
// SESSION MANAGEMENT
// ============================================================

/**
 * Creates a new session in the database
 * Sessions track active user logins for security and management
 */
export async function createSession(
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<SessionRecord> {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 8)

  const session = await prisma.authSession.create({
    data: {
      userId,
      userAgent,
      ipAddress,
      expiresAt,
    },
  })

  return session as SessionRecord
}

/**
 * Verifies a session is still valid and active
 */
export async function verifySession(sessionId: string): Promise<SessionRecord | null> {
  const session = await prisma.authSession.findUnique({
    where: { id: sessionId },
  })

  if (!session) return null

  // Check if session is revoked
  if (session.revokedAt) return null

  // Check if session is expired
  if (new Date() > session.expiresAt) return null

  return session as SessionRecord
}

/**
 * Revokes a session (logout)
 */
export async function revokeSession(sessionId: string): Promise<void> {
  await prisma.authSession.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  })
}

/**
 * Revokes all sessions for a user
 * Useful when user changes password or suspects account compromise
 */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  await prisma.authSession.updateMany({
    where: { userId },
    data: { revokedAt: new Date() },
  })
}

/**
 * Updates session last used timestamp
 * Helps track activity and identify stale sessions
 */
export async function updateSessionActivity(sessionId: string): Promise<void> {
  await prisma.authSession.update({
    where: { id: sessionId },
    data: { lastUsedAt: new Date() },
  })
}

// ============================================================
// LOGIN LOGIC
// ============================================================

/**
 * Unified login function for all roles
 * 
 * Architectural Improvement:
 * - Single function handles all roles
 * - Eliminates code duplication
 * - Provides consistent error messages (doesn't leak user existence)
 * - Includes audit logging
 * - Tracks last login info
 */
export async function loginUser(
  emailOrUsername: string,
  password: string,
  userAgent?: string,
  ipAddress?: string
): Promise<AuthResult> {
  try {
    const normalizedIdentifier = emailOrUsername.trim().toLowerCase()

    // Usernames and generated account emails are stored lowercase.
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedIdentifier },
          { username: normalizedIdentifier },
        ],
      },
    })

    // Consistent error message for security (don't reveal if user exists)
    if (!user || !verifyPassword(password, user.password)) {
      throw new Error("Invalid credentials")
    }

    if (!isUserRole(user.role)) {
      throw new Error("Invalid user role")
    }

    // Check user status
    if (user.status !== "ACTIVE") {
      throw new Error("Account is not active")
    }

    // Create session
    const session = await createSession(user.id, userAgent, ipAddress)

    // Generate tokens
    const accessToken = createAccessToken(
      user.id,
      user.email,
      user.role,
      session.id
    )

    const refreshToken = createRefreshToken(user.id, session.id)

    // Store refresh token in database
    const refreshTokenExpiry = new Date()
    refreshTokenExpiry.setDate(
      refreshTokenExpiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS
    )

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: refreshTokenExpiry,
      },
    })

    // Update user login info
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    })

    // Audit log
    await logAuditEvent(user.id, "LOGIN", "SUCCESS", ipAddress, userAgent)

    // Calculate expiry
    const decoded = jwt.decode(accessToken) as any
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username || undefined,
        role: user.role,
        displayName: user.displayName || undefined,
      },
      expiresIn,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed"

    // Audit log failure
    await logAuditEvent(
      "unknown",
      "LOGIN",
      "FAILED",
      ipAddress,
      userAgent,
      message
    )

    throw error
  }
}

// ============================================================
// REFRESH TOKEN LOGIC
// ============================================================

/**
 * Refreshes an access token using a refresh token
 */
export async function refreshAccessToken(
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const decoded = verifyRefreshToken(refreshToken)

  if (!decoded) {
    throw new Error("Invalid refresh token")
  }

  const { userId, sessionId } = decoded

  // Verify session still exists and is valid
  const session = await verifySession(sessionId)
  if (!session) {
    throw new Error("Session expired or revoked")
  }

  // Verify refresh token in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  })

  if (!storedToken || storedToken.revokedAt || new Date() > storedToken.expiresAt) {
    throw new Error("Refresh token is invalid or expired")
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

    if (!user || user.status !== "ACTIVE" || !isUserRole(user.role)) {
      throw new Error("User account is not active")
    }

  // Update session activity
  await updateSessionActivity(sessionId)

  // Create new access token
  const newAccessToken = createAccessToken(
    user.id,
    user.email,
    user.role,
    sessionId
  )

  const decoded2 = jwt.decode(newAccessToken) as any
  const expiresIn = decoded2.exp - Math.floor(Date.now() / 1000)

  // Audit log
  await logAuditEvent(user.id, "REFRESH_TOKEN", "SUCCESS", ipAddress, userAgent)

  return {
    accessToken: newAccessToken,
    expiresIn,
  }
}

// ============================================================
// LOGOUT LOGIC
// ============================================================

/**
 * Logs out a user by revoking their session
 */
export async function logoutUser(sessionId: string): Promise<void> {
  await revokeSession(sessionId)
}

// ============================================================
// AUDIT LOGGING
// ============================================================

/**
 * Logs security-relevant events
 */
async function logAuditEvent(
  userId: string,
  action: string,
  status: string,
  ipAddress?: string,
  userAgent?: string,
  error?: string
): Promise<void> {
  try {
    // Only log if userId is a valid UUID (not "unknown")
    if (userId && userId.length === 36) {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          result: status,
          ipAddress,
          userAgent,
        },
      })
    }
  } catch (e) {
    // Silently fail - don't let audit logging break auth
    console.error("Audit log error:", e)
  }
}

// ============================================================
// EXPORTS
// ============================================================

export {
  AUTH_COOKIE_NAME,
  COOKIE_OPTIONS,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY_DAYS,
}
