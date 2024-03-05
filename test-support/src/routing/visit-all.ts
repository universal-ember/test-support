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

function findInAppLinks(): string[] {
  return (findAll('a')
    ?.map((link) => link.getAttribute('href'))
    ?.filter((href) => !href?.startsWith('http'))
    .filter(Boolean) || []) as string[];
}

const assert = QUnit.assert;

export async function visitAllLinks() {
  /**
   * string of "on::target"
   */
  const visited = new Set();
  let returnTo = '/';

  await visit(returnTo);

  const inAppLinks = findInAppLinks();
  const queue: (string | { changeReturnTo: string })[] = [...inAppLinks];

  const ctx = getContext() as unknown as { owner: Owner };
  const router = ctx?.owner?.lookup('service:router') as RouterService;

  debugAssert(`Could not find the router service`, router);

  while (queue.length > 0) {
    const toVisit = queue.shift();

    debugAssert(`Queue entries cannot be falsey`, toVisit);

    if (typeof toVisit === 'object' && toVisit !== null) {
      returnTo = toVisit.changeReturnTo;
      continue;
    }

    const key = `${currentURL()}::${toVisit}`;

    if (visited.has(key)) continue;

    const result = router.recognize(toVisit);

    if (!result) {
      assert.ok(
        true,
        `${toVisit} on page ${returnTo} is not recognized by this app and will be skipped`,
      );
      continue;
    }

    await visit(returnTo);

    const link = find(`a[href="${toVisit}"]`);

    debugAssert(`link exists with ${toVisit}`, link);

    await click(link);
    assert.ok(
      currentURL().startsWith(toVisit),
      `Navigation was successful: to:${toVisit}, from:${returnTo}`,
    );
    visited.add(key);

    const links = findInAppLinks();

    queue.push({ changeReturnTo: currentURL() });
    queue.push(...links);
  }
}
