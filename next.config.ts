import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // A landing page é um HTML estático em public/lp/index.html.
  // Na Hostinger o /lp abre esse arquivo direto; aqui o rewrite faz o mesmo no npm run dev.
  async rewrites() {
    return [{ source: "/lp", destination: "/lp/index.html" }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
