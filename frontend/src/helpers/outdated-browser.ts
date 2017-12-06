const IEdgeMatches = /(Edge|Trident)\/(\d.)/i.exec(navigator.userAgent);
const isOutdatedBrowser = IEdgeMatches && parseInt(IEdgeMatches[2], 10) < 16;

export { isOutdatedBrowser };
