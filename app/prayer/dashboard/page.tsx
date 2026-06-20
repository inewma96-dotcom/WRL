"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

type PrayerRequest = {
  id: string
  fullName: string
  phone: string | null
  email: string | null
  location: string | null
  request: string
  status: string
  createdAt: string
}

export default function PrayerDashboardPage() {
  const router = useRouter()

  const [requests, setRequests] =
    useState<PrayerRequest[]>([])

  const [loading, setLoading] =
    useState(true)

  //////////////////////////////////////////////////////
  // LOAD REQUESTS
  //////////////////////////////////////////////////////

  const loadRequests = useCallback(async () => {
    try {
      const res = await fetch(
        "/api/prayer-request/list"
      )

      const data = await res.json()

      if (!res.ok) {
        console.error(data.error)
        return
      }

      setRequests(data)

    } catch (err) {
      console.error(err)

    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRequests()
  }, [loadRequests])

  //////////////////////////////////////////////////////
  // LOGOUT
  //////////////////////////////////////////////////////

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      localStorage.removeItem("refreshToken")

    } catch (err) {
      console.error(err)

    } finally {
      router.replace("/login")
      router.refresh()
    }
  }

  //////////////////////////////////////////////////////
  // COUNTS
  //////////////////////////////////////////////////////

  const totalRequests =
    requests.length

  const prayedFor =
    requests.filter(
      (r) => r.status === "PRAYED"
    ).length

  const pending =
    requests.filter(
      (r) => r.status === "PENDING"
    ).length

  async function markAsPrayed(id: string) {
    try {
      const res = await fetch(
        "/api/prayer/prayers",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        console.error(data.error)
        return
      }

      setRequests((current) =>
        current.map((request) =>
          request.id === id ? data : request
        )
      )

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen text-white">

      {/* HEADER */}
      <div className="mb-10 rounded-3xl bg-black/20 p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-6xl font-black text-yellow-400">
              Prayer Dashboard
            </h1>

            <p className="mt-4 text-xl text-gray-300">
              Manage prayer requests from listeners and viewers.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-red-500 px-6 py-3 font-bold text-white transition hover:bg-red-400"
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* TOTAL */}
        <div className="rounded-3xl bg-black/30 p-8">
          <h2 className="text-2xl font-bold text-yellow-400">
            Total Requests
          </h2>

          <p className="mt-6 text-6xl font-black">
            {totalRequests}
          </p>
        </div>

        {/* PRAYED */}
        <div className="rounded-3xl bg-black/30 p-8">
          <h2 className="text-2xl font-bold text-green-400">
            Prayed For
          </h2>

          <p className="mt-6 text-6xl font-black">
            {prayedFor}
          </p>
        </div>

        {/* PENDING */}
        <div className="rounded-3xl bg-black/30 p-8">
          <h2 className="text-2xl font-bold text-red-400">
            Pending
          </h2>

          <p className="mt-6 text-6xl font-black">
            {pending}
          </p>
        </div>
      </div>

      {/* REQUESTS */}
      <div className="mt-10 rounded-3xl bg-black/20 p-8">

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-4xl font-bold text-yellow-400">
            Recent Prayer Requests
          </h2>

          <Link
            href="/prayer/requests"
            className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300"
          >
            View All
          </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
            Loading requests...
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          requests.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              No prayer requests yet.
            </div>
          )}

        {/* LIST */}
        <div className="space-y-5">

          {requests
            .slice(0, 5)
            .map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-6"
              >

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h3 className="text-2xl font-bold text-yellow-400">
                      {item.fullName}
                    </h3>

                    <p className="mt-2 text-gray-300">
                      {item.request}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                      {item.phone ? (
                        <a
                          href={`tel:${item.phone}`}
                          className="rounded-xl bg-white/10 px-4 py-2 text-white transition hover:bg-yellow-400 hover:text-black"
                        >
                          Call {item.phone}
                        </a>
                      ) : null}

                      {item.email ? (
                        <a
                          href={`mailto:${item.email}`}
                          className="rounded-xl bg-white/10 px-4 py-2 text-white transition hover:bg-yellow-400 hover:text-black"
                        >
                          Email {item.email}
                        </a>
                      ) : null}

                      {item.location ? (
                        <span className="rounded-xl bg-white/10 px-4 py-2 text-gray-200">
                          {item.location}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span
                      className={`rounded-xl px-4 py-2 font-bold ${
                        item.status ===
                        "PRAYED"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {item.status}
                    </span>

                    {item.status !== "PRAYED" ? (
                      <button
                        type="button"
                        onClick={() => markAsPrayed(item.id)}
                        className="rounded-xl bg-green-500 px-4 py-2 font-bold text-white transition hover:bg-green-400"
                      >
                        Mark Prayed
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
