import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      { source: "/xsadmin/:path*", headers: noindex },
      { source: "/api/:path*", headers: noindex },
      ...(process.env.VERCEL_ENV === "preview" ? [{ source: "/:path*", headers: noindex }] : []),
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "img.sofascore.com", pathname: "/api/v1/**" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
