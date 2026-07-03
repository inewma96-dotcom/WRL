import type { ElementType, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

type Action = {
  label: string
  href: string
  external?: boolean
}

type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
  image: string
  actions?: Action[]
  children?: ReactNode
}

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  tone?: "dark" | "light"
}

type InfoCardProps = {
  title: string
  description: string
  eyebrow?: string
  icon?: ElementType
  href?: string
}

type FeaturePanelProps = {
  eyebrow?: string
  title: string
  description: ReactNode
  image?: string
  imageAlt?: string
  reverse?: boolean
  children?: ReactNode
}

type CTASectionProps = {
  eyebrow?: string
  title: string
  description: string
  primary: Action
  secondary?: Action
}

function renderAction(action: Action, variant: "primary" | "secondary" = "primary") {
  const className =
    variant === "primary"
      ? "inline-flex items-center gap-2 rounded bg-yellow-400 px-6 py-3 text-sm font-black uppercase tracking-normal text-[#071512] shadow-[0_18px_42px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:bg-white"
      : "inline-flex items-center gap-2 rounded border border-white/45 px-6 py-3 text-sm font-black uppercase tracking-normal text-white transition hover:-translate-y-1 hover:border-yellow-300 hover:text-yellow-300"

  if (action.external) {
    return (
      <a key={action.label} href={action.href} target="_blank" rel="noreferrer" className={className}>
        {action.label}
        {variant === "primary" ? <ArrowRight className="h-4 w-4" /> : null}
      </a>
    )
  }

  return (
    <Link key={action.label} href={action.href} className={className}>
      {action.label}
      {variant === "primary" ? <ArrowRight className="h-4 w-4" /> : null}
    </Link>
  )
}

export function PageHero({ eyebrow, title, description, image, actions = [], children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden px-6 py-20 md:py-28">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover"
      />
      <div className="absolute inset-0 -z-20 bg-black/64" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#003b36]/42 via-[#003b36]/76 to-[#003b36]" />

      <div className="mx-auto flex min-h-[58vh] max-w-6xl flex-col justify-center">
        <div className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-300">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight tracking-normal md:text-7xl">
            {title}
          </h1>
          <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-white/88 md:text-2xl md:leading-10">
            {description}
          </p>
          {actions.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-4">
              {actions.map((action, index) => renderAction(action, index === 0 ? "primary" : "secondary"))}
            </div>
          ) : null}
        </div>
        {children ? <div className="mt-12 w-full">{children}</div> : null}
      </div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, description, align = "left", tone = "dark" }: SectionHeadingProps) {
  const titleClass = tone === "light" ? "text-[#071512]" : "text-white"
  const descriptionClass = tone === "light" ? "text-[#26332f]" : "text-white/76"
  const eyebrowClass = tone === "light" ? "text-[#d71920]" : "text-yellow-300"

  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className={`text-sm font-black uppercase tracking-[0.2em] ${eyebrowClass}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`mt-4 text-3xl font-black leading-tight tracking-normal md:text-5xl ${titleClass}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 text-lg leading-8 ${descriptionClass}`}>
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function InfoCard({ title, description, eyebrow, icon: Icon, href }: InfoCardProps) {
  const body = (
    <article className="group h-full rounded-lg border border-white/12 bg-white/[0.06] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-2 hover:border-yellow-300/60 hover:bg-white/[0.09]">
      {Icon ? (
        <div className="inline-flex h-12 w-12 items-center justify-center rounded bg-yellow-400 text-[#071512]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      ) : null}
      {eyebrow ? (
        <p className={`${Icon ? "mt-5" : ""} text-sm font-black uppercase tracking-normal text-yellow-300`}>
          {eyebrow}
        </p>
      ) : null}
      <h3 className={`${Icon || eyebrow ? "mt-3" : ""} text-2xl font-black text-white`}>
        {title}
      </h3>
      <p className="mt-4 leading-7 text-white/76">
        {description}
      </p>
    </article>
  )

  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : body
}

export function LightCard({ title, description, eyebrow, icon: Icon }: InfoCardProps) {
  return (
    <article className="rounded-lg border border-black/10 bg-white/80 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
      {Icon ? <Icon className="h-7 w-7 text-[#d71920]" aria-hidden="true" /> : null}
      {eyebrow ? (
        <p className={`${Icon ? "mt-5" : ""} text-sm font-black uppercase tracking-normal text-[#d71920]`}>
          {eyebrow}
        </p>
      ) : null}
      <h3 className={`${Icon || eyebrow ? "mt-3" : ""} text-2xl font-black text-[#071512]`}>
        {title}
      </h3>
      <p className="mt-3 leading-7 text-[#26332f]">
        {description}
      </p>
    </article>
  )
}

export function FeaturePanel({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  reverse = false,
  children,
}: FeaturePanelProps) {
  return (
    <div className={`mx-auto grid max-w-6xl gap-10 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center ${reverse ? "lg:grid-cols-[minmax(0,1fr)_420px]" : ""}`}>
      {image ? (
        <div className={`relative aspect-square overflow-hidden rounded-lg border border-white/12 bg-black/25 ${reverse ? "lg:order-2" : ""}`}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 420px"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-[#003b36]/18" />
        </div>
      ) : null}
      <div>
        {eyebrow ? (
          <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal md:text-6xl">
          {title}
        </h2>
        <div className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
          {description}
        </div>
        {children}
      </div>
    </div>
  )
}

export function CTASection({ eyebrow, title, description, primary, secondary }: CTASectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#071512] px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-lg border border-yellow-300/25 bg-white/[0.05] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] md:flex-row md:items-center md:justify-between md:p-10">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-3xl font-black md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/76">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          {renderAction(primary)}
          {secondary ? renderAction(secondary, "secondary") : null}
        </div>
      </div>
    </section>
  )
}
