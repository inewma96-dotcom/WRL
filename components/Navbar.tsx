"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { navLinks } from "@/lib/constants"

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const linkClass = (href: string) => {
    const isActive = pathname === href

    if (href === "/donate") {
      return `group relative overflow-hidden rounded-md bg-orange-500 px-5 py-2.5 font-black text-[#071512] shadow-[0_12px_28px_rgba(249,115,22,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:text-[#071512] ${
        isActive ? "ring-2 ring-white/80" : ""
      }`
    }

    return `group relative overflow-hidden px-1 py-1 transition-all duration-300 ${
      isActive ? "text-white" : "text-yellow-400 hover:text-white"
    }`
  }

  return (
    <nav className={`sticky top-0 z-50 w-full border-b text-yellow-400 backdrop-blur-xl transition-all duration-300 ${
      scrolled ? "border-white/12 bg-[#031f1c]/92 shadow-[0_18px_48px_rgba(0,0,0,0.22)]" : "border-white/8 bg-[#003b36]/94 shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
    }`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-6 lg:px-8 ${scrolled ? "py-2.5" : "py-3.5"}`}>

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
            className="object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.15)] transition duration-300 group-hover:drop-shadow-[0_0_16px_rgba(255,215,0,0.28)]"
          />
        </Link>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-yellow-300/35 text-yellow-300 transition hover:bg-yellow-300 hover:text-[#003b36] lg:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden items-center gap-5 text-sm font-semibold lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const isDonate = link.href === "/donate"

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
                {isDonate ? null : (
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-white transition-all duration-300 ${
                      isActive
                        ? "w-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                        : "w-0 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    }`}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-x-0 top-full max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-white/10 bg-[#031f1c]/98 px-5 py-5 shadow-[0_30px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 text-sm font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={
                  link.href === "/donate"
                    ? `rounded bg-orange-500 px-4 py-3 text-center font-black text-[#071512] shadow-[0_12px_28px_rgba(249,115,22,0.28)] transition hover:bg-orange-400 ${
                        pathname === link.href ? "ring-2 ring-white/80" : ""
                      }`
                    : `rounded px-3 py-2 transition ${
                        pathname === link.href
                          ? "bg-yellow-300 text-[#003b36]"
                          : "text-yellow-300 hover:bg-white/10 hover:text-white"
                      }`
                }
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
