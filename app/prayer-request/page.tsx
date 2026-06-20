"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const countries = [
  { name: "Papua New Guinea", code: "+675" },
  { name: "Australia", code: "+61" },
  { name: "New Zealand", code: "+64" },
  { name: "Fiji", code: "+679" },
  { name: "Solomon Islands", code: "+677" },
  { name: "United States", code: "+1" },
  { name: "Philippines", code: "+63" },
  { name: "Indonesia", code: "+62" },
]

export default function PrayerRequestPage() {
  const router = useRouter()

  const [loading, setLoading] =
    useState(false)

  const [form, setForm] = useState({
    fullName: "",
    country: "Papua New Guinea",
    countryCode: "+675",
    phone: "",
    email: "",
    location: "",
    request: "",
  })

  //////////////////////////////////////////////////////
  // HANDLE INPUT
  //////////////////////////////////////////////////////

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    if (e.target.name === "country") {
      const selectedCountry = countries.find(
        (country) => country.name === e.target.value
      )

      setForm({
        ...form,
        country: e.target.value,
        countryCode: selectedCountry?.code ?? form.countryCode,
      })

      return
    }

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  //////////////////////////////////////////////////////
  // SUBMIT
  //////////////////////////////////////////////////////

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (
      !form.fullName ||
      !form.request
    ) {
      alert(
        "Please complete required fields"
      )

      return
    }

    try {
      setLoading(true)

      const res = await fetch(
        "/api/prayer-request",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            fullName: form.fullName,
            phone:
              form.phone.trim()
                ? form.countryCode +
                  " " +
                  form.phone.trim()
                : "",
            email: form.email,
            location: form.location,
            request: form.request,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(
          data.error ||
            "Failed to send request"
        )

        return
      }

      alert(
        "Prayer request sent successfully"
      )

      router.push("/")

    } catch (err) {
      console.error(err)

      alert("Something went wrong")

    } finally {
      setLoading(false)
    }
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-[#003b36] px-4 py-20 text-white">

      <div className="mx-auto max-w-3xl rounded-3xl bg-black/30 p-10">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black text-yellow-400">
            Prayer Request
          </h1>

          <p className="mt-4 text-lg text-gray-300">
            Send your prayer request to our
            ministry team.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* FULL NAME */}
          <div>
            <label className="mb-2 block text-sm font-bold text-yellow-400">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-yellow-400"
              required
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="mb-2 block text-sm font-bold text-yellow-400">
              Country
            </label>

            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-yellow-400"
            >
              {countries.map((country) => (
                <option
                  key={country.name}
                  value={country.name}
                  className="bg-[#003b36]"
                >
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* PHONE */}
          <div>
            <label className="mb-2 block text-sm font-bold text-yellow-400">
              Phone Number
            </label>

            <div className="flex gap-3">

              {/* COUNTRY CODE */}
              <select
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                className="w-40 rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none transition focus:border-yellow-400"
              >
                {countries.map((country) => (
                  <option
                    key={country.code}
                    value={country.code}
                    className="bg-[#003b36]"
                  >
                    {country.code}
                  </option>
                ))}
              </select>

              {/* PHONE INPUT */}
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-yellow-400"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm font-bold text-yellow-400">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-yellow-400"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="mb-2 block text-sm font-bold text-yellow-400">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Where are you listening from?"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-yellow-400"
            />
          </div>

          {/* PRAYER REQUEST */}
          <div>
            <label className="mb-2 block text-sm font-bold text-yellow-400">
              Prayer Request
            </label>

            <textarea
              name="request"
              value={form.request}
              onChange={handleChange}
              placeholder="Write your prayer request here..."
              rows={7}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-yellow-400"
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-yellow-400 px-6 py-4 text-lg font-black text-black transition hover:bg-yellow-300 disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : "Send Prayer Request"}
          </button>
        </form>
      </div>
    </div>
  )
}
