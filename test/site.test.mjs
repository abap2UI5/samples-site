// What the built site must keep, read off dist/ after `npm run build`.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const DIST = path.join(import.meta.dirname, "..", "dist");
const apps = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "..", "src", "data", "apps.json"), "utf8"));
const home = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const pages = fs.readdirSync(path.join(DIST, "sample"));

function policy(html, name) {
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    assert.match(m[1], /\ssrc="[^"]*\/filter\.js"/, `${name}: a script other than filter.js`);
    assert.equal(m[2].trim(), "", `${name}: inline script code`);
  }
  assert.doesNotMatch(html, /\son[a-z]+=/i, `${name}: an inline event handler`);
  assert.doesNotMatch(html, /\sstyle="/i, `${name}: an inline style`);
  assert.match(html, /http-equiv="Content-Security-Policy" content="[^"]*script-src 'self'/, `${name}: the policy`);
  for (const m of html.matchAll(/\s(?:src)="(https?:[^"]+)"/g)) assert.fail(`${name} loads ${m[1]}`);
}

test("every sample of the catalogue has a tile and a page", () => {
  assert.ok(apps.entries.length > 500, `${apps.entries.length} samples`);
  assert.equal(pages.length, apps.entries.length);
  assert.equal((home.match(/<li data-source=/g) || []).length, apps.entries.length);
});

test("the catalogue: the search is hidden without the script, every source has a section", () => {
  assert.match(home, /<form class="finder" role="search" hidden>/);
  for (const s of apps.sources) assert.match(home, new RegExp(`data-source-section="${s.id}"`));
  policy(home, "index");
});

test("a sample page runs in the playground by a plain link, and prints its class", () => {
  for (const slug of pages.slice(0, 40)) {
    const html = fs.readFileSync(path.join(DIST, "sample", slug, "index.html"), "utf8");
    assert.match(html, /href="https:\/\/abap2ui5\.github\.io\/playground\/\?src=https%3A%2F%2Fraw\.githubusercontent\.com%2FabapUI5|href="https:\/\/abap2ui5\.github\.io\/playground\/\?src=https%3A%2F%2Fraw\.githubusercontent\.com%2Fabap2UI5%2F/, `${slug}: the run link`);
    assert.match(html, /<a class="brand" href="https:\/\/abap2ui5\.github\.io\/">/, `${slug}: the way home`);
    policy(html, slug);
  }
  const withCode = pages.filter((slug) => fs.readFileSync(path.join(DIST, "sample", slug, "index.html"), "utf8").includes('<section class="source">')).length;
  assert.ok(withCode > pages.length * 0.9, `${withCode} of ${pages.length} pages print their class`);
});
