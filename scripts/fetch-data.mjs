// Fetches the data the site is built from, into src/data/ (gitignored):
//
// - apps.json, the sample catalogue the playground publishes: every sample of
//   the three sample repositories, with the controls it builds, the UI5
//   libraries and the lowest UI5 release it needs, and whether it runs in the
//   playground. It is a published data file, read like the catalogue.json
//   each sample repository commits - no code of the playground is used.
// - sources/<class>.abap, the ABAP of every sample, from raw GitHub, so each
//   sample page prints its class. A source that cannot be fetched costs that
//   page its listing, never the build.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const DATA = path.join(ROOT, "src", "data");
const CATALOGUE = process.env.CATALOGUE_URL ?? "https://abap2ui5.github.io/playground/samples/apps.json";
const CONCURRENCY = 24;

const res = await fetch(CATALOGUE);
if (!res.ok) throw new Error(`${CATALOGUE}: HTTP ${res.status} - the site cannot be built without its catalogue`);
const apps = await res.json();
if (!Array.isArray(apps.entries) || apps.entries.length === 0) throw new Error(`${CATALOGUE}: no entries`);
fs.mkdirSync(path.join(DATA, "sources"), { recursive: true });
fs.writeFileSync(path.join(DATA, "apps.json"), JSON.stringify(apps));

const repoOf = Object.fromEntries(apps.sources.map((s) => [s.id, s.repo]));
const queue = apps.entries.filter((e) => e.file && repoOf[e.source]);
let fetched = 0, missing = 0;
async function worker() {
  for (;;) {
    const e = queue.shift();
    if (!e) return;
    const url = `https://raw.githubusercontent.com/${repoOf[e.source]}/main/${e.file}`;
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(String(r.status));
      fs.writeFileSync(path.join(DATA, "sources", `${e.class.toLowerCase()}.abap`), await r.text());
      fetched++;
    } catch { missing++; }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`data: ${apps.entries.length} samples, ${fetched} sources fetched, ${missing} missing`);
