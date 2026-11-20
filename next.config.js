const { existsSync } = require('fs');
const { resolve } = require('path');

const rootEnvLoaderPath = resolve(__dirname, '../../scripts/load-root-env.cjs');

if (existsSync(rootEnvLoaderPath)) {
  require(rootEnvLoaderPath).loadRootEnv();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  env: { KAILAUZ_SUPPORT_EMAIL: process.env.KAILAUZ_SUPPORT_EMAIL?.trim() || '' },
  reactStrictMode: true,
  async redirects() {
    return ['/', '/privacy', '/terms'].map((source) => ({
      source,
      has: [{ type: 'query', key: 'lang', value: 'en' }],
      destination: source === '/' ? '/en' : `/en${source}`,
      permanent: true,
    }));
  },
};

module.exports = nextConfig;
