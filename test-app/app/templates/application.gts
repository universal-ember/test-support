<template>
  <h2 id="title">Welcome to Ember</h2>

  {{outlet}}

  <a href="/foo">here</a>
  <a href="/does-not-exist">here</a>
  <a href="#title">here</a>
  <a href="/#title">/ here</a>

  {{! non-SPA links: handled by the browser, not the router — visitAllLinks must skip them }}
  <a href="/foo" target="_blank" rel="noopener noreferrer">new tab</a>
  <a href="/some-report/index.html" download>download</a>
  <a href="/foo" rel="external">external</a>
  <a href="mailto:someone@example.com">email</a>
</template>
