import js from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      '.next',
      'out',
      'build',
      '*.lock',
      '*.log',
      '.DS_Store',
      '.env',
      '.env.local',
      '.env.*.local',
      'coverage',
    ],
  },
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  prettier,
  {
    files: ['src/**/*.ts'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-case-declarations': 'warn',
      'no-empty': 'warn',
    },
  },
];
