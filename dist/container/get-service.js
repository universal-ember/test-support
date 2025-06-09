import { assert } from '@ember/debug';
import { getContext } from '@ember/test-helpers';
import { getOwner } from '@ember/owner';

function getService(name) {
  const context = getContext();
  assert('Could not determine the context for the test', context);
  const owner = context.owner || getOwner(context);
  assert('Could not find the owner on the context', owner);
  const service = owner.lookup(`service:${name}`);
  return service;
}

export { getService };
//# sourceMappingURL=get-service.js.map
