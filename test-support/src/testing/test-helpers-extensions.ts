/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  setupContext,
  teardownContext,
  setupApplicationContext,
  visit,
  currentURL,
  settled,
} from '@ember/test-helpers';

/**
 * Simulates reloading the app without reloading the page.
 *
 * Is an alias for the few utilities from `@ember/test-helpers` to teardown an app and re-visit the same page.
 */
export async function refresh(context: any) {
  const url = currentURL();

  await settled();

  await teardownContext(context);
  await settled();

  await setupContext(context);
  await settled();

  await setupApplicationContext(context);
  await settled();

  // Has settled built in
  await visit(url);
}
