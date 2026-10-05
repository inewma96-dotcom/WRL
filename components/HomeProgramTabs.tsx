"use client"

import Image from "next/image"
import Link from "next/link"
import { type KeyboardEvent, useRef, useState } from "react"
import { ArrowRight, Radio } from "lucide-react"
import { cn } from "@/lib/utils"

type Program = {
  title: string
  description: string
  image?: string
}

type HomeProgramTabsProps = {
  localPrograms: Program[]
  internationalPrograms: Program[]
}

const tabs = [
  { id: "local", label: "Local Programs" },
  { id: "international", label: "International Programs" },
] as const

type TabId = (typeof tabs)[number]["id"]

const panelId = "featured-programs-panel"

const programThemes = [
  { background: "#2563eb", foreground: "#ffffff", accent: "#ffe071", glow: "rgba(37, 99, 235, 0.52)" },
  { background: "#f7c928", foreground: "#071512", accent: "#7a210d", glow: "rgba(247, 201, 40, 0.56)" },
  { background: "#007a52", foreground: "#ffffff", accent: "#ffe071", glow: "rgba(0, 122, 82, 0.5)" },
]

function getTabId(id: TabId) {
  return `featured-programs-${id}-tab`
}

export default function HomeProgramTabs({
  localPrograms,
  internationalPrograms,
}: HomeProgramTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("local")
  const [activeProgramIndex, setActiveProgramIndex] = useState<number | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const programs = activeTab === "local" ? localPrograms : internationalPrograms
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab)

  function selectTab(index: number) {
    const nextTab = tabs[index]
    if (!nextTab) return

    setActiveTab(nextTab.id)
    setActiveProgramIndex(null)
    tabRefs.current[index]?.focus()
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1
    }

    if (nextIndex === null) return

    event.preventDefault()
    selectTab(nextIndex)
  }

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Featured program categories"
        className="grid w-full max-w-md grid-cols-2 rounded-lg border border-[var(--wrl-border)] bg-[var(--wrl-surface)] p-1"
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              id={getTabId(tab.id)}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                setActiveTab(tab.id)
                setActiveProgramIndex(null)
              }}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={cn(
                "min-h-12 rounded-md px-3 py-2 text-sm font-bold leading-5 transition-colors duration-200",
                isActive
                  ? "bg-[var(--wrl-accent-gold)] text-[var(--wrl-accent-gold-foreground)]"
                  : "text-[var(--wrl-muted-foreground)] hover:bg-white/8 hover:text-white",
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={getTabId(tabs[activeTabIndex].id)}
        tabIndex={0}
        className="mt-8 rounded-lg focus-visible:outline-offset-4"
      >
        {activeProgramIndex !== null ? (
          <div
            className="pointer-events-none fixed inset-0 z-50 bg-[#071512]/48 backdrop-blur-[3px]"
            aria-hidden="true"
          />
        ) : null}

        {programs.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((program, index) => {
              const isActive = activeProgramIndex === index
              const theme = programThemes[index % programThemes.length]

              return (
              <article
                key={program.title}
                onPointerEnter={() => setActiveProgramIndex(index)}
                onPointerLeave={() => setActiveProgramIndex(null)}
                className="wrl-surface-elevated relative flex h-full transform-gpu flex-col overflow-hidden transition-[background-color,color,box-shadow,transform] duration-300"
                style={isActive ? {
                  zIndex: 60,
                  color: theme.foreground,
                  backgroundColor: theme.background,
                  boxShadow: `0 0 34px ${theme.glow}, 0 24px 60px rgba(0, 0, 0, 0.38)`,
                  transform: "scale(1.035)",
                } : undefined}
              >
                {program.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-[var(--wrl-border)] bg-white">
                    <Image
                      src={program.image}
                      alt=""
                      fill
                      quality={78}
                      sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="flex aspect-[16/9] items-center justify-center border-b border-[var(--wrl-border)] bg-[var(--wrl-primary)]"
                    aria-hidden="true"
                  >
                    <Radio className="h-10 w-10 text-[var(--wrl-accent-gold)]" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <p
                    className="text-xs font-extrabold uppercase"
                    style={{ color: isActive ? theme.accent : "var(--wrl-accent-gold)" }}
                  >
                    {activeTab === "local" ? "Local Program" : "International Program"}
                  </p>
                  <h3
                    className="wrl-card-title mt-3 text-balance [overflow-wrap:anywhere]"
                    style={{ color: isActive ? theme.foreground : "white" }}
                  >
                    {program.title}
                  </h3>
                  {program.description ? (
                    <p
                      className="wrl-body mt-4"
                      style={{ color: isActive ? theme.foreground : "var(--wrl-muted-foreground)", opacity: isActive ? 0.9 : 1 }}
                    >
                      {program.description}
                    </p>
                  ) : null}
                </div>
              </article>
              )
            })}
          </div>
        ) : (
          <div className="wrl-surface p-6 text-[var(--wrl-muted-foreground)]">
            <p>No featured programs are available in this category.</p>
            <Link
              href="/programs"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md font-bold text-[var(--wrl-accent-gold)] underline-offset-4 hover:text-white hover:underline"
            >
              View all programs
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
