/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/mayapony",
  assetPrefix: "/mayapony",
  images: {
    unoptimized: true, // ← export 模式下禁用图片优化
  },
};

module.exports = nextConfig;
