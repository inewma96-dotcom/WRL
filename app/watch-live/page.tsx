import LiveStreamPlayer from "@/components/LiveStreamPlayer"

export default function WatchLivePage() {
  return (
    <main className="relative isolate overflow-hidden px-4 py-20 text-white sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 -z-20 scale-105 bg-cover bg-center opacity-30 blur-[1px]"
        style={{ backgroundImage: "url('/images/mainwall.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-black/65" />
      <div className="absolute inset-0 -z-10 bg-[#003b36]/45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-transparent to-black/45" />

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-yellow-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]">
            Live Stream
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-yellow-300 drop-shadow-[0_0_18px_rgba(250,204,21,0.52)] sm:text-5xl">
            Watch and Listen to WRL Live
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
            Tune in to Wantok Radio Light live broadcast anytime, wherever you are.
          </p>
        </div>

        <div className="mt-10">
          <LiveStreamPlayer />
        </div>

        <section className="mx-auto mt-12 max-w-3xl text-center">
          <h2 className="text-2xl font-semibold text-yellow-200">
            Broadcasting Faith, Hope and Community
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">
            WRL brings inspirational programs, devotion content, youth programs,
            family discussions, and community coverage to audiences across Papua
            New Guinea and beyond.
          </p>
        </section>
      </div>
    </main>
  )
}
