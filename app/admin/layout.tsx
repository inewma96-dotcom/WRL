"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  // ✅ LOGIN PAGE ONLY
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-[#003b36] text-white">

        {/* TOP NAVBAR */}
        <header className="border-b border-white/10 bg-black/30 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

            {/* LOGO */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="WRL Logo"
                width={170}
                height={70}
                className="object-contain"
              />
            </Link>

            {/* NAV LINKS */}
            <nav className="flex items-center gap-8 text-sm font-semibold text-yellow-400">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>

              <Link href="/airwaves" className="transition hover:text-white">
                Airwaves
              </Link>

              <Link href="/coverage" className="transition hover:text-white">
                Coverage
              </Link>

              <Link href="/projects" className="transition hover:text-white">
                Projects
              </Link>

              <Link href="/about" className="transition hover:text-white">
                About Us
              </Link>

              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>

              <Link href="/news" className="transition hover:text-white">
                News
              </Link>

              <Link href="/partners" className="transition hover:text-white">
                Partners
              </Link>
              
              <Link href="/prayer-request" className="transition hover:text-white">
               Prayer Request
               </Link>

              <Link
                href="/donate"
                className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300"
              >
                Donate
              </Link>
            </nav>
          </div>
        </header>

        {/* LOGIN */}
        <div className="flex min-h-[85vh] items-center justify-center px-4">
          {children}
        </div>
      </div>
    )
  }

  const links = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Airwaves", href: "/admin/airwaves" },
    { name: "News", href: "/admin/news" },
    { name: "Programs", href: "/admin/programs" },
    { name: "Payments", href: "/admin/payments" },
    { name: "Donations", href: "/admin/donations" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Payment Settings", href: "/admin/payment-settings" },
    { name: "Account", href: "/admin/account" },
  ]

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      localStorage.removeItem("refreshToken")
      router.replace("/login")
      router.refresh()

    } catch (err) {
      console.error(err)
      alert("Logout failed")
    }
  }

  return (
    <div className="flex min-h-screen bg-[#003b36] text-white">

      {/* SIDEBAR */}
      <aside className="flex w-64 flex-col border-r border-white/10 bg-black/40 p-6">
        <h2 className="mb-6 text-xl font-bold text-yellow-400">
          Admin Panel
        </h2>

        <nav className="space-y-3">
          {links.map((link) => {
            const active = pathname === link.href

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`block rounded-lg px-4 py-2 transition ${
                  active || (link.href === "/admin/dashboard" && pathname === "/admin")
                    ? "bg-yellow-400 font-bold text-black"
                    : "hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">
        <div className="mb-8 flex justify-end">
          <button
            onClick={logout}
            className="rounded-xl bg-red-500 px-6 py-3 font-bold text-white transition hover:bg-red-400"
          >
            Logout
          </button>
        </div>

        {children}
      </main>
    </div>
  )
}
