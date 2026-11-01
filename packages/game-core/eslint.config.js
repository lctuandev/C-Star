import { createNodeConfig, pureDomainConfig } from '@cstar/config/eslint';

export default [...createNodeConfig({ tsconfigRootDir: import.meta.dirname }), pureDomainConfig];
