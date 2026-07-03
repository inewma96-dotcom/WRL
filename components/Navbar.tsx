"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { navLinks } from "@/lib/constants"

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const linkClass = (href: string) => {
    const isActive = pathname === href

    return `group relative overflow-hidden px-1 py-1 transition-all duration-300 ${
      isActive ? "text-white" : "text-yellow-400 hover:text-white"
    }`
  }

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

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded border border-yellow-300/35 text-yellow-300 transition hover:bg-yellow-300 hover:text-[#003b36] lg:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden items-center gap-5 text-sm font-semibold lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.name}
                href={link.href}
                className={linkClass(link.href)}
              >
                <span className="relative z-10">{link.name}</span>
                <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
                </span>
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
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 bg-[#003b36] px-6 py-4 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-3 text-sm font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded px-3 py-2 transition ${
                  pathname === link.href
                    ? "bg-yellow-300 text-[#003b36]"
                    : "text-yellow-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  )
}
