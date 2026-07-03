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
    <div className="rounded-lg border border-black/10 bg-white/90 p-6 text-[#071512] shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded border border-black/15 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded border border-black/15 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="mb-2 block text-sm font-semibold">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Enter subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full rounded border border-black/15 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-semibold">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Write your message"
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded border border-black/15 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        {successMessage && (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-yellow-400 px-6 py-3 font-black uppercase tracking-normal text-black transition hover:-translate-y-1 hover:bg-[#071512] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  )
}
