"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type LogoutButtonProps = {
  redirectTo?: string
}

export default function LogoutButton({
  redirectTo = "/login",
}: LogoutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function logout() {
    setLoading(true)

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      localStorage.removeItem("refreshToken")
      router.replace(redirectTo)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Logout failed")
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="rounded-xl bg-red-500 px-6 py-3 font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  )
}
