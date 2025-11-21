import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import importPlugin from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Import 순서 규칙 - 일반적인 컨벤션 적용
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js 내장 모듈 (fs, path 등)
            'external', // 외부 라이브러리 (react, next 등)
            'internal', // 절대 경로 import (@/ 시작)
            'parent', // 상위 디렉토리 (../)
            'sibling', // 같은 디렉토리 (./)
            'index', // index 파일
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-*',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/*',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/assets/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/entities/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/features/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/lib/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/shared/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/widgets/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
        },
      ],
      // 중복 import 방지
      'import/no-duplicates': 'error',
      // import 문과 첫 번째 코드 사이에 빈 줄 추가
      'import/newline-after-import': 'error',
      // TypeScript 사용하지 않는 변수 규칙 - 언더스코어로 시작하는 변수는 허용
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
];

export default eslintConfig;
