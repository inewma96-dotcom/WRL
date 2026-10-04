import Image from "next/image"
import { ExternalLink, Facebook, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"

const facebookPageUrl = "https://www.facebook.com/ChristianNet"
const facebookEmbedUrl =
  "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FChristianNet&tabs=timeline&width=500&height=560&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"

export default function FacebookPageSection() {
  return (
    <section id="social-media" className="wrl-section-light py-16 md:py-20">
      <div className="wrl-shell grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(360px,0.68fr)] lg:items-center lg:gap-16">
        <div className="relative isolate max-w-2xl">
          <div className="wrl-premium-grid pointer-events-none absolute -inset-8 -z-10 opacity-25" aria-hidden="true" />

          <p className="wrl-eyebrow text-[var(--wrl-live-red)]">Stay Connected</p>
          <h2 className="wrl-section-title mt-4 text-balance text-[var(--wrl-secondary-foreground)] [overflow-wrap:anywhere]">
            Connect with Wantok Radio Light
          </h2>
          <p className="wrl-prose-width mt-5 text-base leading-8 text-[#34423d] md:text-lg">
            Follow Wantok Radio Light on Facebook to stay connected with the ministry and its latest community updates.
          </p>

          <div className="mt-7 flex items-start gap-4 border-l-2 border-[var(--wrl-accent-gold)] pl-4">
            <Radio className="mt-1 h-5 w-5 shrink-0 text-[var(--wrl-primary)]" aria-hidden="true" />
            <div>
              <p className="font-extrabold text-[var(--wrl-secondary-foreground)]">Wantok Radio Light</p>
              <p className="mt-1 text-sm leading-6 text-[#52605b]">PNG Christian Broadcasting Network</p>
            </div>
          </div>

          <Button asChild variant="gold" size="lg" className="mt-8 w-full sm:w-fit">
            <a
              href={facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Wantok Radio Light on Facebook (opens in a new tab)"
            >
              <Facebook aria-hidden="true" />
              Follow Us on Facebook
              <ExternalLink aria-hidden="true" />
            </a>
          </Button>
        </div>

        <article className="wrl-shadow-elevated mx-auto w-full max-w-[520px] overflow-hidden rounded-lg border border-black/10 bg-white">
          <div className="flex items-center gap-4 border-b border-black/10 px-4 py-4 sm:px-5">
            <Image
              src="/images/WRL Logo.jpg"
              alt=""
              width={756}
              height={276}
              sizes="96px"
              className="h-auto w-24 shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-[var(--wrl-secondary-foreground)] [overflow-wrap:anywhere]">
                Wantok Radio Light
              </h3>
              <p className="mt-1 text-sm text-[#52605b]">Facebook community</p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1877f2] text-white" aria-hidden="true">
              <Facebook className="h-5 w-5" />
            </span>
          </div>

          <div className="w-full overflow-hidden bg-white">
            <iframe
              title="Wantok Radio Light Facebook timeline"
              src={facebookEmbedUrl}
              className="block h-[560px] w-full max-w-full bg-white"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="yes"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              loading="lazy"
            />
          </div>
        </article>
      </div>
    </section>
  )
}
