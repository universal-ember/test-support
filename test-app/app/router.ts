import EmberRouter from '@ember/routing/router';
import config from 'test-app/config/environment';

import { properLinks } from 'ember-primitives/proper-links';

@properLinks
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Add route declarations here
  this.route('foo');
});
