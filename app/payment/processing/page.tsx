import { Suspense } from "react"
import PaymentStatusClient from "@/components/payments/PaymentStatusClient"

export default function PaymentProcessingPage() {
  return (
    <Suspense fallback={<main className="min-h-[70vh] bg-[#071512] p-12 text-white">Loading payment status...</main>}>
      <PaymentStatusClient />
    </Suspense>
  )
}
