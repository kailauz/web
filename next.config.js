const { loadRootEnv } = require('../../scripts/load-root-env.cjs');

loadRootEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
