import { assert as debugAssert } from '@ember/debug';
import {
  visit,
  find,
  getContext,
  click,
  currentURL,
  findAll,
} from '@ember/test-helpers';
import QUnit from 'qunit';
import type Owner from '@ember/owner';
import type RouterService from '@ember/routing/router-service';

interface InAppLink {
  href: string;
  original: string;
  selector: string;
}

function findInAppLinks(): InAppLink[] {
  const results: InAppLink[] = [];

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
      selector: `a[href="${href}"]`,
    });
  }

  return results;
}

const assert = QUnit.assert;

export async function visitAllLinks(
  callback?: (url: string) => void | Promise<void>,
  knownRedirects?: Record<string, string>;
) {
  /**
   * string of "on::target"
   */
  const visited = new Set();
  let returnTo = '/';

  await visit(returnTo);

  const inAppLinks = findInAppLinks();
  const queue: (InAppLink | { changeReturnTo: string })[] = [...inAppLinks];

  const ctx = getContext() as unknown as { owner: Owner };
  const router = ctx?.owner?.lookup('service:router') as RouterService;

  debugAssert(`Could not find the router service`, router);

  while (queue.length > 0) {
    const toVisit = queue.shift();

    debugAssert(`Queue entries cannot be falsey`, toVisit);

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
      assert.ok(
        true,
        `${toVisit.href} on page ${returnTo} is not recognized by this app and will be skipped`,
      );
      continue;
    }

    await visit(returnTo);

    const link = find(toVisit.selector);

    debugAssert(`link exists via selector \`${toVisit.selector}\``, link);

    await click(link);

    let current = currentURL();
    let expected = knownRedirects?.[current] ?? toVisit.href;

    assert.pushResult({
      result: current.startsWith(expected),
      actual: current,
      expected: expected,
      message: `Navigation was successful: to:${toVisit.original}, from:${returnTo}`,
    });
    visited.add(key);

    if (callback) {
      await callback(toVisit.href);
    }

    const links = findInAppLinks();

    queue.push({ changeReturnTo: currentURL() });
    queue.push(...links);
  }

  return visited.size;
}
