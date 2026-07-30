/** @type {import('next').NextConfig} */
const nextConfig = {

  // 이미지 호스트
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'linkcare.blob.core.windows.net',
        port: '',
        pathname: '/**',
      }
    ]
  },

};

export default nextConfig;
