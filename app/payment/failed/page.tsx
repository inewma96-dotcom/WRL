import Link from "next/link"
import { XCircle } from "lucide-react"

export default async function PaymentFailedPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const params = await searchParams
  return (
    <main className="min-h-[70vh] bg-[#071512] px-6 py-16 text-white">
      <section className="mx-auto max-w-xl rounded-lg border border-red-300/35 bg-[#082b52] p-8">
        <XCircle className="h-12 w-12 text-red-300" aria-hidden="true" />
        <h1 className="mt-5 text-4xl font-black">Payment could not be completed</h1>
        <p className="mt-4 text-white/76">No confirmed successful payment was recorded. You can try again or contact WRL support.</p>
        {params.reference ? <p className="mt-4 font-mono text-sm text-white/70">{params.reference}</p> : null}
        <div className="mt-8 flex gap-3">
          <Link href="/checkout" className="rounded bg-yellow-300 px-5 py-3 font-black text-[#071512]">Try again</Link>
          <Link href="/contact" className="rounded border border-white/30 px-5 py-3 font-black text-white">Contact WRL</Link>
        </div>
      </section>
    </main>
  )
}
