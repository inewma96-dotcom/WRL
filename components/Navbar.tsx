"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { buttonVariants } from "@/components/ui/button"
import { navLinks } from "@/lib/constants"
import { cn } from "@/lib/utils"

const mobileMenuId = "wrl-mobile-navigation"

function isRouteActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
}

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreTriggerFocusRef = useRef(true)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const panel = panelRef.current
    const trigger = triggerRef.current
    document.body.style.overflow = "hidden"

    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusableElements = panel?.querySelectorAll<HTMLElement>(focusableSelector)
    focusableElements?.[0]?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        setIsOpen(false)
        return
      }

      if (event.key !== "Tab" || !panel) return

      const panelElements = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector))
      const elements = trigger ? [trigger, ...panelElements] : panelElements
      if (elements.length === 0) return

      const first = elements[0]
      const last = elements[elements.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow

      if (restoreTriggerFocusRef.current) {
        trigger?.focus()
      }

      restoreTriggerFocusRef.current = true
    }
  }, [isOpen])

  function toggleMenu() {
    restoreTriggerFocusRef.current = true
    setIsOpen((current) => !current)
  }

  function closeMenuForNavigation() {
    restoreTriggerFocusRef.current = false
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-[var(--wrl-border)] bg-[var(--wrl-primary)] text-white shadow-[var(--wrl-shadow-soft)] sm:h-[82px]">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[80] -translate-y-24 rounded-md bg-[var(--wrl-accent-gold)] px-4 py-2.5 text-sm font-bold text-[var(--wrl-accent-gold-foreground)] shadow-[var(--wrl-shadow-elevated)] transition-transform duration-200 focus:translate-y-0"
      >
        Skip to main content
      </a>

      <nav aria-label="Primary navigation" className="wrl-shell-wide flex h-full items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Wantok Radio Light home"
          className="flex shrink-0 items-center rounded-md focus-visible:outline-offset-4"
        >
          <Image
            src="/images/WRL Logo.jpg"
            alt="Wantok Radio Light"
            width={756}
            height={276}
            priority
            sizes="(max-width: 639px) 132px, 150px"
            className="h-auto w-[132px] object-contain sm:w-[150px]"
          />
        </Link>

        <ul className="hidden items-center gap-2 xl:flex 2xl:gap-3" role="list">
          {navLinks.map((link) => {
            const active = isRouteActive(pathname, link.href)
            const donate = link.href === "/donate"

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    donate
                      ? cn(
                          buttonVariants({ variant: "gold", size: "sm" }),
                          "px-4 font-extrabold",
                          active && "ring-2 ring-white ring-offset-2 ring-offset-[var(--wrl-primary)]",
                        )
                      : cn(
                          "relative inline-flex min-h-11 items-center rounded-md px-1.5 text-sm font-semibold text-white/78 transition-colors duration-200 hover:text-white",
                          "after:absolute after:inset-x-1.5 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[var(--wrl-accent-gold)] after:transition-transform after:duration-200",
                          "hover:after:scale-x-100 focus-visible:after:scale-x-100",
                          active && "font-bold text-white after:scale-x-100",
                        )
                  }
                >
                  {link.name}
                </Link>
              </li>
            )
          })}
        </ul>

        <button
          ref={triggerRef}
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/30 text-white transition-colors duration-200 hover:border-[var(--wrl-accent-gold)] hover:bg-white/10 hover:text-[var(--wrl-accent-gold)] xl:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls={mobileMenuId}
          onClick={toggleMenu}
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      {isOpen ? (
        <div
          id={mobileMenuId}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Primary navigation menu"
          className="fixed inset-x-0 bottom-0 top-[72px] z-50 overflow-y-auto overscroll-contain border-t border-[var(--wrl-border)] bg-[var(--wrl-page-background)] sm:top-[82px] xl:hidden"
        >
          <nav
            aria-label="Mobile primary navigation"
            className="wrl-shell-wide pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5 sm:pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pt-7"
          >
            <div className="mb-4 flex items-end justify-between gap-4 border-b border-[var(--wrl-border)] pb-4 sm:mb-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--wrl-accent-gold)]">
                  Wantok Radio Light
                </p>
                <p className="mt-1 text-lg font-bold text-white">Explore WRL</p>
              </div>
              <span className="pb-0.5 text-xs font-semibold uppercase text-[var(--wrl-muted-foreground)]">
                Menu
              </span>
            </div>

            <ul className="grid gap-2" role="list">
              {navLinks.map((link) => {
                const active = isRouteActive(pathname, link.href)
                const donate = link.href === "/donate"

                return (
                  <li
                    key={link.href}
                    className={donate ? "mt-2 border-t border-[var(--wrl-border)] pt-5" : undefined}
                  >
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={closeMenuForNavigation}
                      className={
                        donate
                          ? cn(
                              buttonVariants({ variant: "gold", size: "lg" }),
                              "w-full",
                              active && "ring-2 ring-white ring-offset-2 ring-offset-[var(--wrl-page-background)]",
                            )
                          : cn(
                              "flex min-h-12 w-full items-center justify-between rounded-md border border-transparent px-4 py-3 text-base font-semibold text-white/82 transition-colors duration-200 hover:bg-white/8 hover:text-white",
                              active &&
                                "border-[var(--wrl-border-strong)] bg-white/8 font-bold text-[var(--wrl-accent-gold)]",
                            )
                      }
                    >
                      <span>{link.name}</span>
                      {active && !donate ? (
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase text-white">
                          <span
                            className="h-2 w-2 rounded-full bg-[var(--wrl-accent-gold)]"
                            aria-hidden="true"
                          />
                          Current
                        </span>
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
