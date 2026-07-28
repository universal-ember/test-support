import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import { visitAllLinks } from '@universal-ember/test-support';

module('All Links', function (hooks) {
  setupApplicationTest(hooks);

  test('are visitable without error', async function (assert) {
    const size1 = await visitAllLinks();
    const size2 = await visitAllLinks((url) => {
      assert.ok(url);
    });

    assert.ok(size1 > 0, 'The test app has links');
    assert.ok(size2 > 0, 'The test app has links');
    assert.strictEqual(
      size1,
      size2,
      `multiple usages does not visit different numbers of links (${size1} === ${size2})`,
    );
  });

  test('non-SPA links are skipped', async function (assert) {
    // The application template renders target="_blank", download,
    // rel="external", and mailto: links. The browser handles those natively —
    // clicking them can never change currentURL() — so a crawl that clicked
    // them would report failed navigations. Every URL the crawl does visit
    // must be one the router can serve.
    const visited: string[] = [];

    await visitAllLinks((url) => {
      visited.push(url);

      const isNonSPA = url.startsWith('mailto:') || url.endsWith('.html');

      assert.false(isNonSPA, `${url} is a route the router handles`);
    });

    assert.ok(visited.length > 0, 'the SPA links were still visited');
  });
});
