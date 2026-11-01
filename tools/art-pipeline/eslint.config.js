import { createNodeConfig } from '@cstar/config/eslint';

export default [
  ...createNodeConfig({ tsconfigRootDir: import.meta.dirname }),
  { ignores: ['out/**'] },
];
