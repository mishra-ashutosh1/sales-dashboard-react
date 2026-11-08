# Olist React Dashboard POC

Rebuilt from eight user-supplied Olist CSV files. This version uses precomputed aggregates, not live CSV fetching. Only aggregate figures are included in the new summary.

## Run

Extract into a clean directory (do not nest one project copy inside another). Node.js 20 LTS or newer recommended.

```sh
npm install
npm run build
npm run dev
```

Open the URL printed by Vite. For production preview use `npm run preview` after building. The project does not need an API key or Python at runtime.

## Dashboard

Four KPIs: delivered-order item sales in BRL, delivered items, delivered orders, average latest order-review score. Six bar-chart panels: monthly item sales, customer states, categories, all-order status, review scores and payments. Light/dark theme, category search, top-N and monthly-year controls. Controls affect only explicitly labelled charts; KPI cards remain full-dataset totals.

## Data definitions

- Item sales = sum of item price for delivered orders; excludes freight.
- Items = order-item rows for delivered orders, not distinct orders.
- Ratings = latest review per delivered order, sorted by creation date, answer timestamp and review ID.
- Order status includes all 99,441 orders.
- Payments are delivered-order payment records and may include freight or adjustments. They do not reconcile directly to item sales.
- Reviews and payments were aggregated separately from item sales to avoid join multiplication.
- Category translations are used where available; original names or unknown are retained otherwise.
- Inventory is not present. No inventory or product-level rating figures are invented. Score distribution is not NLP sentiment.

Computed checks: 96,478 delivered orders; 110,197 delivered items; BRL 13,221,498.11 item sales; 95,832 delivered orders with a latest review.

## Files

`src/App.jsx` is the new entry component; `src/olist.css` is its styling; `src/data/olistSummary.json` contains computed aggregates. Legacy components and the old JSON are retained but are not used by the new App. Original CSVs uploaded to `dummy_data` are not automatically ingested by this version. To refresh, regenerate the summary from the source data.

## Attribution

Source: Brazilian E-Commerce Public Dataset by Olist, https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce . Original dataset creators retain their rights. Review and comply with the dataset's current license before redistribution or commercial use. No customer-level records or review text are added by this rebuild.

## Validation limits

The source data was processed with pandas and join cardinalities checked. The npm build and browser interaction have not been executed in the assistant environment; run the commands above locally. This is a static analytics POC, not a production data pipeline.
