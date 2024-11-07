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
});
