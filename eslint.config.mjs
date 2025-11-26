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
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      '.cache/**',
      'public/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Import 순서 규칙 비활성화
      'import/order': 'off',
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
