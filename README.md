# Olist React Dashboard POC — interactive upgrade

## Run and verify

Use Node.js 20+. Extract into a fresh folder containing package.json, not inside an existing project copy.

```sh
npm install
npm test
npm run build
npm run dev
```

## Two explicit data modes

The bundled historical summary renders immediately. It cannot support global date/state filters, so those controls are disabled in bundled mode. The year control affects only the monthly chart.

For detailed mode, expand Load CSVs and select these five files together: olist_customers_dataset.csv, olist_orders_dataset.csv, olist_order_items_dataset.csv, olist_order_reviews_dataset.csv, olist_products_dataset.csv. Optionally include olist_order_payments_dataset.csv and product_category_name_translation.csv. Existing seller data is not needed for these measures. The browser reads the files locally; no upload endpoint exists. Large files may briefly block the UI. Reloading the page clears this in-memory model. Raw files are not added to GitHub by this upgrade.

In detailed mode, inclusive purchase-date boundaries and customer state filter every KPI and chart consistently. Category search and top-N remain local controls. Missing payments are labelled unavailable, not zero. Review scores remain order-level, not product-level. Export downloads the full selected cohort summary; it ignores local category search, top-N and bundled monthly-year controls. It contains no customer IDs, order IDs or review text.

## Measures and caveats

Sales: delivered-order item prices, freight excluded. AOV: these sales divided by delivered orders. Status: all orders in the selected purchase cohort, with a separate chart for non-delivered statuses. Review: latest record sorted by creation date, answer timestamp and review ID. Review coverage: reviewed delivered orders divided by delivered orders. Payments are aggregated independently; they may include freight and are not directly comparable to item sales.

Delivery median: elapsed purchase-to-customer-delivery days for valid non-negative durations on delivered orders. On-time share: valid delivered orders received by the estimated calendar date, divided by eligible delivered orders; missing/invalid dates are excluded. Timestamp durations assume the supplied timestamps share one consistent clock. No inventory or NLP sentiment is invented. This historical snapshot must not be presented as a live operational backlog.

The monthly chart shows zero for interior missing months; edge months may be partial. No previous-period or year-on-year comparisons are implemented. Detailed data is not persisted, automatically fetched or cross-filtered by clicking charts. Loading and analytics currently run on the main browser thread; a Web Worker is a future performance improvement.

## Reproducible preparation

Place the five required files and optional payments/translations in a local folder, then run:

```sh
npm run prepare:data -- ./dummy_data
```

This validates CSV structure and join keys and writes generated/olist-summary.json. It does NOT overwrite the bundled summary. The same analytics module powers browser loading, preparation and tests. The GitHub repository currently needs additional CSVs for local preparation beyond the customer file; they were supplied separately in the conversation. Avoid committing raw files without reviewing the source license.

## Quality checks

Tests cover CSV quoting, duplicate-key rejection, missing files, join inflation, date/state filtering, latest reviews, delivery eligibility, empty results and CSV export escaping. GitHub Actions runs npm test and npm run build on pushes and pull requests. A configured workflow is not evidence that a run passed; check its result in Actions. Browser UI behaviour requires manual checks or future UI automation.

## Attribution

Historical data: Brazilian E-Commerce Public Dataset by Olist, https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce . Review its license and attribution requirements before redistribution or commercial use. The new code does not upload customer data. Legacy components and JSON are retained but the new entry component uses analytics.mjs, olist.css and upgrade.css.
