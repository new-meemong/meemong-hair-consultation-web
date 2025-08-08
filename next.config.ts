import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'picsum.photos',
      'meemong-job-storage.s3.ap-northeast-2.amazonaws.com',
      'k.kakaocdn.net',
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
