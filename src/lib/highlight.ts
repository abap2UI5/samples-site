/* The class on a sample page, highlighted at build time by Prism - the same
 * way abap2UI5 Insights highlights its code. Prism marks each token with a
 * class that global.css colours; nothing is written as a style attribute and
 * no script reaches the browser, so the page keeps its policy
 * (script-src 'self', style-src 'self'). Prism escapes the source itself. */
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";

loadLanguages(["abap"]);

// A line that is a comment from its first character on - the "! ABAP Doc
// above every sample class - is a comment as a whole. Prism's grammar looks
// for strings before it looks for " comments, so a quoted 'NAME' in a doc
// line came out as a string; this rule runs first and takes the line.
Prism.languages.insertBefore("abap", "string", {
  "line-comment": { pattern: /^[ \t]*".*/m, alias: "comment" },
});

export function highlightAbap(code: string): string {
  return Prism.highlight(code, Prism.languages.abap, "abap");
}
