# The Next Season: Pacers and Fever Research Edition

An independent, source-backed, static research workspace about Fever merchandising context. No synthetic Fever sales or inventory data. No sign-in, tracking or backend.

## Three sections

1. **Executive overview:** Public 2024 Team Store growth, historical Wikimedia article attention with timeframe and comparison filters, and transparent caveats.
2. **Historical replay:** Choose a complete pre-draft month, inspect the information visible at that cutoff, then reveal the actual April 2024 surge.
3. **Signals to watch:** Three verified structural or cultural developments, with source links, merchant questions, historical context, limits, and what internal data would be needed to evaluate them.

Each page has a context-specific CSV export button. The application contains no personal creator biography.

## Deploy to your existing GitHub Pages site

1. Extract this ZIP. Open the extracted folder.
2. In your GitHub repository `the-next-season`, replace the root `index.html`, `app.js`, and `styles.css` and replace the contents of the `data` folder. Upload `README.md`, `METHODOLOGY.md`, `scripts/`, and `tests/` if desired.
3. Use GitHub repository **Settings > Pages > Deploy from a branch > main > /(root)**. No build step is required.
4. Open your Pages URL and test all three sections. The static site will read `data/attention.json` and `data/signals.json`.

**Do not upload the outer extracted folder as a subfolder.** `index.html` belongs directly in the repository root.

## Run locally

From the project directory, run `python -m http.server 8000` then open http://localhost:8000. Opening `index.html` with a file:// URL may block JSON loading.

## Tests

Run `python tests/verify_data.py` to check the JSON schema, historical key measurements, cited official sources, and source-date constraints.

Run `node --check app.js` to check JavaScript syntax. Manually test the three-page navigation, timeframe and comparison filters, replay cutoff and reveal, signal filter, and CSV downloads in the browser before sharing with an executive.

## Evidence and limitations

See `METHODOLOGY.md` for the exact public data definitions, verified links and analytical limitations. The historical dataset is a cached prior research extract, with 2024 March and April values independently cross-checked; run the refresh script with network access to verify or replace the entire cache.

Research as of November 19, 2026. Not affiliated with or endorsed by PSE, the Indiana Fever, the WNBA or NCAA.

## November 2026 revision

Historical Replay now includes both Indiana Fever 2024 and Indiana Pacers 2025, using the already included Wikimedia pageview series. The Signals to Watch page puts the unanswered merchant decision and the private evidence needed to test it ahead of calendar facts. The default Pacers cutoff is April 2025. May is explicitly labeled as an already unfolding surge, not an early-warning period. No sales or inventory data is claimed.
