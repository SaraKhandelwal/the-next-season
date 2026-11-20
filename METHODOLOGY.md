# Sources and methodology

**Research cut:** November 19, 2026. Independent public research. No PSE or Fever transaction, inventory, customer, margin or SKU-level information is used.

## Observed measurements

The `data/attention.json` file contains monthly English Wikipedia article pageviews for `Indiana_Fever`, `Indiana_Pacers`, and `Women's_National_Basketball_Association`, from January 2023 through August 2026. The data was retained from the prior The Next Season research dataset. The March 2024 figure (18,664) and April 2024 figure (146,680) were independently cross-checked against the Wikimedia API on November 19, 2026. **The remaining historical rows have not each been independently rechecked in this build.** To reproduce and check the full series, run `python scripts/refresh_wikimedia.py` with network access. The refresh script retrieves directly from Wikimedia and replaces the cache only after validating the returned data.

Wikimedia data definition: `en.wikipedia`, `all-access`, `user`, `monthly`. Numbers are views of an encyclopedia article, not unique people, fans, shoppers, units sold, search popularity, order conversion or team-store revenue. English-only coverage is not representative of all international audiences. Wikipedia redirects and changes in page organization can alter interpretation. Two compared article series can be plotted on the same monthly-views axis, but relative volume does not represent audience overlap.

Wikimedia API sources:

- https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Indiana_Fever/monthly/2023010100/2026080100
- https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Indiana_Pacers/monthly/2023010100/2026080100
- https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Women%27s_National_Basketball_Association/monthly/2023010100/2026080100

## Published Fever merchandise growth

In an August 14, 2024 release, the Indiana Fever reported **694% more Team Store items sold year over year** and **over 1,000% growth in Team Store net sales** so far in the season. These are published aggregate comparisons for the same team and are not total revenue or item counts; the exact base year totals and channel mix are not disclosed. Do not infer a relationship with Wikimedia views from two reported numbers.

Source: https://fever.wnba.com/news/so-far-this-season-fans-are-engaging-with-the-indiana-fever-in-record-numbers

## Decision replay

The interactive cutoffs January, February, or March 2024 are all before the April 15, 2024 WNBA draft. April is intentionally **not** offered as a before-draft decision month. At a cutoff, subsequent observations are hidden. The chart vertical scale is derived only from the months visible at that cutoff, avoiding a common form of look-ahead leakage. When the outcome is revealed, the chart displays actual post-cutoff observations and rescales.

**Finding:** March 2024 Fever pageviews were 18,664; April was 146,680, approximately 7.9x March. That is evidence that the *magnitude* of the increase was not reflected in the March pageview count alone. It does not prove there were no other early warning signals, that merchandisers could not have prepared, or that the increase was caused solely by the draft.

The replay is a historical observation exercise, not a backtested demand forecasting model. The tool does not claim predictive accuracy, estimate merchandise sell-through, or recommend buy quantities.

## Signals to watch

All three cards are based on verified source announcements:

1. WNBA 50-game season beginning 2027, up from 44 in 2026: https://www.wnba.com/news/wnba-expands-to-50-game-regular-season
2. Cleveland WNBA franchise begins play in 2028: https://www.wnba.com/news/board-of-governors-approve-wnba-expansion-teams
3. 2028 Women's Final Four: Indianapolis, Lucas Oil Stadium, March 31 and April 2: https://www.ncaa.com/womens-final-four/future-info

The associated merchant questions are analyst hypotheses, not measured results or merchandise recommendations. NCAA marks are subject to rights restrictions, and the NCAA event is held at Lucas Oil Stadium rather than Gainbridge Fieldhouse. The site makes no assertion that PSE may produce NCAA-branded merchandise.

## What is not in the product

There are no fake Fever sales, synthesized margins, artificial inventory conditions, speculative probability scores, pretend sentiment measurements, or merchandise price forecasts. There is no live Google Trends or social-media feed. This version does not claim ongoing surveillance or automatic updates. A user can download the displayed historical data and signals as CSV. It does not request or transmit visitor input.

## Reproducing data

`python scripts/refresh_wikimedia.py` refreshes pageviews from the Wikimedia REST endpoint using the public API; it requires internet access. Source announcements should be manually reviewed and updated separately. The static website reads only local JSON files and works on GitHub Pages or any static host.

## Pacers 2025 replay

The Pacers English Wikipedia article recorded 48,390 views in April 2025, 303,980 in May 2025, and 458,587 in June 2025 in the bundled Wikimedia dataset. The date of the NBA Finals run is established by the NBA playoff record at https://www.nba.com/news/2025-nba-playoffs-schedule. March and April are pre-surge decision cutoffs in this monthly series; May already includes an unfolding playoff surge, and should not be described as a pre-event forecast. These observations cannot quantify merchandise demand, SKU sell-through, lost sales, or the commercial value of a more flexible inventory strategy.
