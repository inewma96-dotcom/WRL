export default function ProjectsPage() {
  return (
    <main className="px-6 py-20">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold">
          WRL Projects
        </h1>

        <p className="mt-6 text-lg text-muted-foreground">
          Our projects focus on media development, community outreach,
          digital broadcasting, and educational initiatives.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">

          <div className="border p-6 rounded-xl">
            <h2 className="text-xl font-semibold">Digital Broadcasting</h2>
            <p className="mt-3 text-muted-foreground">
              Expanding digital streaming to reach audiences online.
            </p>
          </div>

          <div className="border p-6 rounded-xl">
            <h2 className="text-xl font-semibold">Community Outreach</h2>
            <p className="mt-3 text-muted-foreground">
              Programs that support education, youth empowerment,
              and social development.
            </p>
          </div>

        </div>

      </div>
    </main>
  )
}