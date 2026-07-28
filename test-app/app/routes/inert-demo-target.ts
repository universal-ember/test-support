import Route from '@ember/routing/route';

import type Transition from '@ember/routing/transition';

/**
 * Stands in for a route an app deliberately refuses to render — the pattern
 * docs sites use so a demo's links look real while clicking one keeps the
 * reader in place.
 *
 * Such a target isn't meaningfully visitable, and in a real app an aborted
 * transition can make `visit()` reject outright (TransitionAborted), failing
 * the crawl. `shouldVisit` is how an app excludes them.
 */
export default class InertDemoTargetRoute extends Route {
  beforeModel(transition: Transition) {
    transition.abort();
  }
}
