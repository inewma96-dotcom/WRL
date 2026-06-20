export default function CoveragePage() {
  return (
    <main className="px-6 py-20">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold">
          Media Coverage
        </h1>

        <p className="mt-6 text-lg text-muted-foreground">
          Wantok Radio Light provides coverage of community events,
          church gatherings, conferences, interviews, and special
          broadcasts across Papua New Guinea.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold">Church Events</h2>
            <p className="mt-2 text-muted-foreground">
              Coverage of worship services, conferences, and special gatherings.
            </p>
          </div>

          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold">Community Stories</h2>
            <p className="mt-2 text-muted-foreground">
              Interviews and stories from communities and leaders.
            </p>
          </div>

          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold">Special Broadcasts</h2>
            <p className="mt-2 text-muted-foreground">
              Live media coverage and special program highlights.
            </p>
          </div>

        </div>

      </div>
    </main>
  )
}