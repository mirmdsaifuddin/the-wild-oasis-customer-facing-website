/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jyunrinnclxhblkfkcuu.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabins-image/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // ✅ Add this
        port: "",
        pathname: "/**", // ✅ Match any path
      },
    ],
  },
};

export default nextConfig;
