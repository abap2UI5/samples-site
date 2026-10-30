# AGENTS.md

The abap2UI5 sample catalogue: one static site, built from this repository
and published by GitHub Pages at `https://abap2ui5.github.io/<repository>/`.
It used to be part of the playground's build; it is a site of its own now,
one of the abap2UI5 family (CONVENTION.md in abap2UI5/abap2UI5.github.io).

## Layout

| Path | Purpose |
| --- | --- |
| `scripts/fetch-data.mjs` | Fetches `src/data/apps.json` - the catalogue the playground publishes at `/playground/samples/apps.json` - and the ABAP of every sample from raw GitHub into `src/data/sources/`. Both gitignored |
| `src/data/catalogue.ts` | Reads the data: sources, groups, samples, the run and GitHub links |
| `src/pages/index.astro` | The catalogue: a section per repository, groups inside it, a tile per sample, the search above |
| `src/pages/sample/[slug].astro` | A page per sample: summary, facts, Run in the playground, Source on GitHub, the class |
| `src/components/Tile.astro` | One tile, with the data attributes the search reads |
| `public/filter.js` | The search: words, repository, library, UI5 release, runs in the browser; the only script |
| `src/layouts/Page.astro`, `src/styles/global.css` | The document and the look, after the family's convention |
| `test/site.test.mjs` | `node:test` over `dist/` |

## Rules

- **Data, not code, from other repositories.** The catalogue (`apps.json`) and
  the sample sources are published files, fetched before the build. No code
  of the playground or the sample repositories is imported.
- **The playground is a link.** "Run in the playground" is
  `https://abap2ui5.github.io/playground/?src=<raw GitHub URL of the class>` -
  the playground's URL contract. No frame, no loader script.
- **One script.** `public/filter.js`, a file of this origin; no inline script,
  no handler attribute, no inline style, nothing from another origin.
- **The base is the repository name.** `SITE_BASE` (the workflow sets it to
  `/<repository>/`), default `/samples-site/`.
