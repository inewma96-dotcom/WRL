import { notFound } from "next/navigation"
import PaymentReceipt from "@/components/payments/PaymentReceipt"
import PrintReceiptButton from "@/components/payments/PrintReceiptButton"
import { getPaymentStatus } from "@/lib/payments/payment-service"

export default async function ReceiptPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params
  const payment = await getPaymentStatus(reference)
  if (!payment || payment.status !== "SUCCEEDED") notFound()

  return (
    <main className="min-h-screen bg-[#f8f6ef] px-6 py-10">
      <div className="mx-auto mb-5 max-w-3xl text-right print:hidden">
        <PrintReceiptButton />
      </div>
      <PaymentReceipt payment={payment} />
    </main>
  )
}
