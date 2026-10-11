interface VisitAllLinksOptions {
    /**
     * How each discovered target is navigated to:
     *
     * - `'visit'` (the default): `visit(target)` directly. One page render per
     *   unique target — the cheapest possible full crawl.
     * - `'click'`: return to the page the link was found on and click the
     *   actual anchor, exercising the app's link-interception (e.g.
     *   `@properLinks`) for every link. Twice the page renders of `'visit'`
     *   (each processed link re-renders its source page), so reserve it for
     *   apps that need per-link click fidelity.
     */
    mode?: 'visit' | 'click';
    /**
     * Decides whether a discovered target is crawled at all. Return `false` to
     * skip it — the crawl neither navigates to it nor asserts on it, and its
     * own links are not discovered through it.
     *
     * For links the app deliberately refuses to navigate — e.g. demo links
     * whose route calls `transition.abort()`, or areas under test elsewhere:
     *
     * ```js
     * await visitAllLinks(undefined, undefined, {
     *   shouldVisit: (url) => !url.startsWith('/demo-targets/'),
     * });
     * ```
     *
     * Receives the app-relative target (hash included, as authored).
     */
    shouldVisit?: (url: string) => boolean;
}
export declare function visitAllLinks(callback?: (url: string) => void | Promise<void>, knownRedirects?: Record<string, string>, options?: VisitAllLinksOptions): Promise<number>;
export {};
