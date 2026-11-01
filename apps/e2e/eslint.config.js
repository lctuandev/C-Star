import { createNodeConfig } from '@cstar/config/eslint';

export default [
  { ignores: ['test-results/**', 'playwright-report/**'] },
  ...createNodeConfig({ tsconfigRootDir: import.meta.dirname }),
];
