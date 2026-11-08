# Sales Dashboard React POC

A React + Vite proof of concept that converts the original interactive HTML sales dashboard into a component-based application.

## Features

- KPI cards for revenue, units sold, average rating, and inventory
- Monthly revenue trend
- Top products with search and top-N control
- Inventory status chart
- Product ratings chart
- Light and dark theme toggle
- Responsive layout
- Placeholder states for region and sentiment data

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite, usually `http://localhost:5173`.

## Build for production

```bash
npm run build
npm run preview
```

## Next steps

- Connect the dashboard to a CSV, JSON API, or database
- Add region and sentiment data
- Add date-range filtering
- Add export-to-CSV functionality
- Add unit tests for filtering and data transformations
