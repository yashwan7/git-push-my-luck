/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // MediaPipe's wasm files need to be served as static assets untouched by webpack
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
};

module.exports = nextConfig;
