"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"

export default function JournalistLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      localStorage.removeItem("refreshToken")
      router.replace("/login")
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Logout failed")
    }
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
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8 flex justify-end">
          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            Logout
          </button>
        </div>

        {children}
      </main>
    </div>
  )
}
