"use client"

import { usePathname, useRouter } from "next/navigation"
import { type MouseEvent, type ReactNode, useEffect, useRef } from "react"

type RouteFadeTransitionProps = {
  children: ReactNode
}

const fadeDuration = 180

function shouldHandleLink(event: MouseEvent<HTMLDivElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return null
  }

  const target = event.target instanceof Element ? event.target.closest("a") : null

  if (!(target instanceof HTMLAnchorElement)) {
    return null
  }

  if (target.target || target.hasAttribute("download")) {
    return null
  }

  const url = new URL(target.href)

  if (url.origin !== window.location.origin || url.hash) {
    return null
  }

  const currentPath = `${window.location.pathname}${window.location.search}`
  const nextPath = `${url.pathname}${url.search}`

  return currentPath === nextPath ? null : url
}

export default function RouteFadeTransition({ children }: RouteFadeTransitionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const main = document.querySelector("main")

    root.classList.remove("route-fade-out")
    root.classList.add("route-fade-in")

    if (main) {
      main.id = "main-content"
      main.tabIndex = -1
    }

    const timeout = window.setTimeout(() => {
      root.classList.remove("route-fade-in")
    }, fadeDuration)

    return () => window.clearTimeout(timeout)
  }, [pathname])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const url = shouldHandleLink(event)

    if (!url) {
      return
    }

    event.preventDefault()
    document.documentElement.classList.add("route-fade-out")

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      router.push(`${url.pathname}${url.search}`)
    }, fadeDuration)
  }

  return (
    <div className="route-fade-content" onClick={handleClick}>
      {children}
    </div>
  )
}
