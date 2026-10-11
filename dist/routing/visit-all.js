import { assert as assert$1 } from '@ember/debug';
import { visit, getContext, find, click, currentURL, findAll } from '@ember/test-helpers';
import QUnit from 'qunit';
import { shouldHandle } from 'should-handle-link';

function findInAppLinks() {
  const results = [];
  const allAnchorsOnThePage = findAll('a');
  for (const a of allAnchorsOnThePage) {
    // `findAll('a')` can also match SVG `<a>`, whose `href` is an
    // SVGAnimatedString the router (and shouldHandle) can't work with.
    if (!(a instanceof HTMLAnchorElement)) continue;
    const href = a.getAttribute('href');
    if (!href) continue;

    /**
     * Links the SPA's router never handles are handled natively by the
     * browser instead (new tab/window via `target`, download dialog,
     * `mailto:`/`tel:`, cross-origin, `rel="external"`). Clicking them in a
     * test can't change `currentURL()`, so they'd always be reported as
     * failed navigations.
     *
     * `shouldHandle` is the predicate ember-primitives' @properLinks uses to
     * decide whether the router handles a click, so the crawler visits
     * exactly the set of links the router would. The fabricated click event
     * carries the "plain left click" defaults (button 0, no modifier keys).
     */
    if (!shouldHandle(window.location.href, a, new MouseEvent('click'))) {
      continue;
    }
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
async function visitAllLinks(callback, knownRedirects, options) {
  const mode = options?.mode ?? 'visit';
  const shouldVisit = options?.shouldVisit ?? (() => true);
  /**
   * app-relative target paths (without hash)
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

    // Keyed on the target alone: this crawl answers "is every reachable URL
    // visitable?", so one visit per target suffices. Keying on
    // (current page, target) pairs re-visits every target from every page
    // that links it — quadratic in the size of the app (shared nav links
    // appear on every page), which times out on documentation-sized apps.
    const key = nonHashPart;
    if (visited.has(key)) continue;
    if (!shouldVisit(toVisit.href)) continue;
    const result = router.recognize(toVisit.href);
    if (!result) {
      assert.ok(true, `${toVisit.href} on page ${returnTo} is not recognized by this app and will be skipped`);
      continue;
    }
    if (!toVisit.original.startsWith('/')) {
      console.warn(`[visitAllLinks] Relative href "${toVisit.original}" found on ${returnTo}. ` + `Relative hrefs resolve against the browser's URL rather than the app's current route, ` + `so they only behave in a real full-page visit — they misresolve in this test harness ` + `and under any mount where the address bar isn't the route (embeds, previews). ` + `The crawler navigated to the resolved target instead. ` + `Action: update the source document to link to "${toVisit.href}" directly.`);
    }
    if (mode === 'click') {
      await visit(returnTo);
      const link = find(toVisit.selector);
      assert$1(`link exists via selector \`${toVisit.selector}\``, link);

      /**
       * The click navigates by `element.href`, which the browser resolved
       * against the test page's URL (e.g. `/tests`) — NOT against the app's
       * current route the way a production visit would (there, the address
       * bar is the current route). A relative href would therefore navigate
       * somewhere the real app never goes. We already resolved the target
       * against `currentURL()` when the link was encountered, so point the
       * anchor at that; the click then exercises the real
       * properLinks-and-router path with the production URL.
       */
      if (!toVisit.original.startsWith('/')) {
        link.setAttribute('href', toVisit.href);
      }
      await click(link);
    } else {
      try {
        await visit(nonHashPart ?? toVisit.href);
      } catch (error) {
        // visit() rejects when the route errors (click-mode surfaces the
        // same problem as a URL mismatch via the app's error substate)
        assert.pushResult({
          result: false,
          actual: String(error),
          expected: nonHashPart,
          message: `Navigation was successful: to:${toVisit.original}, from:${returnTo}`
        });
        visited.add(key);
        continue;
      }
    }
    const current = rootURL.replace(/\/$/, '') + '/' + currentURL().replace(/^\//, '');
    const expected = knownRedirects?.[toVisit.href] ?? toVisit.href;
    // currentURL() never includes a #hash, so compare without it
    const [expectedPath] = expected.split('#');
    assert.pushResult({
      result: current.startsWith(expectedPath ?? expected),
      actual: current,
      expected: expectedPath,
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
