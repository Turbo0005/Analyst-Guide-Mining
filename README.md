# Ore & Equity: From Novice to Expert Resources Analyst

An interactive, self-paced learning site that takes an investor with limited knowledge to the level of a capable resources (mining) stock analyst, able to read announcements, value projects and companies, spot red flags, and build a disciplined portfolio of mining stocks.

It has an ASX focus, with global examples from the TSX, LSE and NYSE. It is a fully static site: plain HTML, CSS and JavaScript, with no build step and no server needed.

> **Not financial advice.** This is an educational resource. Company figures were checked against public sources as of late October 2026. Fast-moving numbers such as metal prices and share prices are date-stamped and will go stale. Items marked *unverified* in the text should be checked before you rely on them.

---

## Quick start

**Open locally:** unzip the folder and double-click `index.html`. It runs straight from disk.

**Or serve it locally:**
```bash
cd mining-analyst-guide
python3 -m http.server 8000
# then open http://localhost:8000
```

**Host on GitHub Pages:**
1. Create a new repository and upload the contents of this folder, with `index.html` at the repository root.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then pick `main` and `/ (root)`.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

All links are relative, so it works on any static host, including Netlify, Cloudflare Pages and Vercel.

---

## How the course is structured

About **105 hours of core study**, plus a 15 to 25 hour capstone, with a **fast track of about 40 to 45 hours** for experienced investors. It is ordered economics first: you value your first company early, and geology and metallurgy are taught as you need them, with a reference library for depth.

The running case study is **De Grey Mining and the Hemi gold project**, followed from the 2020 discovery to Northern Star's 2025 takeover. Each module adds a page to your "Hemi dossier".

| Phase | Modules |
|---|---|
| **A. The whole game** | 1 How mining stocks behave · 2 The Lassonde curve and base rates · 3 The Hemi story |
| **B. Read the news** | 4 Geology essentials · 5 Drill results · 6 Resources, reserves and reporting codes (JORC, NI 43-101, S-K 1300) · 7 Quarterlies, Appendix 5B and accounts |
| **C. Rocks to cash** | 8 Metallurgy and payable metal · 9 Mining methods · 10 Costs (C1, AISC, AIC) · 11 Operations and ramp-up |
| **D. Markets and macro** | 12 Macro and FX (AUD) · 13 Commodity markets |
| **E. The money** | 14 Financing and dilution · 15 Studies (scoping, PFS, DFS) · 16 DCF and NAV · 17 Sensitivity and what's priced in · 18 Multiples · 19 Hedges, royalties and streams · 20 How junior stocks trade |
| **F. Judgement** | 21 Jurisdiction, tax and ESG · 22 Management and governance · 23 Takeovers · 24 Red flags |
| **G. Practice** | 25 Case workshop · 26 Screen to deep dive · 27 Portfolio construction and sizing |
| **Capstone** | 28 A full investment thesis on a real ASX company, revisited at 6 and 12 months |

Each module ends with a quiz. Scoring 80% or more marks it complete and adds its flashcards to your deck.

---

## Features

- **Learning-path map** on the home page, with colour-coded phases, a 60-second cold-open challenge, and a 3-question placement check that can route you to the fast track.
- **30+ interactive tools** (see `tools.html`), each opening with a predict-then-check challenge, including:
  - a Hemi NPV and NAV model with a sensitivity (tornado) chart and an implied gold-price solver
  - an operating-leverage slider, a cost curve, and a C1, AISC and AIC cost sorter
  - a drill-section true-width simulator, a metal-equivalent calculator, and a grade-tonnage and cut-off slider
  - a resource-to-reserve funnel, a payable-metal and NSR calculator (2025 vs 2026 smelter terms), and a lithium unit converter
  - an Appendix 5B cash-runway calculator, a funding-gap and dilution waterfall, and a hedge-book mark-to-market
  - an A$ gold price heatmap, a liquidity and days-to-exit calculator, and a position-sizing calculator
  - jurisdiction, management and red-flag scorecards, plus a tear-sheet builder
- **"What happened next?" game** (`game.html`): read a real historical announcement, predict the share-price reaction, and see a calibration plot of your confidence against your accuracy.
- **Flashcards** (`flashcards.html`): 181 cards with spaced repetition, at most 12 new cards a day.
- **Hemi dossier** (`dossier.html`): write your own analysis page by page, compare it with the analyst's version, and export it as Markdown.
- **Library** (`library/`): 14 deposit-type cards and 13 commodity one-pagers, covering gold, copper, lithium, iron ore, nickel, uranium, coal, rare earths, silver, zinc, mineral sands, PGMs and graphite.
- **Glossary** of 157 terms, automatically linked in the module text with hover definitions.
- **Sources** page listing references, with [verified] and [unverified] tags throughout.
- Dark and light themes, responsive down to 390px wide phones, keyboard and screen-reader friendly, and it respects reduced-motion settings.

Progress, quiz scores, flashcard schedules and dossier notes are saved in your browser's `localStorage`. They stay on your device and don't sync between browsers.

---

## Folder structure

```
index.html          Home: learning path, cold open, placement check
modules/            28 module pages
library/            Deposit types, commodity one-pagers, image credits
tools.html          Gallery of all interactive tools
game.html           "What happened next?" prediction game
flashcards.html     Spaced-repetition flashcards
dossier.html        Hemi dossier writer
glossary.html       Glossary
sources.html        Sources and verification status
assets/             CSS, JavaScript (app.js, widgets.js, Chart.js) and images
```

---

## Credits and notes

- **Illustrations** are AI-generated and illustrative only. None depicts a real person or claims to be a photograph of a specific real mine. Explanatory diagrams are hand-built SVG and JavaScript.
- **Charts** use [Chart.js](https://www.chartjs.org/) (MIT licence), bundled locally.
- **Fonts** load from Google Fonts. Offline, the site falls back to system fonts.
- Case studies include De Grey/Hemi, Northern Star, Chalice, PLS (formerly Pilbara Minerals), Liontown, Bellevue Gold, Paladin, Lynas, Ivanhoe (Kamoa-Kakula), Sandfire, BHP/OZ Minerals, Newmont/Newcrest, Barrick, Whitehaven, Cobre Panamá and Bre-X.

## Disclaimer

For education only. Nothing here is a recommendation to buy or sell any security. Do your own research and consider professional advice before investing.
