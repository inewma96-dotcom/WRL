import { Facebook, Linkedin, Music2, Youtube } from "lucide-react"

const facebookEmbedUrl =
  "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FChristianNet&tabs=timeline&width=500&height=650&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"

const comingSoonSocials = [
  { name: "YouTube", subtitle: "WRL video updates", icon: Youtube },
  { name: "TikTok", subtitle: "WRL short-form updates", icon: Music2 },
  { name: "LinkedIn", subtitle: "WRL ministry network", icon: Linkedin },
]

export default function FacebookPageSection() {
  return (
    <section id="social-media" className="bg-[#0d2524] px-4 py-20 text-[#003b36] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-yellow-600">
            Social Media
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Follow Wantok Radio Light
          </h2>
          <p className="mt-3 text-lg font-semibold leading-8 text-red-600 sm:text-xl">
            PNG Christian Broadcasting Network
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-stretch">
          <article className="overflow-hidden rounded-lg border border-[#003b36]/12 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.16)]">
            <div className="flex items-center gap-3 border-b border-[#003b36]/10 bg-white px-5 py-4 text-left">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1877f2] text-white">
                <Facebook className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-black text-[#003b36]">Facebook</h3>
                <p className="text-sm font-semibold text-[#003b36]/68">Wantok Radio Light</p>
              </div>
            </div>
            <iframe
              title="Wantok Radio Light Facebook timeline"
              src={facebookEmbedUrl}
              className="h-[650px] w-full bg-white"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="yes"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              loading="lazy"
            />
          </article>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {comingSoonSocials.map((social) => {
              const Icon = social.icon

              return (
                <article
                  key={social.name}
                  className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-[#003b36]/12 bg-white/82 p-6 text-center shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#003b36] text-yellow-300 shadow-[0_12px_32px_rgba(0,59,54,0.18)]">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-xl font-black text-[#003b36]">{social.name}</h3>
                  <p className="mt-2 text-sm font-semibold text-blue-700">{social.subtitle}</p>
                  <p className="mt-4 rounded-full border border-yellow-500/40 bg-yellow-100 px-4 py-2 text-sm font-black uppercase text-[#003b36]">
                    Coming soon
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
