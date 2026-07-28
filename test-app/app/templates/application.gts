import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { service } from '@ember/service';

import type RouterService from '@ember/routing/router-service';

/**
 * The classic test-app used ember-primitives' `@properLinks` for this.
 * `visitAllLinks` clicks plain anchors, so in-app links must route
 * through the router instead of letting the browser navigate away
 * from the test page.
 */
export default class ApplicationTemplate extends Component {
  @service declare router: RouterService;

  handleClick = (event: MouseEvent) => {
    const anchor = (event.target as Element | null)?.closest('a[href]');

    if (!anchor) return;

    const href = anchor.getAttribute('href');

    if (!href || href.startsWith('http')) return;

    event.preventDefault();

    if (href.startsWith('#')) return;

    const current = new URL(
      this.router.currentURL ?? '/',
      window.location.origin,
    );
    const url = new URL(href, current);

    this.router.transitionTo(`${url.pathname}${url.search}`);
  };

  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <div {{on "click" this.handleClick}}>
      <h2 id="title">Welcome to Ember</h2>

      {{outlet}}

      <a href="/foo">here</a>
      <a href="/does-not-exist">here</a>
      <a href="#title">here</a>
      <a href="/#title">/ here</a>
    </div>
  </template>
}
