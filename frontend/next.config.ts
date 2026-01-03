/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['health-eco-backend.railway.app'],
  },
}

module.exports = nextConfig