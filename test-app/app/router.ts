import EmberRouter from '@ember/routing/router';

import { properLinks } from 'ember-primitives/proper-links';

import config from '#config';

@properLinks
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('foo');
  this.route('hash-target');
  this.route('docs', function () {
    this.route('page');
    this.route('other');
  });
});
