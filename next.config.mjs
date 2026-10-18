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
  async redirects() {
    return [
      // Bunkering Tankers became one configuration of the broader Tanker Vessels line.
      { source: "/rentals/bunkering-tankers", destination: "/rentals/tanker-vessels", permanent: true },
    ];
  },
};

export default nextConfig;
