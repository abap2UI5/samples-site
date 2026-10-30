// The abap2UI5 sample catalogue - one static site, built from this repository
// and published by GitHub Pages (.github/workflows/pages.yml). The data is
// fetched before the build by scripts/fetch-data.mjs; nothing else comes
// from another repository.
//
// BASE is where Pages serves this repository: /<repository name>/.
import { defineConfig } from "astro/config";

export const BASE = process.env.SITE_BASE ?? "/samples-site/";

export default defineConfig({
  site: "https://abap2ui5.github.io",
  base: BASE,
  trailingSlash: "ignore",
  build: { format: "directory", assets: "assets", inlineStylesheets: "never" },
  devToolbar: { enabled: false },
  markdown: { syntaxHighlight: false },
});
