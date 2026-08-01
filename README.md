# CavrianaCorr_FrontEnd

Docusaurus site for [*Filippo Cavriana: The Secret
Correspondence*](https://pantagrueliste.github.io/CavrianaCorr_FrontEnd/), the
digital edition of Filippo Cavriana's letters.

> **⚠️ The letter pages are generated — do not edit them by hand.**
> Everything under `docs/<year>/` is produced from the TEI sources in
> [Pantagrueliste/CavrianaCorr](https://github.com/Pantagrueliste/CavrianaCorr)
> by that repository's `convert-xml-to-markdown.yml` workflow
> (via `templates/transform.xsl`) and is overwritten on every conversion.
> To correct a letter, edit its TEI file (`letters/<date>.xml`) in the source
> repository. The heatmap component (`src/components/CustomHeatmap.jsx`) and
> its stylesheet are likewise synced from the source repository.

## Development

```bash
npm ci        # install dependencies
npm start     # local dev server
npm run build # production build
```

## Deployment

Pushes to `main` are built and deployed to GitHub Pages by
`.github/workflows/main.yml`.

## Citation

Clément Godbarge (ed.). *Filippo Cavriana: The Secret Correspondence*.
Zenodo. https://doi.org/10.5281/zenodo.8224585

## License

Site code: [MIT](LICENSE). Letter content: [CC BY
4.0](https://creativecommons.org/licenses/by/4.0/) (see the source
repository).
