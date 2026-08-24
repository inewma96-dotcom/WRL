"use client"

import dynamic from "next/dynamic"

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
})

export default function ContactMapSection() {
  return (
    <div className="h-[360px] overflow-hidden rounded-lg border border-white/12 bg-black/25 shadow-[0_24px_70px_rgba(0,0,0,0.24)] sm:h-[420px]">
      <MapClient />
    </div>
  )
}
