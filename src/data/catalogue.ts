/* The catalogue, read from src/data/apps.json (scripts/fetch-data.mjs): the
 * sources (the three sample repositories), the groups a source is shown in,
 * and every sample with what it builds and needs. */
import fs from "node:fs";

type Source = { id: string; repo: string; title: string; blurb: string; count: number };
type Stage = { id: string; title: string; blurb: string; source: string };
type Raw = {
  source: string; class: string; title: string; note?: string; summary?: string; group?: string; stage?: string;
  keywords?: string[]; docs?: string[]; file: string; controls?: number[]; libraries?: string[]; minUi5?: string;
  runs?: boolean; entity?: string; sample?: string;
};
export type Sample = Raw & { slug: string; repo: string; controlNames: string[]; source_: Source };

const apps = JSON.parse(fs.readFileSync("src/data/apps.json", "utf8"));
export const PLAYGROUND = "https://abap2ui5.github.io/playground/";
export const ui5: string = apps.ui5;
export const releases: string[] = apps.releases ?? [];
export const sources: Source[] = apps.sources;
export const stages: Stage[] = apps.stages ?? [];
const sourceById = Object.fromEntries(sources.map((s) => [s.id, s]));
const controls: string[] = apps.controls ?? [];

export const samples: Sample[] = (apps.entries as Raw[]).map((e) => ({
  ...e,
  slug: e.class.toLowerCase(),
  repo: sourceById[e.source]?.repo ?? "",
  controlNames: (e.controls ?? []).map((i) => controls[i]).filter(Boolean),
  source_: sourceById[e.source],
}));

export const libraries: string[] = [...new Set(samples.flatMap((s) => s.libraries ?? []))].sort();

/* The groups of one source, in the order the reader meets them: the learning
 * path's stages for the samples repository, the UI5 library for the demo kit
 * ports, the technology for the stack samples. */
export function groupsOf(sourceId: string): { id: string; title: string; blurb?: string; items: Sample[] }[] {
  const items = samples.filter((s) => s.source === sourceId);
  if (sourceId === "learn" && stages.length) {
    const known = stages.filter((st) => st.source === "learn" || !st.source);
    const out = known.map((st) => ({ id: `${sourceId}-${st.id}`, title: st.title, blurb: st.blurb, items: items.filter((s) => s.stage === st.id) }));
    const rest = items.filter((s) => !known.some((st) => st.id === s.stage));
    if (rest.length) out.push({ id: `${sourceId}-more`, title: "More", blurb: undefined, items: rest });
    return out.filter((g) => g.items.length);
  }
  const by = new Map<string, Sample[]>();
  for (const s of items) { const k = s.group || "Other"; by.set(k, [...(by.get(k) ?? []), s]); }
  return [...by].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => ({ id: `${sourceId}-${k.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`, title: k, items: v }));
}

export const runLink = (s: Sample) =>
  `${PLAYGROUND}?src=${encodeURIComponent(`https://raw.githubusercontent.com/${s.repo}/main/${s.file}`)}`;
export const githubLink = (s: Sample) => `https://github.com/${s.repo}/blob/main/${s.file}`;
export function sourceOf(s: Sample): string | undefined {
  try { return fs.readFileSync(`src/data/sources/${s.slug}.abap`, "utf8"); } catch { return undefined; }
}
