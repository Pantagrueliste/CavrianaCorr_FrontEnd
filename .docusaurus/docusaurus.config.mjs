/*
 * AUTOGENERATED - DON'T EDIT
 * Your edits in this file will be overwritten in the next build!
 * Modify the docusaurus.config.js file at your site's root instead.
 */
export default {
  "title": "Filippo Cavriana: The Secret Correspondence",
  "tagline": "A digital edition of manuscript letters found in the archives of Florence, Mantua, and the Bibliothèque nationale de France",
  "favicon": "img/favicon.ico",
  "url": "https://pantagrueliste.github.io",
  "baseUrl": "/CavrianaCorr_FrontEnd/",
  "organizationName": "Pantagrueliste",
  "projectName": "CavrianaCorr_FrontEnd",
  "onBrokenLinks": "throw",
  "onBrokenMarkdownLinks": "warn",
  "scripts": [
    {
      "src": "https://d3js.org/d3.v7.min.js",
      "async": true
    },
    {
      "src": "https://cdn.jsdelivr.net/npm/cal-heatmap@4.2.4/dist/cal-heatmap.min.js",
      "async": true
    }
  ],
  "stylesheets": [
    {
      "href": "https://cdn.jsdelivr.net/npm/cal-heatmap@4.2.4/dist/cal-heatmap.css"
    }
  ],
  "i18n": {
    "defaultLocale": "en",
    "locales": [
      "en"
    ],
    "path": "i18n",
    "localeConfigs": {}
  },
  "presets": [
    [
      "classic",
      {
        "docs": {
          "path": "docs",
          "routeBasePath": "docs",
          "sidebarPath": "/Users/clementgodbarge/Cavriana/CavrianaCorr_FrontEnd/sidebars.js",
          "editUrl": "https://github.com/Pantagrueliste/CavrianaCorr_FrontEnd/tree/main/"
        },
        "blog": {
          "showReadingTime": true,
          "editUrl": "https://github.com/Pantagrueliste/CavrianaCorr_FrontEnd/tree/main/"
        },
        "theme": {
          "customCss": "/Users/clementgodbarge/Cavriana/CavrianaCorr_FrontEnd/src/css/custom.css"
        }
      }
    ]
  ],
  "themeConfig": {
    "image": "img/docusaurus-social-card.jpg",
    "navbar": {
      "title": "Filippo Cavriana: The Secret Correspondence",
      "items": [
        {
          "to": "/docs/intro",
          "label": "Letters",
          "position": "left"
        },
        {
          "to": "/docs/intro",
          "label": "About",
          "position": "left"
        },
        {
          "to": "/blog",
          "label": "Blog",
          "position": "left"
        },
        {
          "href": "https://github.com/Pantagrueliste/CavrianaCorr",
          "label": "Encoded Text",
          "position": "right"
        }
      ],
      "hideOnScroll": false
    },
    "footer": {
      "style": "dark",
      "links": [
        {
          "title": "Content",
          "items": [
            {
              "label": "Letters",
              "to": "/docs/intro"
            },
            {
              "label": "About",
              "to": "/docs/intro"
            }
          ]
        },
        {
          "title": "Project",
          "items": [
            {
              "label": "Encoded Text",
              "href": "https://github.com/Pantagrueliste/CavrianaCorr_BackEnd"
            },
            {
              "label": "Blog",
              "to": "/blog"
            }
          ]
        }
      ],
      "copyright": "Copyright © 2025 Clément Godbarge."
    },
    "prism": {
      "theme": {
        "plain": {
          "color": "#393A34",
          "backgroundColor": "#f6f8fa"
        },
        "styles": [
          {
            "types": [
              "comment",
              "prolog",
              "doctype",
              "cdata"
            ],
            "style": {
              "color": "#999988",
              "fontStyle": "italic"
            }
          },
          {
            "types": [
              "namespace"
            ],
            "style": {
              "opacity": 0.7
            }
          },
          {
            "types": [
              "string",
              "attr-value"
            ],
            "style": {
              "color": "#e3116c"
            }
          },
          {
            "types": [
              "punctuation",
              "operator"
            ],
            "style": {
              "color": "#393A34"
            }
          },
          {
            "types": [
              "entity",
              "url",
              "symbol",
              "number",
              "boolean",
              "variable",
              "constant",
              "property",
              "regex",
              "inserted"
            ],
            "style": {
              "color": "#36acaa"
            }
          },
          {
            "types": [
              "atrule",
              "keyword",
              "attr-name",
              "selector"
            ],
            "style": {
              "color": "#00a4db"
            }
          },
          {
            "types": [
              "function",
              "deleted",
              "tag"
            ],
            "style": {
              "color": "#d73a49"
            }
          },
          {
            "types": [
              "function-variable"
            ],
            "style": {
              "color": "#6f42c1"
            }
          },
          {
            "types": [
              "tag",
              "selector",
              "keyword"
            ],
            "style": {
              "color": "#00009f"
            }
          }
        ]
      },
      "darkTheme": {
        "plain": {
          "color": "#F8F8F2",
          "backgroundColor": "#282A36"
        },
        "styles": [
          {
            "types": [
              "prolog",
              "constant",
              "builtin"
            ],
            "style": {
              "color": "rgb(189, 147, 249)"
            }
          },
          {
            "types": [
              "inserted",
              "function"
            ],
            "style": {
              "color": "rgb(80, 250, 123)"
            }
          },
          {
            "types": [
              "deleted"
            ],
            "style": {
              "color": "rgb(255, 85, 85)"
            }
          },
          {
            "types": [
              "changed"
            ],
            "style": {
              "color": "rgb(255, 184, 108)"
            }
          },
          {
            "types": [
              "punctuation",
              "symbol"
            ],
            "style": {
              "color": "rgb(248, 248, 242)"
            }
          },
          {
            "types": [
              "string",
              "char",
              "tag",
              "selector"
            ],
            "style": {
              "color": "rgb(255, 121, 198)"
            }
          },
          {
            "types": [
              "keyword",
              "variable"
            ],
            "style": {
              "color": "rgb(189, 147, 249)",
              "fontStyle": "italic"
            }
          },
          {
            "types": [
              "comment"
            ],
            "style": {
              "color": "rgb(98, 114, 164)"
            }
          },
          {
            "types": [
              "attr-name"
            ],
            "style": {
              "color": "rgb(241, 250, 140)"
            }
          }
        ]
      },
      "additionalLanguages": [],
      "magicComments": [
        {
          "className": "theme-code-block-highlighted-line",
          "line": "highlight-next-line",
          "block": {
            "start": "highlight-start",
            "end": "highlight-end"
          }
        }
      ]
    },
    "colorMode": {
      "defaultMode": "light",
      "disableSwitch": false,
      "respectPrefersColorScheme": false
    },
    "docs": {
      "versionPersistence": "localStorage",
      "sidebar": {
        "hideable": false,
        "autoCollapseCategories": false
      }
    },
    "blog": {
      "sidebar": {
        "groupByYear": true
      }
    },
    "metadata": [],
    "tableOfContents": {
      "minHeadingLevel": 2,
      "maxHeadingLevel": 3
    }
  },
  "baseUrlIssueBanner": true,
  "future": {
    "experimental_faster": {
      "swcJsLoader": false,
      "swcJsMinimizer": false,
      "swcHtmlMinimizer": false,
      "lightningCssMinimizer": false,
      "mdxCrossCompilerCache": false,
      "rspackBundler": false
    },
    "experimental_storage": {
      "type": "localStorage",
      "namespace": false
    },
    "experimental_router": "browser"
  },
  "onBrokenAnchors": "warn",
  "onDuplicateRoutes": "warn",
  "staticDirectories": [
    "static"
  ],
  "customFields": {},
  "plugins": [],
  "themes": [],
  "headTags": [],
  "clientModules": [],
  "titleDelimiter": "|",
  "noIndex": false,
  "markdown": {
    "format": "mdx",
    "mermaid": false,
    "mdx1Compat": {
      "comments": true,
      "admonitions": true,
      "headingIds": true
    },
    "anchors": {
      "maintainCase": false
    }
  }
};
