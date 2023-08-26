const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  experimental: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['stellarforge.org'],
  },
  devIndicators: {
    buildActivity: false,
  },
  pwa: {
    dest: 'public',
    swSrc: 'src/service-worker.js',
  },
});

nextConfig.publicRuntimeConfig = {
  ASSET_SERVER_URL: process.env.ASSET_SERVER_URL,
  HORIZON_URL: process.env.HORIZON_URL,
  DAPP_URL: process.env.DAPP_URL,
  FAKE_USA_ISSUER: process.env.FAKE_USA_ISSUER,
  FAKE_USA_WRAPPER_ISSUER: process.env.FAKE_USA_WRAPPER_ISSUER,
};

module.exports = nextConfig;
