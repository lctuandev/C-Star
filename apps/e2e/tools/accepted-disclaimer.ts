import { disclaimer } from '@cstar/content';
import type { Page } from '@playwright/test';

/** For specs about something else: a returning player who already accepted. */
export const asReturningPlayer = (page: Page) =>
  page.addInitScript((version) => {
    localStorage.setItem('cstar.disclaimer-accepted-version', String(version));
  }, disclaimer.version);
