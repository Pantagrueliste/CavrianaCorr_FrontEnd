// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Filippo Cavriana: The Secret Correspondence',
  tagline:
    'A digital edition of manuscript letters found in the archives of Florence, Mantua, and the Bibliothèque nationale de France',
  favicon: 'img/favicon.ico',
  url: 'https://pantagrueliste.github.io',
  baseUrl: '/CavrianaCorr_FrontEnd/',
  organizationName: 'Pantagrueliste',
  projectName: 'CavrianaCorr_FrontEnd',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    require.resolve('./plugins/letter-count-sidebar'),
    require.resolve('./plugins/edition-view'),
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Letters that were published under a date the TEI has since
        // corrected, or as duplicates now merged into a better witness.
        // Without these, every previously citable URL 404s.
        redirects: [
          {from: '/docs/1571/1571-02-12', to: '/docs/1572/1572-02-12'},
          {from: '/docs/1571/1572-02-12', to: '/docs/1572/1572-02-12'},
          {from: '/docs/1571/1571-08-04', to: '/docs/1571/1571-08-14'},
          {from: '/docs/1571/1570-04-18', to: '/docs/1571/1571-04-18'},
          {from: '/docs/1570/1570-10-11', to: '/docs/1570/1570-09-11'},
          {from: '/docs/1570/1570-11-02-a', to: '/docs/1570/1570-11-02'},
          {from: '/docs/1570/1570-11-02-c', to: '/docs/1570/1570-11-02-b'},
          {from: '/docs/1570/1570-02-06', to: '/docs/1571/1571-02-06'},
        ],
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // Letter pages under docs/<year>/ are generated from TEI sources in
          // the CavrianaCorr repo, so error reports go there, against the
          // source file. Hand-written pages stay with this repo.
          editUrl: ({docPath}) => {
            const letter = docPath.match(/^\d{4}\/(.+)\.mdx?$/);
            return letter
              ? `https://github.com/Pantagrueliste/CavrianaCorr/issues/new?title=${encodeURIComponent(
                  `letters/${letter[1]}.xml`,
                )}&labels=error`
              : `https://github.com/Pantagrueliste/CavrianaCorr_FrontEnd/issues/new?title=${encodeURIComponent(
                  `docs/${docPath}`,
                )}&labels=error`;
          },
        },
        blog: {
          showReadingTime: true,
          editUrl: ({blogPath}) =>
            `https://github.com/Pantagrueliste/CavrianaCorr_FrontEnd/issues/new?title=${encodeURIComponent(
              blogPath,
            )}&labels=error`,
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/cavriana-heatmap-custom.css'),
          ],
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/banner.webp',
    navbar: {
      title: 'Filippo Cavriana: The Secret Correspondence',
      items: [
        {to: '/docs/intro', label: 'Letters', position: 'left'},
        {to: '/people', label: 'People', position: 'left'},
        {to: '/places', label: 'Places', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/Pantagrueliste/CavrianaCorr',
          label: 'Encoded Text',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Content',
          items: [
            {label: 'Letters', to: '/docs/intro'},
            {label: 'People', to: '/people'},
            {label: 'Places', to: '/places'},
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'Encoded Text',
              href: 'https://github.com/Pantagrueliste/CavrianaCorr',
            },
            {label: 'Blog', to: '/blog'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Clément Godbarge. Letters licensed under CC BY 4.0; site code under MIT.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;