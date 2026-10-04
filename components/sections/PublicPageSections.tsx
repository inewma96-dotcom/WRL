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
    <section className="relative isolate overflow-hidden bg-[var(--wrl-page-background)] py-16 text-white md:py-20 lg:py-24">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover"
      />
      <div className="absolute inset-0 -z-20 bg-black/40" />
      <div className="absolute inset-0 -z-10 bg-[image:var(--wrl-hero-overlay)]" />
      <div className="wrl-premium-grid absolute inset-0 -z-10 opacity-35" />

      <div className="wrl-shell-wide flex min-h-[52vh] flex-col justify-center">
        <div className="max-w-4xl py-4">
          <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">
            {eyebrow}
          </p>
          <h1 className="wrl-page-title mt-5 max-w-4xl text-balance text-white [overflow-wrap:anywhere]">
            {title}
          </h1>
          <p className="wrl-prose-width mt-6 text-base font-medium leading-8 text-white/85 md:text-xl md:leading-9">
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
        <p className={`wrl-eyebrow ${eyebrowClass}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`wrl-section-title mt-4 text-balance [overflow-wrap:anywhere] ${titleClass}`}>
        {title}
      </h2>
      {description ? (
        <p className={`wrl-prose-width mt-5 text-base leading-8 md:text-lg ${descriptionClass}`}>
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function InfoCard({ title, description, eyebrow, icon: Icon, href }: InfoCardProps) {
  const body = (
    <article className={`h-full p-6 md:p-7 ${href ? "wrl-surface-elevated transition-colors duration-200 group-hover:border-[var(--wrl-border-strong)] group-focus-visible:border-[var(--wrl-border-strong)]" : "wrl-surface"}`}>
      {Icon ? (
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[var(--wrl-accent-gold)] text-[var(--wrl-accent-gold-foreground)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      ) : null}
      {eyebrow ? (
        <p className={`${Icon ? "mt-5" : ""} wrl-eyebrow text-[var(--wrl-accent-gold)]`}>
          {eyebrow}
        </p>
      ) : null}
      <h3 className={`${Icon || eyebrow ? "mt-3" : ""} wrl-card-title text-white`}>
        {title}
      </h3>
      <p className="wrl-body mt-4 text-white/75">
        {description}
      </p>
    </article>
  )

  return href ? (
    <Link href={href} className="group block h-full rounded-lg">
      {body}
    </Link>
  ) : body
}

export function LightCard({ title, description, eyebrow, icon: Icon }: InfoCardProps) {
  return (
    <article className="wrl-surface-light p-6 md:p-7">
      {Icon ? <Icon className="h-6 w-6 text-[var(--wrl-live-red)]" aria-hidden="true" /> : null}
      {eyebrow ? (
        <p className={`${Icon ? "mt-5" : ""} wrl-eyebrow text-[var(--wrl-live-red)]`}>
          {eyebrow}
        </p>
      ) : null}
      <h3 className={`${Icon || eyebrow ? "mt-3" : ""} wrl-card-title text-[var(--wrl-secondary-foreground)]`}>
        {title}
      </h3>
      <p className="wrl-body mt-3 text-[#34423d]">
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
    <div className={`mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(280px,420px)_minmax(0,1fr)] lg:items-center lg:gap-14 ${reverse ? "lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]" : ""}`}>
      {image ? (
        <div className={`wrl-shadow-elevated relative aspect-square overflow-hidden rounded-lg border border-[var(--wrl-border)] bg-black/25 ${reverse ? "lg:order-2" : ""}`}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 420px"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003b36]/35 via-transparent to-transparent" />
        </div>
      ) : null}
      <div>
        {eyebrow ? (
          <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="wrl-section-title mt-4 text-balance [overflow-wrap:anywhere]">
          {title}
        </h2>
        <div className="wrl-prose-width wrl-body-large mt-6 text-white/80">
          {description}
        </div>
        {children}
      </div>
    </div>
  )
}

export function CTASection({ eyebrow, title, description, primary, secondary }: CTASectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--wrl-page-background)] py-12 text-white md:py-16">
      <div className="wrl-shell-wide">
        <div className="wrl-surface-elevated relative flex flex-col gap-8 p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="wrl-eyebrow text-[var(--wrl-accent-gold)]">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="wrl-section-title mt-3 text-balance [overflow-wrap:anywhere]">
              {title}
            </h2>
            <p className="wrl-prose-width wrl-body-large mt-4 text-white/75">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            {renderAction(primary)}
            {secondary ? renderAction(secondary, "secondary") : null}
          </div>
        </div>
      </div>
    </section>
  )
}
