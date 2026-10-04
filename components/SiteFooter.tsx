"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Mail, MapPin, Phone, Radio, Smartphone } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { navLinks } from "@/lib/constants"
import { cn } from "@/lib/utils"

const exploreLinks = [
  ...navLinks.filter((link) => ["/", "/about", "/programs", "/news"].includes(link.href)),
  { name: "Airwaves", href: "/airwaves" },
  { name: "Watch Live", href: "/watch-live" },
  { name: "Gallery", href: "/gallery" },
]

const ministryLinks = [
  ...navLinks.filter((link) => ["/coverage", "/projects", "/partners", "/support-us"].includes(link.href)),
  { name: "Donation Information", href: "/donate" },
  { name: "Contact", href: "/contact" },
]

const footerLinkClass =
  "inline-flex min-h-11 w-fit items-center rounded-md py-2 text-sm font-semibold text-[var(--wrl-muted-foreground)] underline-offset-4 transition-colors duration-200 hover:text-white hover:underline"

export default function SiteFooter() {
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="relative border-t border-[var(--wrl-border-strong)] bg-[var(--wrl-page-background)] text-white">
      <div className="wrl-shell-wide pb-16 pt-10 sm:pb-18 sm:pt-12 lg:pb-20 lg:pt-14">
        <div className="flex flex-col gap-4 border-b border-[var(--wrl-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm font-bold text-white">
            <Radio className="h-5 w-5 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
            <span>93.9 FM</span>
            <span className="text-[var(--wrl-muted-foreground)]">Port Moresby</span>
          </div>
          <p className="text-sm font-semibold text-[var(--wrl-muted-foreground)]">
            PNG&apos;s Christian radio station
          </p>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.72fr_0.9fr_1.18fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="Wantok Radio Light home"
              className="inline-flex rounded-md focus-visible:outline-offset-4"
            >
              <Image
                src="/images/WRL Logo.jpg"
                alt="Wantok Radio Light"
                width={756}
                height={276}
                sizes="(max-width: 639px) 150px, 170px"
                className="h-auto w-[150px] object-contain sm:w-[170px]"
              />
            </Link>

            <h2 className="mt-5 text-xl font-extrabold text-white">Wantok Radio Light</h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-[var(--wrl-muted-foreground)]">
              Wantok Radio Light is PNG&apos;s Christian radio station, sharing the love,
              hope, and truth of Jesus Christ through radio, media, and community ministry.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/support-us"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "border-white/30 text-white hover:bg-white/10",
                )}
              >
                Support WRL
              </Link>
              <Link href="/donate" className={buttonVariants({ variant: "gold", size: "sm" })}>
                Donation Information
              </Link>
            </div>
          </div>

          <FooterNavigation title="Explore" label="Footer explore links" links={exploreLinks} />
          <FooterNavigation title="Ministry" label="Footer ministry links" links={ministryLinks} />

          <div>
            <h2 className="text-sm font-bold text-[var(--wrl-accent-gold)]">Contact</h2>
            <address className="mt-4 space-y-2 text-sm not-italic">
              <p className="flex items-start gap-3 py-2 leading-6 text-[var(--wrl-muted-foreground)]">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
                <span>
                  Gerehu Stage 2, Sivari Road
                  <br />
                  Port Moresby, Papua New Guinea
                </span>
              </p>
              <ContactLink href="tel:+6753260946" label="Call Wantok Radio Light on (675) 326 0946">
                <Phone className="h-4 w-4 shrink-0 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
                (675) 326 0946
              </ContactLink>
              <ContactLink href="tel:+6753262933" label="Call Wantok Radio Light on (675) 326 2933">
                <Phone className="h-4 w-4 shrink-0 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
                (675) 326 2933
              </ContactLink>
              <ContactLink href="tel:+67573560346" label="Call the Wantok Radio Light studio on (675) 73560346">
                <Smartphone className="h-4 w-4 shrink-0 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
                (675) 73560346
              </ContactLink>
              <ContactLink href="mailto:wantok@wantokradio.org" label="Email Wantok Radio Light">
                <Mail className="h-4 w-4 shrink-0 text-[var(--wrl-accent-gold)]" aria-hidden="true" />
                <span className="break-all">wantok@wantokradio.org</span>
              </ContactLink>
            </address>

            <a
              href="https://www.facebook.com/ChristianNet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Wantok Radio Light on Facebook (opens in a new tab)"
              className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-md border border-[var(--wrl-border)] px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:border-[var(--wrl-border-strong)] hover:text-[var(--wrl-accent-gold)]"
            >
              <Facebook className="h-5 w-5" aria-hidden="true" />
              Facebook
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--wrl-border)] pt-6 text-sm text-[var(--wrl-muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Wantok Radio Light. All rights reserved.</p>
          <p>Port Moresby, Papua New Guinea</p>
        </div>
      </div>
    </footer>
  )
}

type FooterNavigationProps = {
  title: string
  label: string
  links: Array<{ name: string; href: string }>
}

function FooterNavigation({ title, label, links }: FooterNavigationProps) {
  return (
    <div>
      <h2 className="text-sm font-bold text-[var(--wrl-accent-gold)]">{title}</h2>
      <nav aria-label={label} className="mt-4">
        <ul className="space-y-1" role="list">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={footerLinkClass}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

type ContactLinkProps = {
  href: string
  label: string
  children: React.ReactNode
}

function ContactLink({ href, label, children }: ContactLinkProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex min-h-11 w-fit items-center gap-3 rounded-md py-2 text-[var(--wrl-muted-foreground)] transition-colors duration-200 hover:text-white hover:underline"
    >
      {children}
    </a>
  )
}
