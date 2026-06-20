/**
 * API RESPONSE & ERROR UTILITIES
 * ==============================
 * 
 * Standardized response and error handling across all API routes.
 * 
 * Architectural Decision:
 * Previously, API routes had inconsistent response formats and error handling.
 * This utility ensures all endpoints respond with a consistent shape,
 * making frontend integration cleaner and more predictable.
 * 
 * Response Format:
 * {
 *   success: boolean
 *   data?: T
 *   error?: string
 *   code?: string
 *   timestamp: number
 * }
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ============================================================
// ERROR TYPES
// ============================================================

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public status: number = 400,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super("VALIDATION_ERROR", message, 400, details)
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Unauthorized") {
    super("AUTHENTICATION_ERROR", message, 401)
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Forbidden") {
    super("AUTHORIZATION_ERROR", message, 403)
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} not found`, 404)
    this.name = "NotFoundError"
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super("CONFLICT", message, 409)
    this.name = "ConflictError"
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super("RATE_LIMIT_EXCEEDED", message, 429)
    this.name = "RateLimitError"
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super("INTERNAL_SERVER_ERROR", message, 500)
    this.name = "InternalServerError"
  }
}

// ============================================================
// RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
  timestamp: number
}

// ============================================================
// RESPONSE BUILDERS
// ============================================================

/**
 * Creates a success response
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: Date.now(),
    } as ApiResponse<T>,
    { status }
  )
}

/**
 * Creates an error response
 */
export function apiError(
  error: AppError | Error,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _request?: NextRequest
): NextResponse<ApiResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp: Date.now(),
      } as ApiResponse,
      { status: error.status }
    )
  }

  // Generic error
  return NextResponse.json(
    {
      success: false,
      error: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      timestamp: Date.now(),
    } as ApiResponse,
    { status: 500 }
  )
}

/**
 * Creates a validation error response with field details
 */
export function apiValidationError(
  message: string,
  fields?: Record<string, string>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: "VALIDATION_ERROR",
      details: fields,
      timestamp: Date.now(),
    } as ApiResponse,
    { status: 400 }
  )
}

// ============================================================
// ROUTE HANDLER WRAPPER
// ============================================================

/**
 * Wraps a route handler with automatic error handling
 * 
 * Usage:
 * export const POST = withErrorHandling(async (req, ctx) => {
 *   // Your code here
 * })
 */
export function withErrorHandling<T extends Record<string, any>>(
  handler: (
    req: NextRequest,
    context: T
  ) => Promise<NextResponse<any> | Response>
) {
  return async (req: NextRequest, context: T) => {
    try {
      const response = await handler(req, context)
      return response
    } catch (error) {
      console.error(`[${req.method} ${req.nextUrl.pathname}]`, error)

      if (error instanceof AppError) {
        return apiError(error, req)
      }

      if (error instanceof Error) {
        // Log detailed errors in development
        if (process.env.NODE_ENV === "development") {
          console.error("Full error:", error)
        }

        return apiError(new InternalServerError(error.message), req)
      }

      return apiError(new InternalServerError(), req)
    }
  }
}

// ============================================================
// REQUEST UTILITIES
// ============================================================

/**
 * Gets client IP from request
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-client-ip") ||
    "unknown"
  )
}

/**
 * Gets user agent from request
 */
export function getUserAgent(request: NextRequest): string | undefined {
  return request.headers.get("user-agent") || undefined
}

/**
 * Safely parses JSON request body
 */
export async function parseJsonBody<T = any>(
  request: NextRequest
): Promise<T> {
  try {
    return await request.json()
  } catch {
    throw new ValidationError("Invalid JSON body")
  }
}

// ============================================================
// RATE LIMITING UTILITIES
// ============================================================

interface RateLimitBucket {
  count: number
  resetAt: number
}

const rateLimitBuckets = new Map<string, RateLimitBucket>()

/**
 * Check rate limit for a key
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const now = Date.now()
  const bucket = rateLimitBuckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    const newBucket: RateLimitBucket = {
      count: 1,
      resetAt: now + windowMs,
    }
    rateLimitBuckets.set(key, newBucket)
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: newBucket.resetAt,
    }
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.resetAt,
    }
  }

  bucket.count += 1
  return {
    allowed: true,
    remaining: limit - bucket.count,
    resetAt: bucket.resetAt,
  }
}

/**
 * Middleware for rate limiting
 */
export async function withRateLimit(
  request: NextRequest,
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; response?: NextResponse<ApiResponse> }> {
  const rateLimitResult = checkRateLimit(key, limit, windowMs)

  if (!rateLimitResult.allowed) {
    return {
      allowed: false,
      response: apiError(
        new RateLimitError(
          `Rate limit exceeded. Try again after ${Math.ceil(
            (rateLimitResult.resetAt - Date.now()) / 1000
          )}s`
        )
      ),
    }
  }

  return { allowed: true }
}

// ============================================================
// CLEANUP
// ============================================================

/**
 * Clean up old rate limit buckets periodically
 * Prevent memory leaks from accumulating old entries
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key)
    }
  }
}, 60 * 1000) // Every minute
