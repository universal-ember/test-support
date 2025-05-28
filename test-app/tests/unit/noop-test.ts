import { module, test } from 'qunit';

import { noop } from '@universal-ember/test-support';

noop(1, 2);

function a(fn: () => void) {
  fn();
}

// Passing
a(noop);

module('noop', function () {
  test('does nothing', async function (assert) {
    assert.strictEqual(noop(), undefined);
  });
});
