<template>
  <h3>a nested docs page</h3>

  {{! a RELATIVE href: from /docs/page this must navigate to /docs/other.
      In the test harness the browser resolves element.href against the test
      page's URL (/tests), which would send the router to /other instead —
      visitAllLinks points the anchor at the currentURL-resolved target
      before clicking. }}
  <a href="other">relative sibling</a>
</template>
