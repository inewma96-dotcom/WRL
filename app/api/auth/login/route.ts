import { NextRequest } from "next/server"
import { loginUser, AUTH_COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth-service"
import { apiSuccess, apiError, withErrorHandling, getClientIp, getUserAgent, parseJsonBody, ValidationError, AuthenticationError } from "@/lib/api-utils"

interface LoginRequest {
  emailOrUsername?: string
  email?: string
  username?: string
  password?: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    email: string
    username?: string
    role: string
    displayName?: string
  }
}

async function loginHandler(req: NextRequest): Promise<Response> {
  const body = await parseJsonBody<LoginRequest>(req)
  const { emailOrUsername, email, username, password } = body
  const identifier = String(emailOrUsername || email || username || "").trim()

  if (!identifier) {
    throw new ValidationError("Email or username is required", {
      field: "emailOrUsername",
    })
  }

  if (!password || typeof password !== "string") {
    throw new ValidationError("Password is required", {
      field: "password",
    })
  }

  const clientIp = getClientIp(req)
  const userAgent = getUserAgent(req)

  try {
    const authResult = await loginUser(
      identifier,
      password,
      userAgent,
      clientIp
    )

    const response = apiSuccess<LoginResponse>(
      {
        accessToken: authResult.accessToken,
        refreshToken: authResult.refreshToken,
        expiresIn: authResult.expiresIn,
        user: {
          id: authResult.user.id,
          email: authResult.user.email,
          username: authResult.user.username,
          role: authResult.user.role,
          displayName: authResult.user.displayName,
        },
      },
      200
    )

    response.cookies.set(AUTH_COOKIE_NAME, authResult.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: Math.floor(authResult.expiresIn),
    })

    return response
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid credentials" || error.message === "Account is not active") {
        throw new AuthenticationError("Invalid email/username or password")
      }
    }

    throw error
  }
}

export const POST = withErrorHandling(loginHandler)
export const GET = () => apiError(new Error("Method not allowed"))
