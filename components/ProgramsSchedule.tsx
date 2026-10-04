"use client"

import { type KeyboardEvent, useMemo, useRef, useState } from "react"
import { CalendarDays, Clock3, Radio } from "lucide-react"
import { cn } from "@/lib/utils"

const days = [
  { id: "monday", label: "Monday", shortLabel: "Mon" },
  { id: "tuesday", label: "Tuesday", shortLabel: "Tue" },
  { id: "wednesday", label: "Wednesday", shortLabel: "Wed" },
  { id: "thursday", label: "Thursday", shortLabel: "Thu" },
  { id: "friday", label: "Friday", shortLabel: "Fri" },
  { id: "saturday", label: "Saturday", shortLabel: "Sat" },
  { id: "sunday", label: "Sunday", shortLabel: "Sun" },
] as const

type DayId = (typeof days)[number]["id"]
type ScheduleView = "all" | DayId

export type PublicProgram = {
  id: string
  timeSlot: string
  program: string
  contentFocus: string
}

type ProgramsScheduleProps = {
  currentDay: DayId
  programs: PublicProgram[]
  settings: {
    heading: string
    subheading: string
    timeSlotHeading: string
    programHeading: string
    contentFocusHeading: string
  }
}

const dayIndexes: Record<string, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
}

function getProgramDays(timeSlot: string): DayId[] {
  const dayRule = (timeSlot.split("|")[0] || timeSlot)
    .toLowerCase()
    .replace(/monday/g, "mon")
    .replace(/tuesday/g, "tue")
    .replace(/wednesday/g, "wed")
    .replace(/thursday/g, "thu")
    .replace(/friday/g, "fri")
    .replace(/saturday/g, "sat")
    .replace(/sunday/g, "sun")
    .replace(/-\s*to\s*-/g, "-")

  if (/\b(daily|every day)\b/.test(dayRule)) return days.map((day) => day.id)
  if (/\bweekdays?\b/.test(dayRule)) return days.slice(0, 5).map((day) => day.id)
  if (/\bweekends?\b/.test(dayRule)) return days.slice(5).map((day) => day.id)

  const indexes = new Set<number>()

  for (const match of dayRule.matchAll(/\b(mon|tue|wed|thu|fri|sat|sun)\s*-\s*(mon|tue|wed|thu|fri|sat|sun)\b/g)) {
    const start = dayIndexes[match[1]]
    const end = dayIndexes[match[2]]

    if (start <= end) {
      for (let index = start; index <= end; index += 1) indexes.add(index)
    } else {
      for (let index = start; index < days.length; index += 1) indexes.add(index)
      for (let index = 0; index <= end; index += 1) indexes.add(index)
    }
  }

  for (const token of dayRule.match(/\b(mon|tue|wed|thu|fri|sat|sun)\b/g) || []) {
    indexes.add(dayIndexes[token])
  }

  return [...indexes].sort((a, b) => a - b).map((index) => days[index].id)
}

function splitTimeSlot(timeSlot: string) {
  const separatorIndex = timeSlot.indexOf("|")

  if (separatorIndex === -1) {
    return { time: timeSlot, dayRule: null }
  }

  return {
    dayRule: timeSlot.slice(0, separatorIndex).trim(),
    time: timeSlot.slice(separatorIndex + 1).trim(),
  }
}

