/**
 * Optiniated browsers test. IE and Edge < 16 are bad browsers.
 * Shouldn't be used and it's better to do feature detection, but... you know ;)
 */
const IEdgeMatches = /(Edge|Trident)\/(\d.)/i.exec(navigator.userAgent);
const isOutdatedBrowser = IEdgeMatches && parseInt(IEdgeMatches[2], 10) < 16;

export { isOutdatedBrowser };
