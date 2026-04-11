/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // ADD THESE TWO BLOCKS:
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, 
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
