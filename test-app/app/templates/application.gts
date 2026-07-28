<template>
  <h2 id="title">Welcome to Ember</h2>

  {{outlet}}

  <a href="/foo">here</a>
  <a href="/does-not-exist">here</a>
  <a href="#title">here</a>
  <a href="/#title">/ here</a>
  <a href="/docs/page">a nested page (with a relative link on it)</a>
  {{! a page+hash link: currentURL() after the click has no #hash, so the
      navigation assertion must compare without it }}
  <a href="/hash-target#down">hash link</a>
  {{! a link the app deliberately refuses to navigate (its route aborts the
      transition) — crawls must be able to skip it via shouldVisit }}
  <a href="/inert-demo-target">inert demo link</a>

  {{! non-SPA links: handled by the browser, not the router — visitAllLinks must skip them }}
  <a href="/foo" target="_blank" rel="noopener noreferrer">new tab</a>
  <a href="/some-report/index.html" download>download</a>
  <a href="/foo" rel="external">external</a>
  <a href="mailto:someone@example.com">email</a>
</template>
