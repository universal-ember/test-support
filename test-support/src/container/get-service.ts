import { assert } from '@ember/debug';
import type { Registry as ServiceRegistry } from '@ember/service';
import { getContext } from '@ember/test-helpers';
import { getOwner } from '@ember/owner';
import type Owner from '@ember/owner';

export function getService<ServiceName extends keyof ServiceRegistry>(
  name: ServiceName,
): ServiceRegistry[ServiceName] {
  const context = getContext() as { owner?: Owner } | undefined;
  assert('Could not determine the context for the test', context);

  const owner = context.owner || getOwner(context);
  assert('Could not find the owner on the context', owner);

  const service = owner.lookup(`service:${name}`);

  return service;
}
