/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the whole site can be hosted on GitHub Pages,
  // Vercel, Netlify, S3, or any plain file host — no Node server required.
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
