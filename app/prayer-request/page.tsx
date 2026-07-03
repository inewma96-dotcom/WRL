"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Cote d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
]

export default function PrayerRequestPage() {
  const router = useRouter()

  const [loading, setLoading] =
    useState(false)

  const [form, setForm] = useState({
    fullName: "",
    country: "Papua New Guinea",
    cityTown: "",
    phone: "",
    email: "",
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
      !form.country ||
      !form.cityTown ||
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
            phone: form.phone,
            email: form.email,
            location: `${form.cityTown}, ${form.country}`,
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
    <main
      className="relative isolate min-h-screen overflow-hidden bg-[#003b36] bg-cover bg-center bg-fixed px-4 py-20 text-white md:py-28"
      style={{ backgroundImage: "url('/images/hero.jpg')" }}
    >
      <div className="absolute inset-0 -z-20 bg-black/62" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#003b36]/45 via-[#003b36]/78 to-[#003b36]" />

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-300">
            Prayer Request
          </p>
          <h1 className="mt-5 text-5xl font-black leading-tight tracking-normal md:text-7xl">
            Send Your Prayer Request
          </h1>
          <p className="mt-7 text-lg font-medium leading-8 text-white/88 md:text-2xl md:leading-10">
            Share what is on your heart. Our ministry team will receive your
            request and stand with you in prayer.
          </p>
        </section>

        <section className="rounded-lg border border-white/12 bg-black/45 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-md md:p-10">

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
              Country Where You Are Listening From
            </label>

            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-yellow-400"
            >
              {countries.map((country) => (
                <option
                  key={country}
                  value={country}
                  className="bg-[#003b36]"
                >
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* CITY / TOWN */}
          <div>
            <label className="mb-2 block text-sm font-bold text-yellow-400">
              City/Town
            </label>

            <input
              type="text"
              name="cityTown"
              value={form.cityTown}
              onChange={handleChange}
              placeholder="Enter your city or town"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-yellow-400"
              required
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="mb-2 block text-sm font-bold text-yellow-400">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-yellow-400"
            />
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
        </section>
      </div>
    </main>
  )
}
