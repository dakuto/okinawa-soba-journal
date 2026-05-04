/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // Notionの画像が保存されているサーバーのドメインを許可
    domains: [
      "res.cloudinary.com",
      "www.notion.so",
      "s3.us-west-2.amazonaws.com",
      "prod-files-secure.s3.us-west-2.amazonaws.com",
    ],
  },
  eslint: {
    // ビルド時の警告（imgタグなど）を無視して進める設定
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ビルド時の型エラーを無視して進める設定
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
