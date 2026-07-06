# NexusGear

A high-fidelity **e-commerce prototype** for a gaming & tech gear store, built for
**SEG3125 (Analysis and Design of User Interfaces) Assignment 4** at the University of Ottawa.

Hosted **separately** from my portfolio as its own site (per assignment feedback).

- **Live site:** https://nexusgear-tyler.netlify.app
- **Portfolio:** https://sensational-figolla-2b5e9f.netlify.app/
- **Author:** Tyler Le · 300401351

## Features

- **Faceted search** (category, brand, price, colour, connectivity, rating, in-stock) with live result count and removable filter chips
- **4-step checkout wizard** (Cart → Shipping → Payment → Confirmation) with a progress stepper and inline validation
- **Post-purchase survey** with star rating, quick-pick pills, and an optional comment
- Cart drawer, product quick-view with spec sheets, and real product photography

## Tech

- **React 18** (via CDN), JSX compiled in-browser by **Babel Standalone** (classic runtime, no build step)
- Custom CSS design system (dark graphite theme with a crimson accent)
- Fully static — deploys as-is on Netlify with no build command

## Structure

```
index.html   Page shell, styles, and CDN script tags
app.jsx      The entire React application (components + product data)
img/         Transparent-background product photos (freely licensed, Wikimedia Commons)
REPORT.md    Assignment report
```

> Note: because browsers block loading `app.jsx` from `file://`, view this over HTTP
> (the hosted site) rather than by double-clicking `index.html` locally.
