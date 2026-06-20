/**
 * CURRENT USER ENDPOINT
 * =====================
 * 
 * Returns the currently authenticated user's information
 * Used by frontend to verify auth status on page load
 */

import { NextRequest } from "next/server"
import {
  checkAuthenticated,
} from "@/lib/auth-verify"
import {
  apiSuccess,
  apiError,
  withErrorHandling,
  AuthenticationError,
} from "@/lib/api-utils"

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface CurrentUserResponse {
  id: string
  email: string
  username?: string
  role: string
  displayName?: string
}

// ============================================================
// REQUEST HANDLER
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getCurrentUserHandler(_req: NextRequest): Promise<Response> {
  //////////////////////////////////////////////////////
  // GET AUTHENTICATED USER
  //////////////////////////////////////////////////////

  const user = await checkAuthenticated()

  if (!user) {
    throw new AuthenticationError("Not authenticated")
  }

  //////////////////////////////////////////////////////
  // RESPONSE
  //////////////////////////////////////////////////////

  return apiSuccess<CurrentUserResponse>({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    displayName: user.displayName,
  })
}

//////////////////////////////////////////////////////
// EXPORT HANDLERS
//////////////////////////////////////////////////////

export const GET = withErrorHandling(getCurrentUserHandler)
export const POST = () => apiError(new Error("Method not allowed"))
