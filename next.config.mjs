/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img1.hscicdn.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "h.cricapi.com" },
      { protocol: "https", hostname: "p.cricapi.com" },
      { protocol: "https", hostname: "**.cricapi.com" },
    ],
  },
};

export default nextConfig;
