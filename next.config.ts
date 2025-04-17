/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@chakra-ui/react', '@chakra-ui/icons'],
}

module.exports = nextConfig
