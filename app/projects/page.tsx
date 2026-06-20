import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2, RadioTower, Wrench } from "lucide-react"

const futureProjects = [
  "New studio building",
  "Four AM radio transmitter installations",
  "New tower construction in Lae, Morobe Province",
  "Updates as new project information becomes available",
]

const projectCards = [
  {
    title: "80 meter telecommunication tower",
    status: "Completed",
    description:
      "Completed through the faithful support of partners and sponsors. This tower strengthens the ministry and helps reduce yearly Share-a-thon pressure where possible.",
    image: "/images/80m.png",
    alt: "Telecommunication tower above a mountain landscape",
  },
  {
    title: "Studio upgrade",
    status: "Planning stages",
    description:
      "Plans to upgrade the current studios, or build a new studio, are in progress. WRL continues to move carefully and prayerfully as the Lord provides.",
    image: "/images/mainwall.png",
    alt: "Wantok Radio Light studio and broadcast wall",
  },
  {
    title: "Broadcast expansion",
    status: "Future",
    description:
      "WRL is looking forward to more towers, new transmitters, and broader reach for Christian radio across Papua New Guinea.",
    image: "/images/tower.png",
    alt: "Digital radio tower signal illustration",
  },
]

export default function ProjectsPage() {
  return (
    <main className="bg-[#003b36] text-white">
      <section className="relative isolate overflow-hidden px-6 py-20 md:py-28">
        <Image
          src="/images/80m.png"
          alt="Telecommunication tower representing Wantok Radio Light projects"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover"
        />
        <div className="absolute inset-0 -z-20 bg-black/65" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#003b36]/65 via-[#003b36]/78 to-[#003b36]" />

        <div className="mx-auto flex min-h-[68vh] max-w-6xl items-center">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-300">
              Projects
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight tracking-normal md:text-7xl">
              Future of the Radio Ministry
            </h1>
            <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-white/88 md:text-2xl md:leading-10">
              Wantok Radio Light continues to build, upgrade, and expand the
              broadcast ministry so the Gospel can reach more communities across
              Papua New Guinea.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded bg-yellow-400 px-6 py-3 text-sm font-black uppercase tracking-normal text-[#071512] shadow-[0_18px_42px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:bg-white"
              >
                Support Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded border border-white/45 px-6 py-3 text-sm font-black uppercase tracking-normal text-white transition hover:-translate-y-1 hover:border-yellow-300 hover:text-yellow-300"
              >
                Contact WRL
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-18 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
                Completed Projects
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-normal md:text-6xl">
                A milestone tower for the ministry
              </h2>
            </div>
            <div className="border-l-4 border-yellow-300 pl-6 text-lg leading-8 text-white/82">
              <p>
                We have completed an 80 meter telecommunication tower thanks to
                our partners and sponsors for supporting us financially.
              </p>
              <p className="mt-4">
                It is the first of its kind in the history of this ministry, and
                we are proud of your partnership.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {projectCards.map((project) => (
              <article
                key={project.title}
                className="group overflow-hidden rounded-lg border border-white/12 bg-white/[0.06] shadow-[0_24px_70px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-2 hover:border-yellow-300/60 hover:bg-white/[0.09]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  <p className="absolute bottom-4 left-4 rounded bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-normal text-[#071512]">
                    {project.status}
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black tracking-normal">
                    {project.title}
                  </h3>
                  <p className="mt-4 leading-7 text-white/76">
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div
          className="absolute inset-0 -z-30 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/supportbg.png')" }}
        />
        <div className="absolute inset-0 -z-20 bg-[#f8f6ef]/88" />

        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded border border-[#003b36]/15 bg-white/75 px-4 py-2 text-sm font-black uppercase tracking-normal text-[#007a3d]">
              <Wrench className="h-4 w-4" />
              Upgrading our studios
            </div>
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-normal md:text-6xl">
              Planning for a stronger home for broadcast ministry
            </h2>
            <div className="mt-7 max-w-3xl space-y-5 text-lg font-medium leading-8 text-[#26332f]">
              <p>
                Plans to upgrade the studios, or build a new studio, are in
                process. We will do as the Lord wills and ask for prayer support
                as we go through this important season.
              </p>
              <p className="border-l-4 border-[#d71920] pl-5 font-black text-[#071512]">
                If we ask anything in his Name, he will bestow unto us our
                desires. Amen.
              </p>
            </div>
          </div>

          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
            <Image
              src="/images/entrence.png"
              alt="Wantok Radio Light building entrance"
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-white/12 bg-black/25">
            <Image
              src="/images/pray.png"
              alt="Prayer and ministry support"
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover opacity-88"
            />
            <div className="absolute inset-0 bg-[#003b36]/18" />
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
              Promote It
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal md:text-6xl">
              The power of prayer is all we need today
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
              WRL&apos;s future projects depend on faithful prayer, practical
              support, and partners who believe Christian radio still has an
              important place in PNG.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#071512] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded bg-yellow-400 text-[#071512]">
                <RadioTower className="h-7 w-7" />
              </div>
              <h2 className="mt-6 text-4xl font-black tracking-normal md:text-5xl">
                Future projects
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/72">
                These are the next areas WRL is praying and planning toward.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {futureProjects.map((project) => (
                <div
                  key={project}
                  className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.06] p-5"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-yellow-300" />
                  <p className="text-lg font-semibold leading-7 text-white/86">
                    {project}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
