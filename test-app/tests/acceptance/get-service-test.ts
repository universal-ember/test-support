import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import { getService } from '@universal-ember/test-support';

module('getService', function (hooks) {
  setupApplicationTest(hooks);

  test('gets the service', async function (assert) {
    const router = getService('router');

    assert.ok(router);
  });
});
