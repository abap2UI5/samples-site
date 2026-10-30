// The search of the catalogue: a text field, the repository, the UI5 library,
// the release a system runs and "runs in the browser" narrow the tiles;
// groups and repositories left empty disappear, the count says how many are
// shown. Without this script the form stays hidden and every sample is shown.
// A file of this origin, no inline code, so the Content-Security-Policy allows it.
(() => {
  const form = document.querySelector(".finder");
  if (!form) return;
  const q = form.querySelector(".finder-q");
  const shown = form.querySelector(".finder-shown");
  const empty = form.querySelector(".finder-empty");
  const items = [...document.querySelectorAll("li[data-source]")];
  const groups = [...document.querySelectorAll(".group")];
  const sections = [...document.querySelectorAll("[data-source-section]")];
  const num = (v) => v.split(".").map(Number);
  const atMost = (a, b) => { const x = num(a), y = num(b); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) < (y[i] || 0); } return true; };
  form.hidden = false;
  const apply = () => {
    const words = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    const source = form.elements.source.value, lib = form.elements.lib.value, ui5 = form.elements.ui5.value, runs = form.elements.runs.checked;
    let n = 0;
    for (const li of items) {
      const d = li.dataset;
      const ok = (!source || d.source === source) && (!lib || d.libs.split(" ").includes(lib)) && (!ui5 || !d.min || atMost(d.min, ui5))
        && (!runs || d.runs) && words.every((w) => d.words.includes(w));
      li.hidden = !ok;
      if (ok) n++;
    }
    for (const g of groups) g.hidden = !g.querySelector("li[data-source]:not([hidden])");
    for (const s of sections) s.hidden = !s.querySelector("li[data-source]:not([hidden])");
    shown.textContent = n;
    empty.hidden = n > 0;
  };
  form.addEventListener("input", apply);
  form.addEventListener("submit", (e) => e.preventDefault());
  form.addEventListener("reset", () => setTimeout(apply, 0));
  apply();
})();
