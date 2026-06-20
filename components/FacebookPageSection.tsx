import { ExternalLink } from "lucide-react"

const facebookPageUrl = "https://www.facebook.com/ChristianNet"
const facebookEmbedUrl =
  "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FChristianNet&tabs=timeline&width=500&height=650&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"

export default function FacebookPageSection() {
  return (
    <section id="facebook-page" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 -z-20 scale-105 bg-cover bg-center opacity-30 blur-[1px]"
        style={{ backgroundImage: "url('/images/bg2.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-black/65" />
      <div className="absolute inset-0 -z-10 bg-[#003b36]/45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-transparent to-black/45" />

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="text-sm font-bold uppercase tracking-[0.32em] text-yellow-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]">
          Facebook Page
        </p>
        <h2 className="mt-4 text-3xl font-bold leading-tight text-yellow-300 drop-shadow-[0_0_18px_rgba(250,204,21,0.52)] sm:text-4xl lg:text-5xl">
          See our Facebook Page
        </h2>
        <p className="mt-3 text-xl font-semibold text-white">
          Wantok Radio Light
        </p>

        <div className="mt-8 w-full max-w-[500px] overflow-hidden rounded-xl bg-white shadow-[0_0_38px_rgba(0,0,0,0.42)]">
          <iframe
            title="Wantok Radio Light Facebook timeline"
            src={facebookEmbedUrl}
            className="h-[650px] w-full bg-white"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="yes"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            loading="lazy"
          />
        </div>

        <a
          href={facebookPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-yellow-300/50 bg-black/25 px-5 py-3 text-sm font-bold text-yellow-200 transition hover:-translate-y-0.5 hover:border-yellow-200 hover:bg-yellow-300 hover:text-[#003b36]"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Open Facebook Page
        </a>
      </div>
    </section>
  )
}
