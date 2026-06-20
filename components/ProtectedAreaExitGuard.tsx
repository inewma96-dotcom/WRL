"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const PROTECTED_PREFIXES = [
  "/admin",
  "/journalist",
  "/prayer",
]

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )
}

function isPublicPath(pathname: string) {
  return (
    !isProtectedPath(pathname) &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next")
  )
}

export default function ProtectedAreaExitGuard() {
  const pathname = usePathname()
  const [pendingHref, setPendingHref] =
    useState<string | null>(null)
  const [loggingOut, setLoggingOut] =
    useState(false)

  useEffect(() => {
    if (!isProtectedPath(pathname)) {
      return
    }

    function handleDocumentClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target as Element | null
      const anchor = target?.closest("a")

      if (!anchor) {
        return
      }

      const href = anchor.getAttribute("href")
      const targetAttr = anchor.getAttribute("target")

      if (
        !href ||
        href.startsWith("#") ||
        targetAttr === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return
      }

      const url = new URL(href, window.location.origin)

      if (
        url.origin !== window.location.origin ||
        url.pathname === pathname ||
        !isPublicPath(url.pathname)
      ) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      setPendingHref(`${url.pathname}${url.search}${url.hash}`)
    }

    document.addEventListener(
      "click",
      handleDocumentClick,
      true
    )

    return () => {
      document.removeEventListener(
        "click",
        handleDocumentClick,
        true
      )
    }
  }, [pathname])

  async function logoutAndContinue() {
    if (!pendingHref) {
      return
    }

    setLoggingOut(true)

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      localStorage.removeItem("refreshToken")
    } catch (error) {
      console.error(error)
    } finally {
      window.location.href = pendingHref
    }
  }

  if (!pendingHref) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#003b36] p-6 text-white shadow-2xl">
        <h2 className="text-2xl font-black text-yellow-400">
          Logout required
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-200">
          You must logout before leaving this dashboard area. After logout, you will be redirected to the selected page.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setPendingHref(null)}
            disabled={loggingOut}
            className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            Stay here
          </button>

          <button
            type="button"
            onClick={logoutAndContinue}
            disabled={loggingOut}
            className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-400 disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout and continue"}
          </button>
        </div>
      </div>
    </div>
  )
}
