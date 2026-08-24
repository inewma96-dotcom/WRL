import type { ElementType, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

type Action = {
  label: string
  href: string
  external?: boolean
  title?: string
  variant?: "primary" | "secondary"
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
      ? "wrl-button-primary group relative"
      : "wrl-button-secondary group relative"
  const tooltip = action.title ? (
    <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 w-72 -translate-x-1/2 translate-y-2 rounded-md border border-yellow-300/40 bg-[#071512] px-4 py-3 text-center text-xs font-bold normal-case leading-5 text-white opacity-0 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition duration-200 before:absolute before:left-1/2 before:top-0 before:h-3 before:w-3 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:border-l before:border-t before:border-yellow-300/40 before:bg-[#071512] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
      {action.title}
    </span>
  ) : null

  if (action.external) {
    return (
      <a key={action.label} href={action.href} target="_blank" rel="noreferrer" className={className}>
        {action.label}
        {variant === "primary" ? <ArrowRight className="h-4 w-4" /> : null}
        {tooltip}
      </a>
    )
  }

  return (
    <Link key={action.label} href={action.href} className={className}>
      {action.label}
      {variant === "primary" ? <ArrowRight className="h-4 w-4" /> : null}
      {tooltip}
    </Link>
  )
}

export function PageHero({ eyebrow, title, description, image, actions = [], children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden px-5 py-16 sm:px-6 md:py-24 lg:px-8">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover"
      />
      <div className="absolute inset-0 -z-20 bg-[#03110e]/72" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(0,35,64,0.82),rgba(0,59,54,0.66)_42%,rgba(7,21,18,0.92))]" />
      <div className="wrl-premium-grid absolute inset-0 -z-10 opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 -z-10 h-40 bg-gradient-to-t from-[#003b36] to-transparent" />

      <div className="mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-center">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300 md:text-sm">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-normal text-white drop-shadow-[0_18px_45px_rgba(0,0,0,0.34)] sm:text-5xl md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-white/84 md:text-xl md:leading-9">
            {description}
          </p>
          {actions.length > 0 ? (
            <div className="mt-9 flex flex-wrap gap-3">
              {actions.map((action, index) => renderAction(action, action.variant ?? (index === 0 ? "primary" : "secondary")))}
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
        <p className={`text-xs font-black uppercase tracking-[0.22em] md:text-sm ${eyebrowClass}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`mt-4 text-3xl font-black leading-[1.08] tracking-normal md:text-5xl ${titleClass}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 max-w-2xl text-base leading-8 md:text-lg ${descriptionClass}`}>
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function InfoCard({ title, description, eyebrow, icon: Icon, href }: InfoCardProps) {
  const body = (
    <article className="group h-full rounded-lg border border-white/12 bg-white/[0.065] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1.5 hover:border-yellow-300/55 hover:bg-white/[0.095] hover:shadow-[0_26px_70px_rgba(0,0,0,0.28)]">
      {Icon ? (
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-yellow-300 text-[#071512] shadow-[0_12px_26px_rgba(250,204,21,0.18)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      ) : null}
      {eyebrow ? (
        <p className={`${Icon ? "mt-5" : ""} text-sm font-black uppercase tracking-normal text-yellow-300`}>
          {eyebrow}
        </p>
      ) : null}
      <h3 className={`${Icon || eyebrow ? "mt-3" : ""} text-xl font-black leading-snug text-white md:text-2xl`}>
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
    <article className="rounded-lg border border-[#071512]/10 bg-white p-6 shadow-[0_18px_48px_rgba(7,21,18,0.12)] transition duration-300 hover:-translate-y-1.5 hover:border-[#d71920]/30 hover:shadow-[0_26px_64px_rgba(7,21,18,0.16)]">
      {Icon ? <Icon className="h-6 w-6 text-[#d71920]" aria-hidden="true" /> : null}
      {eyebrow ? (
        <p className={`${Icon ? "mt-5" : ""} text-sm font-black uppercase tracking-normal text-[#d71920]`}>
          {eyebrow}
        </p>
      ) : null}
      <h3 className={`${Icon || eyebrow ? "mt-3" : ""} text-xl font-black leading-snug text-[#071512] md:text-2xl`}>
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
    <div className={`mx-auto grid max-w-7xl gap-10 lg:grid-cols-[440px_minmax(0,1fr)] lg:items-center ${reverse ? "lg:grid-cols-[minmax(0,1fr)_440px]" : ""}`}>
      {image ? (
        <div className={`relative aspect-square overflow-hidden rounded-lg border border-white/12 bg-black/25 shadow-[0_28px_80px_rgba(0,0,0,0.28)] ${reverse ? "lg:order-2" : ""}`}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 420px"
            className="object-cover opacity-90 transition duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003b36]/35 via-transparent to-transparent" />
        </div>
      ) : null}
      <div>
        {eyebrow ? (
          <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-4 text-3xl font-black leading-[1.08] tracking-normal md:text-5xl">
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
    <section className="relative isolate overflow-hidden bg-[#071512] px-5 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.08),transparent_32%),linear-gradient(135deg,rgba(8,43,82,0.36),transparent)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 rounded-lg border border-yellow-300/25 bg-white/[0.055] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-10">
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
