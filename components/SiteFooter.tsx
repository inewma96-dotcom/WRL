"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowRight,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Music2,
  Phone,
  Youtube,
} from "lucide-react"

const phoneNumber = "+675 326 0946"
const emailAddress = "info@wantokradio.org"

const socialLinks = [
  {
    name: "TikTok",
    href: "https://www.tiktok.com/search?q=Wantok%20Radio%20Light",
    icon: Music2,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/results?search_query=Wantok+Radio+Light",
    icon: Youtube,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/search/results/all/?keywords=Wantok%20Radio%20Light",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/explore/search/keyword/?q=Wantok%20Radio%20Light",
    icon: Instagram,
  },
]

const footerLinkClass =
  "group inline-flex w-fit items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-white/78 transition duration-300 hover:-translate-y-1 hover:scale-[1.04] hover:bg-yellow-300 hover:text-[#003b36] hover:shadow-[0_12px_26px_rgba(250,204,21,0.28)]"

export default function SiteFooter() {
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="relative isolate overflow-hidden border-t border-yellow-300/25 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 -z-30 scale-105 bg-cover bg-center opacity-30 blur-[1px]"
        style={{ backgroundImage: "url('/images/mainwall.png')" }}
      />
      <div className="absolute inset-0 -z-20 bg-black/65" />
      <div className="absolute inset-0 -z-20 bg-[#003b36]/45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/35 via-[#003b36]/72 to-black/35" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.15fr_0.9fr_0.95fr_1fr_1.45fr]">
          <div className="space-y-6">
            <Link
              href="/"
              className="group inline-flex transition duration-300 hover:-translate-y-1 hover:scale-[1.03]"
            >
              <Image
                src="/images/WRL Logo.jpg"
                alt="Wantok Radio Light"
                width={170}
                height={50}
                className="object-contain drop-shadow-[0_0_10px_rgba(250,204,21,0.22)] transition duration-300 group-hover:drop-shadow-[0_0_20px_rgba(250,204,21,0.48)]"
              />
            </Link>

            <a href={`tel:${phoneNumber.replace(/\s/g, "")}`} className={footerLinkClass}>
              <Phone className="h-4 w-4 text-yellow-300 transition group-hover:text-[#003b36]" aria-hidden="true" />
              {phoneNumber}
            </a>
          </div>

          <div>
            <h2 className="text-sm font-bold text-yellow-300">Quick Links</h2>
            <nav className="mt-5 flex flex-col gap-2" aria-label="Footer quick links">
              <Link href="/" className={footerLinkClass}>
                Home
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-bold text-yellow-300">Location</h2>
            <div className="mt-5 space-y-3 text-sm leading-6 text-white/78">
              <p className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-yellow-300" aria-hidden="true" />
                <span>
                  Gerehu Stage 2
                  <br />
                  Sivari Road
                  <br />
                  Port Moresby
                </span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-yellow-300">Important Details</h2>
            <div className="mt-5 flex flex-col gap-2">
              <a href={`tel:${phoneNumber.replace(/\s/g, "")}`} className={footerLinkClass}>
                Phone: 675 326 0946
              </a>
              <a href="tel:+6753262933" className={footerLinkClass}>
                Phone2: (675) 3262933
              </a>
              <a href="tel:+6753261104" className={footerLinkClass}>
                Fax: (675)3261104
              </a>
              <a href={`mailto:${emailAddress}`} className={footerLinkClass}>
                <Mail className="h-4 w-4 text-yellow-300 transition group-hover:text-[#003b36]" aria-hidden="true" />
                {emailAddress}
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-yellow-300">Let Us Know You Visited</h2>
            <form
              onSubmit={(event) => event.preventDefault()}
              className="mt-5 flex overflow-hidden rounded-md bg-white shadow-[0_14px_32px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_42px_rgba(250,204,21,0.22)]"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 px-4 py-3 text-sm text-[#003b36] outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="grid w-14 place-items-center bg-white text-slate-500 transition duration-300 hover:bg-yellow-300 hover:text-[#003b36]"
                aria-label="Submit email"
              >
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-yellow-300/35 bg-black/25 text-yellow-200 shadow-[0_10px_26px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:scale-110 hover:border-yellow-200 hover:bg-yellow-300 hover:text-[#003b36] hover:shadow-[0_16px_32px_rgba(250,204,21,0.32)]"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/68">
          Copyright Wantok Radio Light 2020 - Mobirise - All Rights Reserved
        </div>
      </div>
    </footer>
  )
}
