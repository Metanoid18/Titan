# Titan

Titan is a front-end prototype for a unified online-banking and digital-asset workspace. It is intentionally built without a hosted backend so the product can be explored without external account setup.

## Product areas

- **Simulated authentication:** sign in, create a local profile, and sign out. Passwords are never stored. This is a browser-only UI simulation, not secure authentication.
- **Overview:** sample accounts, recent transactions, sample crypto holdings, and computed totals.
- **Accounts and cards:** sample account details, simulated internal balance adjustments, card previews, and local freeze states.
- **Crypto:** sample BTC, ETH, and SOL quantities. No market prices or wallet actions are provided.
- **Activity and analytics:** searchable, filterable, sortable sample transaction history and local category summaries.
- **Settings:** editable local profile, session controls, and sample-data reset.

## Stack and development

Vanilla JavaScript (ES modules), HTML, CSS, and Vite. No UI framework, hosted database, or runtime UI dependency.

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

Run the built-in tests with `npm test` (Node.js 20 or later).

## Demo access

- Email: `demo@titan.app`
- Password: `titan-demo`

Or create a local profile from the sign-in screen. Any valid-looking email and a password of at least six characters can create a simulated session. This does not authenticate a real identity. Passwords are not persisted.

## Prototype and privacy boundaries

Titan is not connected to a bank, payment provider, card issuer, exchange, wallet, or blockchain. All account balances, card details, asset quantities, and transactions are fictional sample data. Transfers, added funds, and card controls only update local browser data. No real financial or blockchain action can occur, and crypto holdings have no live valuation or market data.

Local storage is not secure storage. Do not enter real passwords or sensitive financial information. Titan does not require analytics, tracking, cookies, or external account integrations. Use **Settings → Reset sample data** to restore the initial dataset; signing out ends the local UI session.

The current prototype is intentionally marked `noindex` and disallows crawlers in `robots.txt`. Do not treat it as a public production banking service.
