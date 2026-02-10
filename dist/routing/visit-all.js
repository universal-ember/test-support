import { assert as assert$1 } from '@ember/debug';
import { visit, getContext, currentURL, find, click, findAll } from '@ember/test-helpers';
import QUnit from 'qunit';

function findInAppLinks() {
  const results = [];
  const allAnchorsOnThePage = findAll('a');
  for (const a of allAnchorsOnThePage) {
    const href = a.getAttribute('href');
    if (!href) continue;
    if (href.startsWith('http')) continue;
    const current = new URL(currentURL(), window.location.origin);
    const url = new URL(href, current);
    const withoutDomain = `${url.pathname}${url.search}${url.hash}`;
    results.push({
      href: withoutDomain,
      original: href,
      selector: `a[href="${href}"]`
    });
  }
  return results;
}
const assert = QUnit.assert;
async function visitAllLinks(callback, knownRedirects) {
  /**
   * string of "on::target"
   */
  const visited = new Set();
  let returnTo = '/';
  await visit(returnTo);
  const inAppLinks = findInAppLinks();
  const queue = [...inAppLinks];
  const ctx = getContext();
  const router = ctx?.owner?.lookup('service:router');
  assert$1(`Could not find the router service`, router);
  const rootURL = router.rootURL;
  while (queue.length > 0) {
    const toVisit = queue.shift();
    assert$1(`Queue entries cannot be falsey`, toVisit);
    if ('changeReturnTo' in toVisit) {
      returnTo = toVisit.changeReturnTo;
      continue;
    }

    // In-page links are on the page we're already on.
    // As long as we haven't already encountered an error,
    // this is silly to check.
    if (toVisit.original.startsWith('#')) {
      continue;
    }
    const [nonHashPart] = toVisit.href.split('#');

    // This was our first page, we've already been here
    if (nonHashPart === '/') {
      continue;
    }
    const key = `${currentURL()}::${nonHashPart}`;
    if (visited.has(key)) continue;
    const result = router.recognize(toVisit.href);
    if (!result) {
      assert.ok(true, `${toVisit.href} on page ${returnTo} is not recognized by this app and will be skipped`);
      continue;
    }
    await visit(returnTo);
    const link = find(toVisit.selector);
    assert$1(`link exists via selector \`${toVisit.selector}\``, link);
    await click(link);
    const current = rootURL.replace(/\/$/, '') + '/' + currentURL().replace(/^\//, '');
    const expected = knownRedirects?.[toVisit.href] ?? toVisit.href;
    assert.pushResult({
      result: current.startsWith(expected),
      actual: current,
      expected: expected,
      message: `Navigation was successful: to:${toVisit.original}, from:${returnTo}`
    });
    visited.add(key);
    if (callback) {
      await callback(toVisit.href);
    }
    const links = findInAppLinks();
    queue.push({
      changeReturnTo: currentURL()
    });
    queue.push(...links);
  }
  return visited.size;
}

export { visitAllLinks };
//# sourceMappingURL=visit-all.js.map