export default function ProgramsSchedule({ currentDay, programs, settings }: ProgramsScheduleProps) {
  const [activeView, setActiveView] = useState<ScheduleView>(currentDay)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const views = useMemo(
    () => [{ id: "all" as const, label: "Full Schedule", shortLabel: "All" }, ...days],
    [],
  )
  const activeIndex = views.findIndex((view) => view.id === activeView)
  const visiblePrograms = useMemo(
    () =>
      activeView === "all"
        ? programs
        : programs.filter((program) => getProgramDays(program.timeSlot).includes(activeView)),
    [activeView, programs],
  )

  function selectView(index: number) {
    const nextView = views[index]
    if (!nextView) return

    setActiveView(nextView.id)
    tabRefs.current[index]?.focus()
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null

    if (event.key === "ArrowRight") nextIndex = (index + 1) % views.length
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + views.length) % views.length
    if (event.key === "Home") nextIndex = 0
    if (event.key === "End") nextIndex = views.length - 1
    if (nextIndex === null) return

    event.preventDefault()
    selectView(nextIndex)
  }

  const activeLabel = views[activeIndex]?.label || "Schedule"

  return (
    <section aria-labelledby="program-schedule-heading" className="wrl-section-light py-14 md:py-18 lg:py-20">
      <div className="wrl-shell">
        <div className="flex flex-col gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Weekly Schedule</p>
            <h2 id="program-schedule-heading" className="wrl-section-title mt-4 text-balance text-[var(--wrl-secondary-foreground)] [overflow-wrap:anywhere]">
              {settings.heading}
            </h2>
            <p className="wrl-prose-width mt-5 text-base leading-8 text-[#34423d] md:text-lg">
              {settings.subheading}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-bold text-[var(--wrl-primary)] shadow-sm">
            <Clock3 className="h-4 w-4 text-[var(--wrl-live-red)]" aria-hidden="true" />
            PNG Time UTC+10
          </div>
        </div>

        <div className="mt-8 overflow-x-auto pb-2 [scrollbar-width:thin]">
          <div
            role="tablist"
            aria-label="Choose a program schedule day"
            className="inline-flex min-w-full gap-1 rounded-lg border border-black/10 bg-white p-1 shadow-sm"
          >
            {views.map((view, index) => {
              const selected = activeView === view.id
              const isToday = view.id === currentDay

              return (
                <button
                  key={view.id}
                  ref={(element) => {
                    tabRefs.current[index] = element
                  }}
                  id={`programs-${view.id}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="programs-schedule-panel"
                  aria-label={`${view.label}${isToday ? ", today" : ""}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveView(view.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={cn(
                    "relative min-h-11 min-w-[4.5rem] flex-1 rounded-md px-3 py-2 text-sm font-bold transition-colors duration-200",
                    selected
                      ? "bg-[var(--wrl-primary)] text-white"
                      : "text-[#34423d] hover:bg-[var(--wrl-cream)] hover:text-[var(--wrl-primary)]",
                  )}
                >
                  <span className="sm:hidden">{view.shortLabel}</span>
                  <span className="hidden sm:inline">{view.label}</span>
                  {isToday ? (
                    <span
                      className={cn(
                        "absolute inset-x-3 bottom-1 h-0.5 rounded-full",
                        selected ? "bg-[var(--wrl-accent-gold)]" : "bg-[var(--wrl-live-red)]",
                      )}
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <div
          id="programs-schedule-panel"
          role="tabpanel"
          aria-labelledby={`programs-${activeView}-tab`}
          tabIndex={0}
          className="mt-6 overflow-hidden rounded-lg border border-black/10 bg-white shadow-[var(--wrl-shadow-soft)] focus-visible:outline-offset-4"
        >
          <div className="flex flex-col gap-3 border-b border-black/10 bg-[var(--wrl-primary)] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
              <h3 className="text-lg font-extrabold">{activeLabel}</h3>
            </div>
            <p className="text-sm font-semibold text-white/70">
              {visiblePrograms.length} {visiblePrograms.length === 1 ? "listing" : "listings"}
            </p>
          </div>

          <div className="hidden grid-cols-[minmax(145px,0.72fr)_minmax(0,0.95fr)_minmax(0,1.45fr)] gap-6 border-b border-black/10 bg-[var(--wrl-cream)] px-6 py-3 text-xs font-extrabold uppercase text-[#66736e] md:grid">
            <span>{settings.timeSlotHeading}</span>
            <span>{settings.programHeading}</span>
            <span>{settings.contentFocusHeading}</span>
          </div>

          {visiblePrograms.length > 0 ? (
            <ol className="divide-y divide-black/10">
              {visiblePrograms.map((program) => {
                const { time, dayRule } = splitTimeSlot(program.timeSlot)

                return (
                  <li key={program.id}>
                    <article className="grid gap-3 px-5 py-5 sm:px-6 md:grid-cols-[minmax(145px,0.72fr)_minmax(0,0.95fr)_minmax(0,1.45fr)] md:gap-6 md:py-5">
                      <div>
                        <p className="text-base font-black text-[var(--wrl-primary)] [overflow-wrap:anywhere]">
                          {time}
                        </p>
                        {dayRule ? (
                          <p className="mt-1 text-xs font-bold uppercase text-[#66736e]">{dayRule}</p>
                        ) : null}
                      </div>
                      <h4 className="text-base font-extrabold leading-6 text-[var(--wrl-secondary-foreground)] [overflow-wrap:anywhere]">
                        {program.program}
                      </h4>
                      <p className="text-sm leading-6 text-[#52605b] [overflow-wrap:anywhere]">
                        {program.contentFocus}
                      </p>
                    </article>
                  </li>
                )
              })}
            </ol>
          ) : (
            <div className="px-6 py-12 text-center">
              <Radio className="mx-auto h-8 w-8 text-[var(--wrl-primary)]" aria-hidden="true" />
              <p className="mt-4 font-bold text-[var(--wrl-secondary-foreground)]">
                No programs are currently listed for this day.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
