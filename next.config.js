const { existsSync } = require('fs');
const { resolve } = require('path');

const rootEnvLoaderPath = resolve(__dirname, '../../scripts/load-root-env.cjs');

if (existsSync(rootEnvLoaderPath)) {
  require(rootEnvLoaderPath).loadRootEnv();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // The English landing used to be /?lang=en; it is a real page now.
  async redirects() {
    return [{ source: '/', has: [{ type: 'query', key: 'lang', value: 'en' }], destination: '/en', permanent: true }];
  },
};

module.exports = nextConfig;
