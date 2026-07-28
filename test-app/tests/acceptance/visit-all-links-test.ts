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

  test('relative links navigate against the current route, and warn', async function (assert) {
    // /docs/page renders `<a href="other">`, which from /docs/page must land
    // on /docs/other. The browser resolves the anchor's element.href against
    // the TEST PAGE's url (/tests) — which would send the router to /other —
    // so the crawler points the anchor at the currentURL-resolved target
    // before clicking (and warns: relative hrefs are an authoring hazard the
    // app author should fix). The navigation assertions inside visitAllLinks
    // fail this test if the click lands anywhere else.
    const visited: string[] = [];
    const warnings: string[] = [];
    const originalWarn = console.warn;

    console.warn = (...args: unknown[]) => warnings.push(args.join(' '));

    try {
      await visitAllLinks((url) => {
        visited.push(url);
      });
    } finally {
      console.warn = originalWarn;
    }

    assert.true(visited.includes('/docs/other'), `visited: ${visited.join(', ')}`);

    const warning = warnings.find((w) => w.includes('Relative href "other"'));

    assert.true(Boolean(warning), 'warned about the relative href');
    assert.true(
      Boolean(warning?.includes('"/docs/other"')),
      'the warning names the resolved target to author instead',
    );
  });

  test('click mode crawls the same targets as visit mode', async function (assert) {
    // 'visit' (the default) navigates straight to each target — one render
    // per unique URL. 'click' returns to the source page and clicks the real
    // anchor (including the relative-href rewrite). Same reachability either
    // way.
    const viaVisit: string[] = [];
    const viaClick: string[] = [];

    await visitAllLinks((url) => {
      viaVisit.push(url);
    });
    await visitAllLinks(
      (url) => {
        viaClick.push(url);
      },
      undefined,
      { mode: 'click' },
    );

    assert.deepEqual(viaClick.sort(), viaVisit.sort(), 'both modes crawl the same URLs');
  });

  test('each target is visited once', async function (assert) {
    // `visited` is keyed on the target path alone (not (page, target) pairs):
    // shared links — like this app's application-template nav — appear on
    // every page, and pair-keying makes the crawl quadratic in app size.
    const visited: string[] = [];

    await visitAllLinks((url) => {
      visited.push(url);
    });

    const paths = visited.map((url) => url.split('#')[0]);

    assert.strictEqual(
      new Set(paths).size,
      paths.length,
      `no target is visited twice: ${paths.join(', ')}`,
    );
  });
});
