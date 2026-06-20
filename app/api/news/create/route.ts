import { NextRequest } from "next/server"

import { requireRole } from "@/lib/auth-verify"
import {
  apiError,
  apiSuccess,
  parseJsonBody,
  ValidationError,
  withErrorHandling,
} from "@/lib/api-utils"
import { prisma } from "@/lib/prisma"

type CreateNewsRequest = {
  title?: string
  content?: string
  mediaUrl?: string
  mediaType?: string
}

async function createNewsHandler(req: NextRequest): Promise<Response> {
  const user = await requireRole(["ADMIN", "JOURNALIST"])
  const body = await parseJsonBody<CreateNewsRequest>(req)

  const title = String(body.title || "").trim()
  const content = String(body.content || "").trim()
  const mediaUrl = String(body.mediaUrl || "").trim()
  const mediaType = String(body.mediaType || "").trim().toUpperCase()

  if (!title) {
    throw new ValidationError("Title is required", { field: "title" })
  }

  if (!content) {
    throw new ValidationError("Content is required", { field: "content" })
  }

  if (title.length > 200) {
    throw new ValidationError("Title must be under 200 characters", {
      field: "title",
    })
  }

  if (content.length > 5000) {
    throw new ValidationError("Content must be under 5000 characters", {
      field: "content",
    })
  }

  if (mediaType && !["IMAGE", "VIDEO", "AUDIO"].includes(mediaType)) {
    throw new ValidationError("Media type must be IMAGE, VIDEO, or AUDIO", {
      field: "mediaType",
    })
  }

  const news = await prisma.news.create({
    data: {
      title,
      content,
      mediaUrl: mediaUrl || null,
      mediaType: mediaUrl ? mediaType || "IMAGE" : null,
      authorId: user.id,
    },
  })

  return apiSuccess(news, 201)
}

export const POST = withErrorHandling(createNewsHandler)
export const GET = () => apiError(new Error("Method not allowed"))
