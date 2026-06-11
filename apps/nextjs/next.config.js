/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ["@contacts/server", "@contacts/ui"],
  images: {
    remotePatterns: [{ hostname: "sessionize.com" }],
  },
};

export default config;
