/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // Export as a static site for GitHub Pages
  output: "export",

  // Generate trailing slashes (recommended for GitHub Pages)
  trailingSlash: true,

  // Disable Next.js image optimization (required for static export)
  images: {
    unoptimized: true,
  },

  // GitHub Pages configuration
  basePath: isProd ? "/Parth-Jamodkar" : "",
  assetPrefix: isProd ? "/Parth-Jamodkar/" : "",

  // Disable the "Powered by Next.js" header
  poweredByHeader: false,

  // Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig;
