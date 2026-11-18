# Titan

Titan is a responsive, demo-only personal finance interface built with **vanilla JavaScript, HTML, and CSS**. Vite is used only as the development server and production build tool.

## Stack

- Vanilla JavaScript (ES modules)
- HTML
- CSS
- Vite

No React, TypeScript, component framework, icon package, or runtime UI dependency.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Demo behavior

- Overview combines sample cash and digital-asset values.
- Wallet shows illustrative holdings and a calculated allocation.
- Activity supports search, type filters, sorting, and transaction details.
- Cards provides a visual-only card preview and local freeze-state interaction.
- Add-funds and send flows update demo cash and transaction history in local browser storage.
- Reset demo data restores the original sample dataset.

All values and transactions are fictional sample data. No bank, payment processor, card issuer, exchange, or blockchain is connected. Do not send real funds or assets to the sample address shown in the receive preview.

## Data

Demo cash and transaction history are stored in `localStorage` under `titan-demo-v2`. Asset holdings are fixed illustrative data in `src/main.js`. Clearing browser storage or using Reset demo data restores the sample state.
