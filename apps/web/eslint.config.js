import prettier from 'eslint-config-prettier';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  prettier,
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'coverage/**']),
]);
