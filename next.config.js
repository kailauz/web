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
};

module.exports = nextConfig;
