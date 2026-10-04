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

    if (loading) return

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

  const fieldClassName =
    "h-12 w-full rounded-md border border-[#071512]/15 bg-[#f8f6ef] px-4 text-base text-[#071512] outline-none transition-colors placeholder:text-[#66736e] focus:border-[var(--wrl-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--wrl-focus-ring)]/55"

  return (
    <div className="rounded-lg border border-[#071512]/10 bg-white p-6 text-[#071512] shadow-[var(--wrl-shadow-elevated)] sm:p-8 lg:p-10">
      <div className="mb-8">
        <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Send Us A Message</p>
        <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">How can we help?</h2>
        <p className="mt-3 leading-7 text-[#52605b]">
          Complete the form below and your message will be submitted to Wantok Radio Light.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-black">
              Name <span className="text-[var(--wrl-live-red)]" aria-hidden="true">*</span>
              <span className="sr-only"> (required)</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className={fieldClassName}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-black">
              Email <span className="text-[var(--wrl-live-red)]" aria-hidden="true">*</span>
              <span className="sr-only"> (required)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              inputMode="email"
              value={formData.email}
              onChange={handleChange}
              className={fieldClassName}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="mb-2 block text-sm font-black">
            Subject <span className="text-[var(--wrl-live-red)]" aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Enter subject"
            autoComplete="off"
            value={formData.subject}
            onChange={handleChange}
            className={fieldClassName}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-black">
            Message <span className="text-[var(--wrl-live-red)]" aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Write your message"
            value={formData.message}
            onChange={handleChange}
            className="min-h-40 w-full resize-y rounded-md border border-[#071512]/15 bg-[#f8f6ef] px-4 py-3 text-base text-[#071512] outline-none transition-colors placeholder:text-[#66736e] focus:border-[var(--wrl-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--wrl-focus-ring)]/55"
            disabled={loading}
            required
          />
        </div>

        {successMessage && (
          <p role="status" aria-live="polite" className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-900">
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-900">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[var(--wrl-accent-gold)] px-6 py-3 text-sm font-black uppercase text-[var(--wrl-accent-gold-foreground)] shadow-[var(--wrl-shadow-soft)] transition-colors hover:bg-[#ffda55] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  )
}
