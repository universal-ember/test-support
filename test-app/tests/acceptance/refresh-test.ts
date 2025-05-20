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
