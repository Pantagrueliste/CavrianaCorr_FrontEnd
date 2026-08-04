/**
 * Applies the reader's text-view settings to <html> before hydration, so a
 * page never flashes the wrong reading. Mirrors how Docusaurus applies the
 * colour mode.
 *
 * An attribute that is already present is left alone: theme-classic's own
 * inline script has by then applied any ?docusaurus-data-cav-view=... from
 * the URL, which makes a pinned view citable.
 */
const SETTINGS = [
  {storage: 'cav.view', attr: 'data-cav-view', fallback: 'reading'},
];

module.exports = function editionViewPlugin() {
  return {
    name: 'edition-view',
    injectHtmlTags() {
      const body = SETTINGS.map(
        (s) => `
  if (!d.hasAttribute(${JSON.stringify(s.attr)})) {
    var v = null;
    try { v = window.localStorage.getItem(${JSON.stringify(s.storage)}); } catch (e) {}
    d.setAttribute(${JSON.stringify(s.attr)}, v || ${JSON.stringify(s.fallback)});
  }`,
      ).join('\n');
      return {
        preBodyTags: [
          {
            tagName: 'script',
            innerHTML: `(function(){var d=document.documentElement;${body}})();`,
          },
        ],
      };
    },
  };
};
