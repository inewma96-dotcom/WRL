import { programsList } from "@/lib/constants"

export default function ProgramsPage() {
  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            WRL Programs
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Explore our programs
          </h1>

          <p className="mt-5 text-lg text-muted-foreground">
            Wantok Radio Light offers faith-based, educational, community, and
            inspirational content designed for families, youth, and the wider public.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {programsList.map((program) => (
            <div
              key={program.title}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
                {program.category}
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {program.title}
              </h2>

              <p className="mt-4 text-muted-foreground">
                {program.description}
              </p>

              <div className="mt-6">
                <button className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}