/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
  },
  eslint: {
    dirs: ["app", "components", "lib", "types"],
  },
};

export default nextConfig;
