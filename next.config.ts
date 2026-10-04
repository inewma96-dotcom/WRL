import type { NextConfig } from "next";

const cdnBaseUrl = process.env.MEDIA_CDN_URL || process.env.MEDIA_STORAGE_PUBLIC_URL

function parseOptionalRemoteImageUrl(value?: string) {
  if (!value?.trim()) return null

  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:" ? url : null
  } catch {
    return null
  }
}

const cdnUrl = parseOptionalRemoteImageUrl(cdnBaseUrl)

const nextConfig: NextConfig = {
  images: cdnUrl
    ? {
        remotePatterns: [
          {
            protocol: cdnUrl.protocol.replace(":", "") as "http" | "https",
            hostname: cdnUrl.hostname,
          },
        ],
      }
    : undefined,
};

export default nextConfig;
