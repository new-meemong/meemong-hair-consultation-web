import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/posts/new/:postingId',
        destination: '/posts/:postingId',
        permanent: false,
      },
    ];
  },
  images: {
    domains: [
      'picsum.photos',
      's3.ap-northeast-2.amazonaws.com',
      'meemong-job-storage.s3.ap-northeast-2.amazonaws.com',
      'meemong-uploads.s3.ap-northeast-2.amazonaws.com',
      'k.kakaocdn.net',
      'lh3.googleusercontent.com',
      'example.com',
      'storage.meemong.com',
      'img1.kakaocdn.net',
      'job-storage.meemong.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'meemong-job-storage.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'meemong-uploads.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.meemong.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'job-storage.meemong.com',
        pathname: '/**',
      },
    ],
  },
  devIndicators: false,
  webpack(config) {
    // SVG 파일을 React 컴포넌트로 사용하기 위한 설정
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
