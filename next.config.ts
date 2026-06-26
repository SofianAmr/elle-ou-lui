import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Évite le cache de l'optimiseur Next.js en dev quand on remplace des PNG.
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
