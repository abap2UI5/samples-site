# abap2UI5 samples

Every abap2UI5 sample in one place: the catalogue of the three sample
repositories - [samples](https://github.com/abap2UI5/samples),
[samples-controls](https://github.com/abap2UI5/samples-controls) and
[samples-stack](https://github.com/abap2UI5/samples-stack) - searchable by what
a sample does, by control, library and the UI5 release your system runs, with
a page per sample that prints its class and runs it in the
[playground](https://abap2ui5.github.io/playground/).

```bash
npm ci
npm run data     # fetch the catalogue and the sample sources into src/data/
npm run dev      # http://localhost:4321/samples-site/
npm run check    # data + build + test, what CI runs
```

See `AGENTS.md` for the rules.
