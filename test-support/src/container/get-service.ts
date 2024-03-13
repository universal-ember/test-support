import type { Registry as ServiceRegistry } from '@ember/service';
import { getContext } from '@ember/test-helpers';

export function getService<ServiceName extends keyof ServiceRegistry>(
  name: ServiceName,
): ServiceRegistry[ServiceName] {
  const context = getContext();
  const owner = context.owner;

  const service = owner.lookup(`service:${name}`);

  return service;
}
