import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [new URL('https://placehold.co/**'), new URL('https://pzvwqiyhwfipmlbzqzxu.supabase.co/**')],
  },
};

export default nextConfig;
