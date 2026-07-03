/**
 * UNIFIED LOGIN PAGE
 * ===================
 * 
 * This login page replaces the scattered login pages (/admin/login, /journalist/login, /prayer/login)
 * with a single, unified login page that handles all roles.
 * 
 * The role is automatically determined from the user's account in the database.
 * After login, users are automatically redirected to their appropriate dashboard.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()

  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!emailOrUsername.trim()) {
      setError("Email or username is required")
      return
    }

    if (!password) {
      setError("Password is required")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrUsername: emailOrUsername.trim(),
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store refresh token
      if (data.data?.refreshToken) {
        localStorage.setItem("refreshToken", data.data.refreshToken)
      }

      // Redirect based on role
      const role = data.data?.user?.role
      if (role === "ADMIN") {
        router.replace("/admin/dashboard")
      } else if (role === "JOURNALIST") {
        router.replace("/journalist/news")
      } else if (role === "PRAYER") {
        router.replace("/prayer/dashboard")
      } else {
        router.replace("/")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-12"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 35, 32, 0.55), rgba(0, 35, 32, 0.68)), url('/images/login_bg.png')",
      }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="WRL Logo"
              width={120}
              height={50}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Sign in to your WRL account
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email or Username
              </label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => {
                  setEmailOrUsername(e.target.value)
                  setError(null)
                }}
                placeholder="Enter your email or username"
                disabled={loading}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                placeholder="Enter your password"
                disabled={loading}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-center text-sm">
              Need help?{" "}
              <a href="/contact" className="text-yellow-400 hover:text-yellow-300 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Wantok Radio Light. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
