"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Music2, Phone, Youtube } from "lucide-react"
import { navLinks } from "@/lib/constants"

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/search/top?q=wantok%20radio%20light", icon: Facebook },
  { name: "YouTube", href: "https://www.youtube.com/results?search_query=Wantok+Radio+Light", icon: Youtube },
  { name: "LinkedIn", href: "https://www.linkedin.com/search/results/all/?keywords=Wantok%20Radio%20Light", icon: Linkedin },
  { name: "Instagram", href: "https://www.instagram.com/explore/search/keyword/?q=Wantok%20Radio%20Light", icon: Instagram },
  { name: "TikTok", href: "https://www.tiktok.com/search?q=Wantok%20Radio%20Light", icon: Music2 },
]

const footerLinkClass =
  "inline-flex w-fit items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-white/78 transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:text-[#003b36]"

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
      <div className="absolute inset-0 -z-20 bg-black/68" />
      <div className="absolute inset-0 -z-10 bg-[#003b36]/48" />

      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_0.9fr_1.15fr_1fr]">
        <div>
          <Link href="/" className="inline-flex transition hover:-translate-y-1">
            <Image
              src="/images/WRL Logo.jpg"
              alt="Wantok Radio Light"
              width={170}
              height={50}
              className="object-contain drop-shadow-[0_0_14px_rgba(250,204,21,0.28)]"
            />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/76">
            Wantok Radio Light is PNG&apos;s Christian radio station, sharing the love,
            hope, and truth of Jesus Christ through radio, media, and community ministry.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-yellow-300">Quick Links</h2>
          <nav className="mt-5 flex flex-col gap-2" aria-label="Footer quick links">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={footerLinkClass}>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-bold text-yellow-300">Contact</h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-white/78">
            <p className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-yellow-300" aria-hidden="true" />
              <span>
                Gerehu Stage 2, Sivari Road
                <br />
                Port Moresby, Papua New Guinea
              </span>
            </p>
            <a href="tel:+6753260946" className={footerLinkClass}>
              <Phone className="h-4 w-4 text-yellow-300" aria-hidden="true" />
              (675) 326 0946
            </a>
            <a href="tel:+6753262933" className={footerLinkClass}>
              <Phone className="h-4 w-4 text-yellow-300" aria-hidden="true" />
              (675) 326 2933
            </a>
            <a href="mailto:wantok@wantokradio.org" className={footerLinkClass}>
              <Mail className="h-4 w-4 text-yellow-300" aria-hidden="true" />
              wantok@wantokradio.org
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-yellow-300">Social Links</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon

              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-yellow-300/35 bg-black/25 text-yellow-200 shadow-[0_10px_26px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-yellow-200 hover:bg-yellow-300 hover:text-[#003b36]"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-white/68">
        Copyright {new Date().getFullYear()} Wantok Radio Light. All Rights Reserved.
      </div>
    </footer>
  )
}
