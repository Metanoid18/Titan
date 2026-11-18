# Titan

Titan is a responsive, demo-only wallet interface built with **vanilla JavaScript, HTML, and CSS**. Vite is used only for local development and production builds.

## Stack

- Vanilla JavaScript (ES modules)
- HTML and CSS
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

## Included screens

- **Overview:** demo cash balance, essential actions, sample asset quantities, and recent activity.
- **Activity:** searchable, filterable, sortable sample transaction history.
- **Wallet:** sample asset quantities and network labels, without fabricated market prices.

## Demo limitations

Titan is a front-end prototype. It is not connected to a bank, payment provider, card issuer, exchange, wallet, or blockchain.

- Send and Add funds only adjust the local demo cash balance and transaction list.
- Receive explains that a real wallet connection is not available. No sample deposit address is provided.
- Asset quantities and transaction records are fictional.
- No live prices, portfolio valuations, or real transfers are represented.

Demo cash and transaction history are stored in `localStorage` under `titan-demo-v3`. Use **Demo settings → Reset sample data** to restore the original dataset.
