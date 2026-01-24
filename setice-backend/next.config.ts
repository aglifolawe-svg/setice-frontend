/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // ✅ Désactiver Turbopack pour le build
  experimental: {
    turbo: undefined,
  },
}

module.exports = nextConfig