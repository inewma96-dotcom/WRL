import Image from "next/image"

const galleryMedia = [
  "/images/IMG1.jpg",
  "/images/mainwall.png",
  "/images/playout.png",
  "/images/entrence.png",
  "/images/supportbg.png",
  "/images/rural.png",
]

export default function GalleryPage() {
  return (
    <main className="bg-[#003b36] px-5 py-16 text-white sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black leading-tight md:text-5xl">Gallery</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/76">
          Browse photos, event highlights, production moments, and featured media
          from Wantok Radio Light.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg border border-white/12 bg-white/[0.065] shadow-[0_18px_55px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1.5 hover:border-yellow-300/55 hover:bg-white/[0.095]"
            >
              <div className="relative h-56 bg-[#071512]">
                <Image
                  src={galleryMedia[index % galleryMedia.length]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover opacity-88 transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071512]/72 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-black">Gallery Item {index + 1}</h2>
                <p className="mt-3 leading-7 text-white/72">
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
