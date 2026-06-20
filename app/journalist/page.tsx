"use client"

import type { ReactNode } from "react"

export default function JournalistLayout({
  children,
}: {
  children: ReactNode
}) {
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    })

    window.location.href =
      "/login"
  }

  return (
    <div className="flex min-h-screen bg-[#001111]">
      <aside className="w-72 bg-black/40 p-6">
        <h1 className="mb-10 text-3xl font-bold text-yellow-400">
          Journalist Panel
        </h1>

        <nav className="space-y-4">
          <a
            href="/journalist/news"
            className="block rounded-xl bg-yellow-500 px-4 py-3 font-semibold text-black"
          >
            News
          </a>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}