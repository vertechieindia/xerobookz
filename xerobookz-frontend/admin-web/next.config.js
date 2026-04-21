/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@xerobookz/ui-shared", "@xerobookz/api-clients"],
  // Allow local packages
  experimental: {
    externalDir: true,
  },
  // Proxy API requests to backend when running locally
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

