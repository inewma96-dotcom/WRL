"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navLinks } from "@/lib/constants"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#003b36]/95 text-yellow-400 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* LOGO */}
        <Link
          href="/"
          className="group flex items-center transition-transform duration-300 hover:scale-[1.02]"
        >
          <Image
            src="/images/WRL Logo.jpg"
            alt="WRL Logo"
            width={140}
            height={40}
            priority
            className="object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.15)] transition duration-300 group-hover:drop-shadow-[0_0_16px_rgba(255,215,0,0.35)]"
          />
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6 text-sm font-semibold">

          {/* EXISTING LINKS */}
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group relative overflow-hidden px-1 py-1 transition-all duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-yellow-400 hover:text-white"
                }`}
              >
                <span className="relative z-10">
                  {link.name}
                </span>

                {/* LIGHT SWEEP */}
                <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
                </span>

                {/* UNDERLINE */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-white transition-all duration-300 ${
                    isActive
                      ? "w-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                      : "w-0 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  }`}
                />
              </Link>
            )
          })}

          {/* PRAYER REQUEST LINK */}
          <Link
            href="/prayer-request"
            className={`group relative overflow-hidden px-1 py-1 transition-all duration-300 ${
              pathname === "/prayer-request"
                ? "text-white"
                : "text-yellow-400 hover:text-white"
            }`}
          >
            <span className="relative z-10">
              Prayer Request
            </span>

            {/* LIGHT SWEEP */}
            <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
            </span>

            {/* UNDERLINE */}
            <span
              className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-white transition-all duration-300 ${
                pathname === "/prayer-request"
                  ? "w-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                  : "w-0 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              }`}
            />
          </Link>

          {/* DONATE BUTTON */}
          <Link
            href="/donate"
            className="group relative overflow-hidden rounded-xl"
          >
            <Button
              className={`relative z-10 border-0 transition-all duration-300 ${
                pathname === "/donate"
                  ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/40 hover:bg-yellow-400"
                  : "bg-yellow-500 text-black shadow-md shadow-yellow-500/20 hover:bg-yellow-400 hover:text-white hover:shadow-lg hover:shadow-yellow-500/40"
              }`}
            >
              Donate
            </Button>

            {/* LIGHT SWEEP */}
            <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}