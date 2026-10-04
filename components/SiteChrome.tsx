"use client"

import { usePathname } from "next/navigation"
import FloatingRadioPlayer from "@/components/FloatingRadioPlayer"
import Navbar from "@/components/Navbar"

export default function SiteChrome() {
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <>
      <Navbar key={pathname} />
      <FloatingRadioPlayer variant="topbar" />
    </>
  )
}
