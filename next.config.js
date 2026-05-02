/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // Notionの画像が保存されているサーバーのドメインを許可
    domains: [
      "www.notion.so",
      "s3.us-west-2.amazonaws.com",
      "prod-files-secure.s3.us-west-2.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
