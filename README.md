# Titan

Titan is a front-end prototype for a unified online-banking and digital-asset workspace. It is intentionally built without a hosted backend so the product can be explored without Supabase or external account setup.

## Product areas

- **Simulated authentication:** sign in, create a local profile, and sign out. Passwords are never stored. The session is a browser-only UI simulation, not secure authentication.
- **Overview:** combined cash balance, account cards, recent transactions, sample crypto holdings, and computed cash-flow totals.
- **Banking accounts:** multiple sample accounts, account details, and simulated internal transfers or balance adjustments.
- **Cards:** visual physical/virtual card previews, sample usage limits, and local freeze/unfreeze states.
- **Crypto:** sample BTC, ETH, and SOL quantities with network labels. No market prices or wallet actions are provided.
- **Activity:** searchable, filterable, sortable transaction history and transaction details.
- **Analytics:** totals and category breakdowns calculated from the local sample transaction records.
- **Settings:** editable local profile, session controls, and sample-data reset.

## Stack

- Vanilla JavaScript (ES modules)
- HTML and CSS
- Vite for development and production builds only

No React, TypeScript, component framework, hosted database, or runtime UI dependency.

## Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Build for production:

\`\`\`bash
npm run build
\`\`\`

## Demo access

- Email: \`demo@titan.app\`
- Password: \`titan-demo\`
- Or create a local profile from the sign-in screen.

Any valid-looking email and a password of at least six characters can create a simulated session. This does not authenticate a real identity. Passwords are not persisted.

## Prototype boundaries

Titan is not connected to a bank, payment provider, card issuer, exchange, wallet, or blockchain.

- All account balances, card details, asset quantities, and transactions are fictional sample data.
- Transfers and added funds only update local browser data.
- Card controls only change local sample state.
- No real payment, transfer, deposit, withdrawal, purchase, sale, or blockchain transaction can occur.
- Crypto holdings have no live valuation or market data.
- Local storage is not secure storage. Do not enter real passwords or sensitive financial information.

Use **Settings → Reset sample data** to restore the initial dataset. Signing out ends the local UI session.
