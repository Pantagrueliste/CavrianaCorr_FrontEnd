// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Filippo Cavriana: The Secret Correspondence',
  tagline: 'A digital edition of manuscript letters found in the archives of Florence, Mantua, and the BnF',
  favicon: 'img/favicon.ico',

  // The production URL of your site:
  url: 'https://pantagrueliste.github.io',
  // The /<baseUrl>/ pathname under which your site is served:
  baseUrl: '/CavrianaCorr_FrontEnd/',

  // For GitHub Pages deployment using the Docusaurus deploy command:
  organizationName: 'Pantagrueliste', // Your GitHub username or org
  projectName: 'CavrianaCorr_FrontEnd', // Your repo name

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          // Points to the folder containing your .md files
          path: 'docs',
          // If you want the docs at the root URL, set routeBasePath to '/'
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/Pantagrueliste/CavrianaCorr_FrontEnd/tree/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/Pantagrueliste/CavrianaCorr_FrontEnd/tree/main/',
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
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          // Points to your docs sidebar
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/Pantagrueliste/CavrianaCorr_FrontEnd',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Blog', to: '/blog' },
            {
              label: 'GitHub',
              href: 'https://github.com/Pantagrueliste/CavrianaCorr_FrontEnd',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 
      Filippo Cavriana: The Secret Correspondence. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
