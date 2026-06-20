import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

import fs from "fs"
import path from "path"
import { randomUUID } from "crypto"

import { requireRole } from "@/lib/auth-verify"

const MAX_AUDIO_SIZE = 500 * 1024 * 1024

//////////////////////////////////////////////////////
// ALLOWED MIME TYPES
//////////////////////////////////////////////////////

const SUPPORTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/m4a",
  "audio/ogg",
] as const

export async function POST(
  req: Request
) {
  try {
    //////////////////////////////////////////////////////
    // AUTH
    //////////////////////////////////////////////////////

    await requireRole([
      "ADMIN",
    ])

    //////////////////////////////////////////////////////
    // FORM DATA
    //////////////////////////////////////////////////////

    const formData =
      await req.formData()

    const uploadedFiles = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File)

    const legacyAudioFile = formData.get("audio")
    const files =
      uploadedFiles.length > 0
        ? uploadedFiles
        : legacyAudioFile instanceof File
          ? [legacyAudioFile]
          : []

    const title = String(
      formData.get("title") || ""
    ).trim()

    const description = String(
      formData.get(
        "description"
      ) || ""
    ).trim()

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Title is required",
        },
        {
          status: 400,
        }
      )
    }

    if (files.length === 0) {
      return NextResponse.json(
        {
          error:
            "File is required",
        },
        {
          status: 400,
        }
      )
    }

    const created = []

    for (const file of files) {
      if (!SUPPORTED_AUDIO_TYPES.includes(file.type as typeof SUPPORTED_AUDIO_TYPES[number])) {
        return NextResponse.json(
          {
            error:
              "Invalid file format. Airwaves only accepts audio files.",
            provided: file.type,
          },
          {
            status: 400,
          }
        )
      }

      if (file.size === 0) {
        return NextResponse.json(
          {
            error:
              "File is empty",
          },
          {
            status: 400,
          }
        )
      }

      if (file.size > MAX_AUDIO_SIZE) {
        return NextResponse.json(
          {
            error:
              "Audio file too large (max 500MB)",
          },
          {
            status: 400,
          }
        )
      }

      const uploadDir =
        path.join(
          process.cwd(),
          "public/uploads/audio"
        )

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, {
          recursive: true,
        })
      }

      const ext = path.extname(file.name)
      const fileName = `${randomUUID()}${ext}`
      const filePath =
        path.join(
          uploadDir,
          fileName
        )

      const bytes =
        await file.arrayBuffer()

      const buffer =
        Buffer.from(bytes)

      fs.writeFileSync(
        filePath,
        buffer
      )

      const item =
        await prisma.airwaveContent.create(
          {
            data: {
              title,
              description,
              mediaUrl: `/uploads/audio/${fileName}`,
              mediaType: "AUDIO",
            },
          }
        )

      created.push(item)
    }

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json(
      {
        success: true,
        message:
          "Airwaves content uploaded successfully",
        data: created,
      },
      {
        status: 201,
      }
    )

  } catch (err) {
    console.error(
      "AIRWAVE_UPLOAD_ERROR",
      err
    )

    return NextResponse.json(
      {
        error:
          "Failed to upload audio",
      },
      {
        status: 500,
      }
    )
  }
}
