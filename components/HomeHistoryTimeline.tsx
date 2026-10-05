"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const milestones = [
  {
    year: "2001",
    date: "2001",
    title: "The network is established",
    description:
      "PNG Christian Broadcasting Network is formed and approved by the national telecommunications authority to operate a Christian radio network.",
  },
  {
    year: "2002",
    date: "January 14th 2002",
    title: "Radio Light launches in Port Moresby",
    description:
      "At 2:00pm, Wantok Radio Light made its first-ever Christian radio broadcast over the airwaves of Papua New Guinea.",
  },
  {
    year: "2005",
    date: "2005",
    title: "A new home downtown",
    description:
      "The station relocated to the ground floor of Monian Tower in downtown Port Moresby.",
  },
  {
    year: "2007",
    date: "2007",
    title: "Land secured at Gerehu Stage 2",
    description:
      "The ministry secured its own land at Gerehu Stage 2 and renovated the facility that is still our home.",
  },
  {
    year: "2010",
    date: "November 2010",
    title: "Moving to satellite",
    description:
      "Wantok Radio Light migrated to a new satellite system and ended its EMTV service contract.",
  },
  {
    year: "2017",
    date: "2017",
    title: "80m tower at Burns Peak",
    description:
      "An 80-metre tower was built at Burns Peak to support Wantok Radio Light's operations.",
  },
  {
    year: "2019",
    date: "May 2019",
    title: "Shortwave moves to Mt. Hagen",
    description:
      "After vandalism at the 9 Mile site, our shortwave transmitter was re-installed at Teka, Western Highlands Province.",
  },
  {
    year: "2020",
    date: "2020",
    title: "Studio goes digital",
    description: "Our studio was upgraded from analog to digital.",
  },
  {
    year: "2023",
    date: "2023",
    title: "Solar-powered transmission",
    description:
      "Our pilot project for solar-powered transmission in Pangia was a success.",
  },
  {
    year: "2025",
    date: "2025",
    title: "85m tower in Lae",
    description:
      "An 85-metre tower was built in Lae to support Wantok Radio Light's operations.",
  },
]

const milestoneThemes = [
  { background: "#d71920", foreground: "#ffffff", accent: "#ffd84d", glow: "rgba(215, 25, 32, 0.46)" },
  { background: "#007a52", foreground: "#ffffff", accent: "#ffe071", glow: "rgba(0, 122, 82, 0.44)" },
  { background: "#f7c928", foreground: "#071512", accent: "#7a210d", glow: "rgba(247, 201, 40, 0.52)" },
  { background: "#005f56", foreground: "#ffffff", accent: "#ffd84d", glow: "rgba(0, 95, 86, 0.46)" },
  { background: "#c84c31", foreground: "#ffffff", accent: "#fff0a8", glow: "rgba(200, 76, 49, 0.44)" },
  { background: "#3949ab", foreground: "#ffffff", accent: "#ffe071", glow: "rgba(57, 73, 171, 0.42)" },
  { background: "#b45309", foreground: "#ffffff", accent: "#fff0a8", glow: "rgba(180, 83, 9, 0.44)" },
  { background: "#9c2f6f", foreground: "#ffffff", accent: "#ffe071", glow: "rgba(156, 47, 111, 0.42)" },
  { background: "#2f7d32", foreground: "#ffffff", accent: "#ffe071", glow: "rgba(47, 125, 50, 0.44)" },
  { background: "#071512", foreground: "#ffffff", accent: "#f7c928", glow: "rgba(7, 21, 18, 0.5)" },
]

export default function HomeHistoryTimeline() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isYearHovered, setIsYearHovered] = useState(false)
  const activeMilestone = milestones[activeIndex]
  const activeTheme = milestoneThemes[activeIndex]

  return (
    <section className="wrl-section-light relative isolate overflow-hidden py-10 md:py-12" aria-label="Wantok Radio Light history">
      <Image
        src="/images/history.png"
        alt=""
        fill
        sizes="100vw"
        quality={82}
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-[#003b36]/78" aria-hidden="true" />

      <div className="wrl-shell relative">
        <div className="text-center">
          <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">Our Journey</p>
        </div>

        <div className="mx-auto mt-3 max-w-5xl overflow-x-auto pb-2" role="tablist" aria-label="Wantok Radio Light history">
          <div className="relative flex min-w-[760px] justify-between px-3 pt-1 before:absolute before:left-8 before:right-8 before:top-10 before:h-px before:bg-white/30">
            {milestones.map((milestone, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={milestone.year}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="home-history-panel"
                  onClick={() => setActiveIndex(index)}
                  onPointerEnter={() => {
                    setActiveIndex(index)
                    setIsYearHovered(true)
                  }}
                  onPointerLeave={() => setIsYearHovered(false)}
                  onFocus={() => {
                    setActiveIndex(index)
                    setIsYearHovered(true)
                  }}
                  onBlur={() => setIsYearHovered(false)}
                  className="group relative z-10 flex min-h-16 min-w-14 flex-col items-center gap-2 rounded-md px-2 text-sm font-bold text-white/78 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--wrl-accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--wrl-primary)]"
                >
                  <span className={cn(isActive && "font-black text-white")}>
                    {milestone.year}
                  </span>
                  <span
                    className={cn(
                      "h-4 w-4 rounded-full border border-white/65 bg-[#f8f6ef] transition-colors duration-200 group-hover:border-[var(--wrl-accent-gold)] group-hover:bg-[var(--wrl-accent-gold)]",
                      isActive && "border-[var(--wrl-accent-gold)] bg-[var(--wrl-accent-gold)] ring-4 ring-[var(--wrl-accent-gold)]/25",
                    )}
                    aria-hidden="true"
                  />
                </button>
              )
            })}
          </div>
        </div>

        <article
          id="home-history-panel"
          role="tabpanel"
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "mx-auto mt-4 flex h-[280px] max-w-4xl flex-col items-center justify-center overflow-hidden border-l-4 p-6 text-center transition-[background-color,color,box-shadow,border-color] duration-300 sm:h-[200px] sm:p-8",
            isYearHovered
              ? "border-[var(--wrl-accent-gold)]"
              : "border-[var(--wrl-accent-gold)] bg-white text-[var(--wrl-secondary-foreground)] shadow-[var(--wrl-shadow-soft)]",
          )}
          style={isYearHovered ? {
            backgroundColor: activeTheme.background,
            color: activeTheme.foreground,
            boxShadow: `0 0 24px ${activeTheme.glow}, 0 18px 48px rgba(7, 21, 18, 0.2)`,
          } : undefined}
        >
          <div key={activeIndex} className="wrl-history-pop flex w-full flex-col items-center">
            <p
              className={cn("wrl-eyebrow transition-colors duration-300", !isYearHovered && "text-[#9a7100]")}
              style={isYearHovered ? { color: activeTheme.accent } : undefined}
            >
              {activeMilestone.date}
            </p>
            <h3 className={cn("mt-4 text-balance text-2xl font-black leading-tight transition-colors duration-300 sm:text-3xl", isYearHovered ? "text-current" : "text-[var(--wrl-secondary-foreground)]")}>
              {activeMilestone.title}
            </h3>
            <p className={cn("mt-4 max-w-3xl text-base leading-8 transition-colors duration-300", isYearHovered ? "text-current opacity-90" : "text-[#44514c]")}>
              {activeMilestone.description}
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}
