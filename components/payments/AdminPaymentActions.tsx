"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"

export default function AdminPaymentActions({ reference }: { reference: string }) {
  const [message, setMessage] = useState("")

  async function verify() {
    setMessage("Checking provider status...")
    const response = await fetch(`/api/admin/payments/${reference}/verify`, { method: "POST" })
    const json = await response.json()
    setMessage(json.success ? "Provider status check recorded." : json.error || "Verification failed.")
  }

  return (
    <div>
      <button onClick={verify} className="inline-flex items-center gap-2 rounded bg-yellow-300 px-4 py-2 font-black text-[#071512]">
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Verify with provider
      </button>
      {message ? <p className="mt-3 text-sm text-white/72" role="status">{message}</p> : null}
    </div>
  )
}
