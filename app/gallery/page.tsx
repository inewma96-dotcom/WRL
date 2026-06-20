export default function GalleryPage() {
  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold md:text-5xl">Gallery</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Browse photos, event highlights, production moments, and featured media
          from Wantok Radio Light.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-6">
                <h2 className="text-xl font-bold">Gallery Item {index + 1}</h2>
                <p className="mt-3 text-muted-foreground">
                  Image description or event title goes here.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}