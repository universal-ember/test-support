/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  setupContext,
  teardownContext,
  setupApplicationContext,
  visit,
  currentURL,
} from '@ember/test-helpers';

/**
 * Simulates reloading the app without reloading the page.
 *
 * Is an alias for the few utilities from `@ember/test-helpers` to teardown an app and re-visit the same page.
 */
export async function refresh(context: any) {
  const url = currentURL();

  await teardownContext(context);
  await setupContext(context);
  await setupApplicationContext(context);
  await visit(url);
}
