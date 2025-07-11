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

  // External libraries
  scripts: [
    {src: 'https://d3js.org/d3.v7.min.js', async: true},
    {
      src: 'https://cdn.jsdelivr.net/npm/cal-heatmap@4.2.4/dist/cal-heatmap.min.js',
      async: true,
    },
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/cal-heatmap@4.2.4/dist/cal-heatmap.css',
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: ({docPath}) =>
            `https://github.com/Pantagrueliste/CavrianaCorr_FrontEnd/issues/new?title=${encodeURIComponent(
              docPath,
            )}&labels=error`,
        },
        blog: {
          showReadingTime: true,
          editUrl: ({blogPath}) =>
            `https://github.com/Pantagrueliste/CavrianaCorr_FrontEnd/issues/new?title=${encodeURIComponent(
              blogPath,
            )}&labels=error`,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Filippo Cavriana: The Secret Correspondence',
      items: [
        {to: '/docs/intro', label: 'Letters', position: 'left'},
        {to: '/docs/intro', label: 'About', position: 'left'},
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
            {label: 'About', to: '/docs/intro'},
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'Encoded Text',
              href: 'https://github.com/Pantagrueliste/CavrianaCorr_BackEnd',
            },
            {label: 'Blog', to: '/blog'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Clément Godbarge.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;