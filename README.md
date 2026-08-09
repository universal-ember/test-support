# test-support

Common utilities for every app to help making testing easier.


## `getService`

A typed way to get a service.

```js
import { getService } from '@universal-ember/test-support';

test('can get a service', async function (assert) {
  let router = getService('router');
  //  ^ RouterService
});
```

## `noop`

a no-op function. literally does nothing.

```gjs
import { noop } from '@universal-ember/test-support';

<template>
  {{ ( noop ) }}
</template>
```

## `refresh`

Simulates refreshing the page without reloading the test window

```js
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { currentURL, visit } from '@ember/test-helpers';

import { refresh } from '@universal-ember/test-support';

module('refresh', function (hooks) {
  setupApplicationTest(hooks);

  test('are visitable without error', async function (assert) {
    await visit('/foo');
    await refresh(this);
    assert.strictEqual(currentURL(), '/foo');
  });
});
```

## `visitAllLinks`

Will visit all links, recursively, exhausting every link in your app (excluding external links).

This is helpful for making sure that no un-tested pages have errors.

```js
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
  });
});
```
