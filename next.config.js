/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['maps.googleapis.com'],
  },
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  // Test dosyalarını build sürecinden hariç tut
  webpack: (config, { isServer }) => {
    // Test dosyalarını hariç tut
    config.module.rules.push({
      test: /\.test\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader',
    })
    
    return config
  },
}

module.exports = nextConfig 