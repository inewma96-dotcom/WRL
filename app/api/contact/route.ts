import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const name = body.name?.trim()
    const email = body.email?.trim()
    const subject = body.subject?.trim()
    const message = body.message?.trim()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    console.log("New contact form submission:")
    console.log({
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { message: "Message submitted successfully." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact form error:", error)

    return NextResponse.json(
      { error: "Something went wrong while sending your message." },
      { status: 500 }
    )
  }
}