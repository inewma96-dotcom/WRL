/**
 * NEWS UPLOAD ENDPOINT
 * ====================
 * 
 * Architectural Improvements:
 * - Uses new unified auth verification (requireRole)
 * - Standardized request parsing and validation
 * - Consistent error handling with typed errors
 * - Route handler wrapper for auto error catching
 * - Proper HTTP method handling
 * - Input validation before file processing
 * - Secure file naming (uuid-based)
 * - Media type detection with validation
 * - Database transaction-safe operations
 */

import { NextRequest } from "next/server"
import path from "path"
import fs from "fs"
import { randomUUID } from "crypto"
import {
  requireRole,
} from "@/lib/auth-verify"
import {
  apiSuccess,
  apiError,
  withErrorHandling,
  ValidationError,
  withRateLimit,
} from "@/lib/api-utils"
import { prisma } from "@/lib/prisma"

// ============================================================
// TYPES
// ============================================================

interface NewsUploadResponse {
  id: string
  title: string
  content: string
  mediaUrl: string | null
  mediaType: string | null
  authorId: string | null
  createdAt: string
}

// ============================================================
// CONSTANTS
// ============================================================

// Supported media types
const SUPPORTED_MEDIA_TYPES: Record<string, string> = {
  "video/mp4": "VIDEO",
  "video/webm": "VIDEO",
  "video/quicktime": "VIDEO",
  "image/jpeg": "IMAGE",
  "image/png": "IMAGE",
  "image/gif": "IMAGE",
  "image/webp": "IMAGE",
}

// File size limits (in bytes)
const MAX_FILE_SIZE_VIDEO = 2 * 1024 * 1024 * 1024 // 2GB
const MAX_FILE_SIZE_IMAGE = 50 * 1024 * 1024 // 50MB

// ============================================================
// REQUEST HANDLER
// ============================================================

async function uploadNewsHandler(req: NextRequest): Promise<Response> {
  //////////////////////////////////////////////////////
  // AUTHENTICATION & AUTHORIZATION
  //////////////////////////////////////////////////////

  const user = await requireRole(["ADMIN", "JOURNALIST"])

  //////////////////////////////////////////////////////
  // RATE LIMITING - Per user, per minute
  //////////////////////////////////////////////////////

  const rateLimitKey = `news-upload:${user.id}`
  const { allowed, response: rateLimitResponse } = await withRateLimit(
    req,
    rateLimitKey,
    5, // Max 5 uploads per user
    60 * 1000 // Per minute
  )

  if (!allowed) {
    return rateLimitResponse!
  }

  //////////////////////////////////////////////////////
  // PARSE MULTIPART FORM DATA
  //////////////////////////////////////////////////////

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    throw new ValidationError("Invalid form data", {
      error: "Failed to parse multipart form data",
    })
  }

  //////////////////////////////////////////////////////
  // EXTRACT FORM FIELDS
  //////////////////////////////////////////////////////

  const file = formData.get("file") as File | null
  const title = (formData.get("title") as string)?.trim() || ""
  const content = (formData.get("content") as string)?.trim() || ""

  if (file && !(file instanceof File)) {
    throw new ValidationError("Invalid file", {
      field: "file",
    })
  }

  // Validate metadata
  if (!title) {
    throw new ValidationError("Title is required", {
      field: "title",
    })
  }

  if (title.length < 3 || title.length > 200) {
    throw new ValidationError("Title must be between 3 and 200 characters", {
      field: "title",
    })
  }

  if (content.length > 5000) {
    throw new ValidationError("Content must be under 5000 characters", {
      field: "content",
    })
  }

  //////////////////////////////////////////////////////
  // VALIDATE FILE
  //////////////////////////////////////////////////////

  const mediaType = file ? SUPPORTED_MEDIA_TYPES[file.type] : null

  if (file && !mediaType) {
    throw new ValidationError("News only accepts image or video files", {
      field: "file",
      provided: file.type,
      supportedTypes: Object.keys(SUPPORTED_MEDIA_TYPES),
    })
  }

  if (file && file.size === 0) {
    throw new ValidationError("File is empty", {
      field: "file",
    })
  }

  if (file && mediaType) {
    const maxSize =
      mediaType === "VIDEO"
        ? MAX_FILE_SIZE_VIDEO
        : MAX_FILE_SIZE_IMAGE

    if (file.size > maxSize) {
      const maxSizeMB = Math.floor(maxSize / (1024 * 1024))
      throw new ValidationError(
        `File size exceeds ${maxSizeMB}MB limit`,
        {
          field: "file",
          maxSizeBytes: maxSize,
          currentSizeBytes: file.size,
          maxSizeMB,
        }
      )
    }
  }

  //////////////////////////////////////////////////////
  // SAVE FILE
  //////////////////////////////////////////////////////

  let mediaUrl: string | null = null
  let filePath: string | null = null

  if (file) {
    const uploadDir = path.join(process.cwd(), "public/uploads/news")

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const ext = path.extname(file.name)
    const secureFileName = `${randomUUID()}${ext}`
    filePath = path.join(uploadDir, secureFileName)

    try {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      fs.writeFileSync(filePath, buffer)
      mediaUrl = `/uploads/news/${secureFileName}`
    } catch {
      throw new Error("Failed to save file to disk")
    }
  }

  //////////////////////////////////////////////////////
  // CREATE DATABASE RECORD
  //////////////////////////////////////////////////////

  try {
    const news = await prisma.news.create({
      data: {
        title,
        content,
        mediaUrl,
        mediaType,
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        mediaUrl: true,
        mediaType: true,
        authorId: true,
        createdAt: true,
      },
    })

    return apiSuccess<NewsUploadResponse>(
      {
        id: news.id,
        title: news.title,
        content: news.content,
        mediaUrl: news.mediaUrl,
        mediaType: news.mediaType,
        authorId: news.authorId,
        createdAt: news.createdAt.toISOString(),
      },
      201 // Created
    )
  } catch (error) {
    // Cleanup uploaded file on database error
    if (filePath) {
      try {
        fs.unlinkSync(filePath)
      } catch (e) {
        console.error("Failed to cleanup uploaded file:", e)
      }
    }

    throw error
  }
}

//////////////////////////////////////////////////////
// EXPORT HANDLERS
//////////////////////////////////////////////////////

export const POST = withErrorHandling(uploadNewsHandler)
export const GET = () => apiError(new Error("Method not allowed"))
export const PUT = () => apiError(new Error("Method not allowed"))
export const DELETE = () => apiError(new Error("Method not allowed"))
