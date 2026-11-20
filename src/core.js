const hasText = value => typeof value === 'string' && value.trim().length > 0;
const finiteNonnegative = value => Number.isFinite(Number(value)) && Number(value) >= 0;
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const fallbackCopy = value => JSON.parse(JSON.stringify(value));

const currencyFormatters = new Map();
export function formatMoney(value, currency = 'USD', locale = 'en-US') {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  const key = `${locale}:${currency}`;
  if (!currencyFormatters.has(key)) currencyFormatters.set(key, new Intl.NumberFormat(locale, { style: 'currency', currency }));
  return currencyFormatters.get(key).format(amount);
}

function formatDatePart(value, options) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
export const formatDate = value => formatDatePart(value, { month: 'short', day: 'numeric', year: 'numeric' });
export const formatTime = value => formatDatePart(value, { hour: 'numeric', minute: '2-digit' });

export function calculateTotals(accounts = [], transactions = []) {
  const cash = accounts.reduce((sum, account) => sum + (Number(account.balance) || 0), 0);
  const income = transactions.filter(item => item.type === 'income').reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const spending = transactions.filter(item => item.type === 'expense').reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  return { cash, income, spending, net: income - spending };
}

export function filterAndSortTransactions(transactions = [], { filter = 'all', search = '', sort = 'newest' } = {}) {
  const query = String(search).trim().toLocaleLowerCase();
  return transactions.filter(item => {
    const matchesType = filter === 'all' || item.type === filter;
    const searchable = [item.name, item.detail, item.category, item.method, item.account].join(' ').toLocaleLowerCase();
    return matchesType && (!query || searchable.includes(query));
  }).slice().sort((a, b) => {
    const aTime = Date.parse(a.date), bTime = Date.parse(b.date);
    return sort === 'oldest' ? aTime - bTime : bTime - aTime;
  });
}

function cleanAccounts(rows, changed) {
  if (!Array.isArray(rows)) { changed.value = true; return null; }
  return rows.filter(row => {
    const valid = isRecord(row) && hasText(row.id) && hasText(row.name) && hasText(row.type) && finiteNonnegative(row.balance);
    if (!valid) changed.value = true;
    return valid;
  }).map(row => ({
    id: row.id.trim(), name: row.name.trim(), type: row.type.trim(),
    number: hasText(row.number) ? row.number.trim() : '••••', balance: Number(row.balance),
    currency: hasText(row.currency) ? row.currency.trim() : 'USD',
    color: ['gold', 'silver', 'dark'].includes(row.color) ? row.color : 'gold'
  }));
}
function cleanAssets(rows, changed) {
  if (!Array.isArray(rows)) { changed.value = true; return null; }
  return rows.filter(row => {
    const valid = isRecord(row) && hasText(row.id) && hasText(row.name) && hasText(row.symbol) && hasText(row.network) && finiteNonnegative(row.quantity);
    if (!valid) changed.value = true;
    return valid;
  }).map(row => ({
    id: row.id.trim(), name: row.name.trim(), symbol: row.symbol.trim(), quantity: Number(row.quantity),
    network: row.network.trim(), color: ['bitcoin', 'ethereum', 'solana'].includes(row.color) ? row.color : 'bitcoin'
  }));
}
function cleanTransactions(rows, changed) {
  if (!Array.isArray(rows)) { changed.value = true; return null; }
  return rows.filter(row => {
    const valid = isRecord(row) && hasText(row.id) && hasText(row.name) && hasText(row.date) && Number.isFinite(Date.parse(row.date)) &&
      ['income', 'expense'].includes(row.type) && finiteNonnegative(row.amount);
    if (!valid) changed.value = true;
    return valid;
  }).map(row => ({
    id: row.id.trim(), name: row.name.trim(), detail: hasText(row.detail) ? row.detail.trim() : '',
    date: new Date(row.date).toISOString(), amount: Number(row.amount), type: row.type,
    category: hasText(row.category) ? row.category.trim() : 'Other',
    account: hasText(row.account) ? row.account.trim() : 'Sample account',
    method: hasText(row.method) ? row.method.trim() : 'Sample record'
  }));
}
function cleanCards(rows, changed) {
  if (!Array.isArray(rows)) { changed.value = true; return null; }
  return rows.filter(row => {
    const valid = isRecord(row) && hasText(row.id) && hasText(row.name) && finiteNonnegative(row.limit) && finiteNonnegative(row.spent);
    if (!valid) changed.value = true;
    return valid;
  }).map(row => ({
    id: row.id.trim(), name: row.name.trim(), last4: hasText(row.last4) ? row.last4.trim().slice(-4) : '0000',
    holder: hasText(row.holder) ? row.holder.trim() : 'TITAN SAMPLE',
    status: hasText(row.status) ? row.status.trim() : 'Active',
    kind: row.kind === 'Virtual' ? 'Virtual' : 'Physical',
    limit: Number(row.limit), spent: Number(row.spent), frozen: row.frozen === true
  }));
}

export function normalizeData(raw, seed) {
  const changed = { value: false };
  if (!isRecord(raw)) return { data: fallbackCopy(seed), recovered: true };

  const profileSource = isRecord(raw.profile) ? raw.profile : {};
  const name = hasText(profileSource.name) ? profileSource.name.trim() : seed.profile.name;
  const email = hasText(profileSource.email) && profileSource.email.includes('@') ? profileSource.email.trim() : seed.profile.email;
  if (profileSource.name !== name || profileSource.email !== email || !isRecord(raw.profile)) changed.value = true;
  const initials = hasText(profileSource.initials) ? profileSource.initials.trim().slice(0, 2).toUpperCase() : name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const accounts = cleanAccounts(raw.accounts, changed) ?? fallbackCopy(seed.accounts);
  const transactions = cleanTransactions(raw.transactions, changed) ?? fallbackCopy(seed.transactions);
  const cards = cleanCards(raw.cards, changed) ?? fallbackCopy(seed.cards);
  const assets = cleanAssets(raw.assets, changed) ?? fallbackCopy(seed.assets);
  return { data: { profile: { name, email, initials: initials || 'AM' }, accounts, transactions, cards, assets }, recovered: changed.value };
}

export function modalVariant(modal) {
  if (modal === 'account') return 'account';
  if (modal === 'transfer') return 'send';
  if (modal === 'add-funds') return 'add';
  return 'details';
}
