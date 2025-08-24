import { currentURL, settled, teardownContext, setupContext, setupApplicationContext, visit } from '@ember/test-helpers';

/* eslint-disable @typescript-eslint/no-explicit-any */


/**
 * Simulates reloading the app without reloading the page.
 *
 * Is an alias for the few utilities from `@ember/test-helpers` to teardown an app and re-visit the same page.
 */
async function refresh(context) {
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

export { refresh };
//# sourceMappingURL=test-helpers-extensions.js.map
