/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/flutter/:path*",
        destination: "/flutter/:path*",
      },
    ];
  },
};

export default nextConfig;
