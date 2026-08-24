"use client"

import { useState } from "react"
import { BookOpen } from "lucide-react"
import { InfoCard } from "@/components/sections/PublicPageSections"

type Program = {
  title: string
  description: string
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

export default function HomeProgramTabs({ localPrograms, internationalPrograms }: HomeProgramTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("local")
  const programs = activeTab === "local" ? localPrograms : internationalPrograms

  return (
    <div className="mt-12">
      <div className="inline-flex rounded-lg border border-white/12 bg-white/[0.06] p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-4 py-2 text-sm font-black uppercase transition ${
                isActive
                  ? "bg-yellow-400 text-[#071512]"
                  : "text-yellow-300 hover:bg-white/10 hover:text-white"
              }`}
              aria-pressed={isActive}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => (
          <InfoCard
            key={program.title}
            title={program.title}
            eyebrow="On Air"
            description={program.description}
            icon={BookOpen}
          />
        ))}
      </div>
    </div>
  )
}
