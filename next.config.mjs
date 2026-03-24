/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "weg.back.strapi.wegagen.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
