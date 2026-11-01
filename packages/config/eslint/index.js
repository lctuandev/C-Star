import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Type-aware lint config for Node/TypeScript workspaces.
 * @param {{ tsconfigRootDir: string }} options
 */
export const createNodeConfig = ({ tsconfigRootDir }) =>
  defineConfig(
    { ignores: ['dist/**', 'coverage/**'] },
    js.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
      languageOptions: {
        globals: globals.node,
        parserOptions: { projectService: true, tsconfigRootDir },
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      },
    },
    {
      files: ['**/*.js', '**/*.mjs'],
      extends: [tseslint.configs.disableTypeChecked],
    },
    prettier,
  );

const FORBIDDEN_IMPORTS = [
  'react',
  'react/*',
  'react-dom',
  'react-dom/*',
  'next',
  'next/*',
  'three',
  'three/*',
  '@react-three/*',
  'node:*',
  'fs',
  'path',
];

const DETERMINISM_MESSAGE =
  'game-core must be deterministic: randomness comes from the seeded RNG in the run (contracts/gameplay.md §2).';

/**
 * Keeps a package free of UI, rendering, IO and hidden inputs,
 * so a run can be replayed from its seed and choices.
 */
export const pureDomainConfig = {
  files: ['src/**/*.ts'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: FORBIDDEN_IMPORTS,
            message: 'game-core must stay pure: no UI, rendering or IO imports (ADR-001).',
          },
        ],
      },
    ],
    'no-restricted-properties': [
      'error',
      { object: 'Math', property: 'random', message: DETERMINISM_MESSAGE },
      { object: 'Date', property: 'now', message: DETERMINISM_MESSAGE },
    ],
    'no-restricted-syntax': [
      'error',
      { selector: "NewExpression[callee.name='Date']", message: DETERMINISM_MESSAGE },
    ],
  },
};
