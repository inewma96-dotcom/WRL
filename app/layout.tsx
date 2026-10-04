import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import MediaPlaybackGuard from "@/components/MediaPlaybackGuard"
import ProtectedAreaExitGuard from "@/components/ProtectedAreaExitGuard"
import RouteFadeTransition from "@/components/RouteFadeTransition"
import SiteChrome from "@/components/SiteChrome"
import SiteFooter from "@/components/SiteFooter"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Consolas", "Courier New", "monospace"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background font-sans text-foreground">
        <AuthProvider>
          <MediaPlaybackGuard />
          <ProtectedAreaExitGuard />

          <RouteFadeTransition>
            <SiteChrome />

            {children}

            <SiteFooter />
          </RouteFadeTransition>
        </AuthProvider>
      </body>
    </html>
  )
}
