import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { expectTypeOf } from 'expect-type';

import { getService } from '@universal-ember/test-support';
import RouterService from '@ember/routing/router-service';

module('getService', function (hooks) {
  setupApplicationTest(hooks);

  test('gets the service', async function (assert) {
    const router = getService('router');
    expectTypeOf(router).toEqualTypeOf<RouterService>();

    assert.ok(router);
  });
});
