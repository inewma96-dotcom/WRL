/**
 * REFRESH TOKEN ENDPOINT
 * ======================
 * 
 * Generates a new access token using a refresh token
 * Allows users to stay logged in without re-entering credentials
 */

import { NextRequest } from "next/server"
import {
  refreshAccessToken,
  AUTH_COOKIE_NAME,
  COOKIE_OPTIONS,
} from "@/lib/auth-service"
import {
  apiSuccess,
  apiError,
  withErrorHandling,
  getClientIp,
  getUserAgent,
  parseJsonBody,
  ValidationError,
  AuthenticationError,
} from "@/lib/api-utils"

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface RefreshTokenRequest {
  refreshToken: string
}

interface RefreshTokenResponse {
  accessToken: string
  expiresIn: number
}

// ============================================================
// REQUEST HANDLER
// ============================================================

async function refreshTokenHandler(req: NextRequest): Promise<Response> {
  //////////////////////////////////////////////////////
  // PARSE REQUEST BODY
  //////////////////////////////////////////////////////

  const body = await parseJsonBody<RefreshTokenRequest>(req)
  const { refreshToken } = body

  if (!refreshToken || typeof refreshToken !== "string") {
    throw new ValidationError("Refresh token is required", {
      field: "refreshToken",
    })
  }

  //////////////////////////////////////////////////////
  // GET CLIENT INFO
  //////////////////////////////////////////////////////

  const clientIp = getClientIp(req)
  const userAgent = getUserAgent(req)

  //////////////////////////////////////////////////////
  // REFRESH TOKEN
  //////////////////////////////////////////////////////

  try {
    const { accessToken, expiresIn } = await refreshAccessToken(
      refreshToken.trim(),
      userAgent,
      clientIp
    )

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    const response = apiSuccess<RefreshTokenResponse>(
      {
        accessToken,
        expiresIn,
      },
      200
    )

    //////////////////////////////////////////////////////
    // SET AUTH COOKIE
    //////////////////////////////////////////////////////

    response.cookies.set(AUTH_COOKIE_NAME, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: Math.floor(expiresIn), // Seconds
    })

    return response
  } catch (error) {
    if (error instanceof Error) {
      throw new AuthenticationError(error.message)
    }
    throw error
  }
}

//////////////////////////////////////////////////////
// EXPORT HANDLERS
//////////////////////////////////////////////////////

export const POST = withErrorHandling(refreshTokenHandler)
export const GET = () => apiError(new Error("Method not allowed"))
