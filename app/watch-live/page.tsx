import Link from "next/link"
import { Radio } from "lucide-react"

export default function WatchLivePage() {
  return (
    <main className="relative isolate overflow-hidden px-4 py-20 text-white sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 -z-20 scale-105 bg-cover bg-center opacity-30 blur-[1px]"
        style={{ backgroundImage: "url('/images/mainwall.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-black/65" />
      <div className="absolute inset-0 -z-10 bg-[#003b36]/55" />

      <section className="mx-auto flex min-h-[52vh] max-w-4xl flex-col items-center justify-center text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded bg-yellow-400 text-[#071512]">
          <Radio className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.28em] text-yellow-300">
          Live Stream
        </p>
        <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
          Listen to WRL live
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
          Use the floating Listen player on the side of the screen to start the live radio stream from anywhere on the site.
        </p>
        <Link
          href="/coverage"
          className="mt-8 inline-flex rounded bg-yellow-400 px-6 py-3 text-sm font-black uppercase text-[#071512] transition hover:-translate-y-1 hover:bg-white"
        >
          View Ways To Listen
        </Link>
      </section>
    </main>
  )
}
