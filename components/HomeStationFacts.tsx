"use client"

import { useState } from "react"

const stationFacts = [
  { value: "2002", label: "On air since January 14", color: "#d71920", foreground: "#ffffff", glow: "rgba(215, 25, 32, 0.52)" },
  { value: "105.9", label: "FM nationwide", color: "#f7c928", foreground: "#071512", glow: "rgba(247, 201, 40, 0.58)" },
  { value: "31", label: "FM sites across PNG", color: "#007a52", foreground: "#ffffff", glow: "rgba(0, 122, 82, 0.52)" },
  { value: "24/7", label: "Live stream worldwide", color: "#3949ab", foreground: "#ffffff", glow: "rgba(57, 73, 171, 0.5)" },
]

export default function HomeStationFacts() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section aria-label="Wantok Radio Light station facts" className="border-y border-black/10 bg-white text-black">
      {activeIndex !== null ? (
        <div
          className="pointer-events-none fixed inset-0 z-50 bg-[#071512]/48 backdrop-blur-[3px]"
          aria-hidden="true"
        />
      ) : null}

      <dl className="grid w-full sm:grid-cols-2 lg:grid-cols-4">
        {stationFacts.map((fact, index) => {
          const isActive = activeIndex === index

          return (
            <div
              key={fact.value}
              onPointerEnter={() => setActiveIndex(index)}
              onPointerLeave={() => setActiveIndex(null)}
              className="relative border-b border-black/10 px-6 py-8 transition-[background-color,color,box-shadow,transform] duration-300 last:border-b-0 sm:min-h-44 sm:px-10 sm:py-9 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:px-12 lg:last:border-r-0"
              style={isActive ? {
                zIndex: 60,
                color: fact.foreground,
                backgroundColor: fact.color,
                boxShadow: `0 0 34px ${fact.glow}, 0 22px 58px rgba(0, 0, 0, 0.34)`,
                transform: "scale(1.035)",
              } : undefined}
            >
              <dt className="text-sm font-bold leading-6 opacity-75">{fact.label}</dt>
              <dd className="mt-2 text-4xl font-black leading-none sm:text-5xl">
                {fact.value}
                <span
                  className="mt-5 block h-1 w-8 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: isActive ? fact.foreground : "var(--wrl-accent-gold)" }}
                  aria-hidden="true"
                />
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
