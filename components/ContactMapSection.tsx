"use client"

import dynamic from "next/dynamic"

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
})

export default function ContactMapSection() {
  return (
    <div className="h-[420px] overflow-hidden rounded-lg border border-white/12 bg-black/25 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
      <MapClient />
    </div>
  )
}
