import type { Registry as ServiceRegistry } from '@ember/service';
export declare function getService<ServiceName extends keyof ServiceRegistry>(name: ServiceName): ServiceRegistry[ServiceName];
