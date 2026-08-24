"use client"

import { useState } from "react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.")
      }

      setSuccessMessage("Your message has been sent successfully.")
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-[#071512]/10 bg-white p-6 text-[#071512] shadow-[0_24px_70px_rgba(7,21,18,0.16)] md:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-black">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="h-12 w-full rounded-md border border-[#071512]/15 bg-[#f8f6ef]/70 px-4 text-sm outline-none transition focus:border-[#082b52] focus:bg-white focus:ring-2 focus:ring-yellow-400/70"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-black">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="h-12 w-full rounded-md border border-[#071512]/15 bg-[#f8f6ef]/70 px-4 text-sm outline-none transition focus:border-[#082b52] focus:bg-white focus:ring-2 focus:ring-yellow-400/70"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="mb-2 block text-sm font-black">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Enter subject"
            value={formData.subject}
            onChange={handleChange}
            className="h-12 w-full rounded-md border border-[#071512]/15 bg-[#f8f6ef]/70 px-4 text-sm outline-none transition focus:border-[#082b52] focus:bg-white focus:ring-2 focus:ring-yellow-400/70"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-black">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Write your message"
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-md border border-[#071512]/15 bg-[#f8f6ef]/70 px-4 py-3 text-sm outline-none transition focus:border-[#082b52] focus:bg-white focus:ring-2 focus:ring-yellow-400/70"
            required
          />
        </div>

        {successMessage && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-yellow-300 px-6 py-3 text-sm font-black uppercase tracking-normal text-[#071512] shadow-[0_14px_32px_rgba(250,204,21,0.2)] transition hover:-translate-y-0.5 hover:bg-[#071512] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  )
}
