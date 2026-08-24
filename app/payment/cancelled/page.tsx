import Link from "next/link"
import { Ban } from "lucide-react"

export default async function PaymentCancelledPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const params = await searchParams
  return (
    <main className="min-h-[70vh] bg-[#071512] px-6 py-16 text-white">
      <section className="mx-auto max-w-xl rounded-lg border border-yellow-300/35 bg-[#082b52] p-8">
        <Ban className="h-12 w-12 text-yellow-300" aria-hidden="true" />
        <h1 className="mt-5 text-4xl font-black">Payment was cancelled</h1>
        <p className="mt-4 text-white/76">No confirmed payment was recorded for this checkout.</p>
        {params.reference ? <p className="mt-4 font-mono text-sm text-white/70">{params.reference}</p> : null}
        <div className="mt-8 flex gap-3">
          <Link href="/checkout" className="rounded bg-yellow-300 px-5 py-3 font-black text-[#071512]">Retry payment</Link>
          <Link href="/" className="rounded border border-white/30 px-5 py-3 font-black text-white">Return home</Link>
        </div>
      </section>
    </main>
  )
}
