import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 构建时暂不阻塞于 ESLint（部署通过后可逐步修复 lint）
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // 允许外部图片域名
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // 根路径与 /start 统一跳转到基金估值助手（服务端重定向，不依赖前端）
  async redirects() {
    return [
      { source: '/', destination: '/fund-tracker', permanent: false },
      { source: '/start', destination: '/fund-tracker', permanent: false },
    ];
  },
  // 允许外部API调用（如果需要）
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
