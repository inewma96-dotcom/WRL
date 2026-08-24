import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import MediaPlaybackGuard from "@/components/MediaPlaybackGuard"
import ProtectedAreaExitGuard from "@/components/ProtectedAreaExitGuard"
import RouteFadeTransition from "@/components/RouteFadeTransition"
import SiteChrome from "@/components/SiteChrome"
import SiteFooter from "@/components/SiteFooter"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#003b36] text-white">
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
