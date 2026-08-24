"use client"

import { Printer } from "lucide-react"

export default function PrintReceiptButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded bg-[#082b52] px-5 py-3 font-black text-white"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Print receipt
    </button>
  )
}
