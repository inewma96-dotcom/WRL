"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import LogoutButton from "@/components/dashboard/LogoutButton"

type DashboardLink = {
  name: string
  href: string
}

type DashboardShellProps = {
  title: string
  links: DashboardLink[]
  children: ReactNode
  theme?: "admin" | "journalist" | "prayer"
}

const themeClasses = {
  admin: "bg-[#003b36]",
  journalist: "bg-[#001111]",
  prayer: "bg-[#003b36]",
}

export default function DashboardShell({
  title,
  links,
  children,
  theme = "admin",
}: DashboardShellProps) {
  const pathname = usePathname()

  return (
    <div className={`flex min-h-screen text-white ${themeClasses[theme]}`}>
      <aside className="flex w-64 flex-col border-r border-white/10 bg-black/40 p-6">
        <h2 className="mb-6 text-xl font-bold text-yellow-400">
          {title}
        </h2>

        <nav className="space-y-3">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href.endsWith("/dashboard") &&
                pathname === link.href.replace("/dashboard", ""))

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-4 py-2 transition ${
                  active
                    ? "bg-yellow-400 font-bold text-black"
                    : "hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8 flex justify-end">
          <LogoutButton />
        </div>

        {children}
      </main>
    </div>
  )
}
