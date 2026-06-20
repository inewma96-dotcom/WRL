import type { NextConfig } from "next";

const cdnBaseUrl = process.env.MEDIA_CDN_URL || process.env.MEDIA_STORAGE_PUBLIC_URL
const cdnUrl = cdnBaseUrl ? new URL(cdnBaseUrl) : null

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
