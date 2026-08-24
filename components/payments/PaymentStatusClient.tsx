"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, RefreshCw } from "lucide-react"

export default function PaymentStatusClient() {
  const params = useSearchParams()
  const router = useRouter()
  const reference = params.get("reference") || ""
  const [status, setStatus] = useState("Checking payment status...")

  const check = useCallback(async () => {
    if (!reference) {
      setStatus("Missing payment reference.")
      return
    }
    const response = await fetch(`/api/payments/status/${reference}`)
    const json = await response.json()
    if (!json.success) {
      setStatus(json.error || "Payment status is unavailable.")
      return
    }
    const payment = json.data.payment
    setStatus(`Payment status: ${payment.status}`)
    if (payment.status === "SUCCEEDED") router.replace(`/payment/success?reference=${reference}`)
    if (payment.status === "FAILED") router.replace(`/payment/failed?reference=${reference}`)
    if (payment.status === "CANCELLED") router.replace(`/payment/cancelled?reference=${reference}`)
  }, [reference, router])

  useEffect(() => {
    let attempts = 0
    window.setTimeout(() => {
      check()
    }, 0)
    const timer = window.setInterval(() => {
      if (attempts >= 20) {
        window.clearInterval(timer)
        return
      }
      attempts += 1
      check()
    }, 3000)
    return () => window.clearInterval(timer)
  }, [check])

  return (
    <main className="min-h-[70vh] bg-[#071512] px-6 py-16 text-white">
      <section className="mx-auto max-w-xl rounded-lg border border-white/12 bg-[#082b52] p-8 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-yellow-300" aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-black">Verifying payment</h1>
        <p className="mt-4 text-white/76" aria-live="polite">{status}</p>
        <button onClick={check} className="mt-6 inline-flex items-center gap-2 rounded bg-yellow-300 px-5 py-3 font-black text-[#071512]">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Check payment status
        </button>
        <div className="mt-6">
          <Link href={`/payment/status/${reference}`} className="text-sm font-bold text-sky-300">Open status page</Link>
        </div>
      </section>
    </main>
  )
}
