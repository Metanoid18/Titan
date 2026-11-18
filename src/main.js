import './styles.css';

const STORAGE_KEY = 'titan-demo-v3';

const initialData = {
  cash: 12480.50,
  transactions: [
    { id: 'tx-1', name: 'Salary deposit', detail: 'Incoming transfer', date: '2026-11-18T09:15:00', amount: 2450, type: 'income', category: 'Income', method: 'Bank transfer' },
    { id: 'tx-2', name: 'Spotify', detail: 'Subscription', date: '2026-11-18T10:42:00', amount: 10.99, type: 'expense', category: 'Entertainment', method: 'Card' },
    { id: 'tx-3', name: 'Groceries', detail: 'Whole Foods', date: '2026-11-17T18:30:00', amount: 86.42, type: 'expense', category: 'Shopping', method: 'Card' },
    { id: 'tx-4', name: 'Transfer from Alex', detail: 'Personal transfer', date: '2026-11-17T13:08:00', amount: 120, type: 'income', category: 'Transfer', method: 'Bank transfer' },
    { id: 'tx-5', name: 'Ride', detail: 'Uber', date: '2026-11-15T20:20:00', amount: 18.50, type: 'expense', category: 'Transport', method: 'Card' }
  ]
};

const assets = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', quantity: 0.0842, network: 'Bitcoin' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', quantity: 1.42, network: 'Ethereum' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', quantity: 18.5, network: 'Solana' }
];

const icons = {
  overview: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  wallet: '<rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 9V6a2 2 0 0 1 2-2h13M16 14h5"/><circle cx="16" cy="14" r=".7"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  add: '<path d="M12 5v14M5 12h14"/>',
  receive: '<path d="M12 22V4"/><path d="m5 11 7-7 7 7"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
  eyeOff: '<path d="m3 3 18 18"/><path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a15 15 0 0 1-3.1 3.6M6.2 6.3C3.5 8.1 2 12 2 12s3.5 6 10 6c1.1 0 2.1-.2 3-.5"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  reset: '<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  check: '<path d="m5 12 4 4L19 6"/>'
};

const icon = (name, size = 18) => '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[name] || '') + '</svg>';
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const quantity = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
const dateLabel = value => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
const timeLabel = value => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Number.isFinite(saved.cash) && Array.isArray(saved.transactions)) return saved;
  } catch {}
  return structuredClone(initialData);
}

const state = {
  page: 'Overview',
  data: loadData(),
  balanceVisible: true,
  filter: 'all',
  search: '',
  sort: 'newest',
  modal: null,
  selectedId: null,
  toast: '',
  mobileNav: false
};

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); }
  catch { showToast('Browser storage is unavailable'); }
}

function showToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    state.toast = '';
    render();
  }, 2300);
}

function navigationItem(page, glyph) {
  return '<button class="nav-item ' + (state.page === page ? 'is-active' : '') + '" data-page="' + page + '"' + (state.page === page ? ' aria-current="page"' : '') + '>' +
    icon(glyph, 18) + '<span>' + page + '</span></button>';
}

function shell(content) {
  return '<div class="app-shell">' +
    '<aside class="sidebar">' +
      '<a class="brand" href="#" data-action="home" aria-label="Titan home"><span class="brand-mark"><i></i></span><span>TITAN</span></a>' +
      '<div class="nav-label">Workspace</div><nav class="main-nav" aria-label="Main navigation">' +
        navigationItem('Overview', 'overview') + navigationItem('Activity', 'activity') + navigationItem('Wallet', 'wallet') +
      '</nav>' +
    '</aside>' +
    '<main class="main-area"><header class="topbar">' +
      '<div class="topbar-context"><span class="topbar-brand">TITAN</span><span class="topbar-divider">/</span><strong>' + state.page + '</strong></div>' +
      '<div class="topbar-right"><button class="account-control" data-action="account" aria-label="Open account settings">D</button></div>' +
    '</header><div class="page-content">' + content + '</div>' +
    '<footer class="page-footer"><span>Titan</span><span>Prototype interface · No external accounts or networks connected</span></footer>' +
    '</main>' +
    (state.modal ? modalMarkup() : '') +
    (state.toast ? '<div class="toast" role="status">' + icon('check', 16) + escapeHTML(state.toast) + '</div>' : '') +
  '</div>';
}

function pageHeading(eyebrow, title, description) {
  return '<div class="page-heading"><div><span class="eyebrow">' + eyebrow + '</span><h1>' + title + '</h1><p>' + description + '</p></div></div>';
}

function transactionRow(transaction) {
  const incoming = transaction.type === 'income';
  return '<button class="transaction-row" data-transaction="' + escapeHTML(transaction.id) + '">' +
    '<span class="transaction-icon ' + (incoming ? 'incoming' : 'outgoing') + '">' + icon(incoming ? 'receive' : 'send', 16) + '</span>' +
    '<span class="transaction-description"><strong>' + escapeHTML(transaction.name) + '</strong><small>' + escapeHTML(transaction.detail) + '</small></span>' +
    '<span class="transaction-date">' + dateLabel(transaction.date) + '</span>' +
    '<strong class="transaction-amount ' + (incoming ? 'incoming' : '') + '">' + (incoming ? '+' : '−') + money(transaction.amount) + '</strong>' +
    icon('chevron', 14) + '</button>';
}

function recentTransactions() {
  const items = state.data.transactions.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  return '<section class="content-section"><div class="section-title"><div><span class="eyebrow">ACCOUNT HISTORY</span><h2>Recent activity</h2></div><button class="text-action" data-page="Activity">View all ' + icon('chevron', 14) + '</button></div>' +
    '<div class="transaction-list">' + (items.length ? items.map(transactionRow).join('') : emptyState('No transactions yet', 'Your activity will appear here.')) + '</div></section>';
}

function assetRow(asset) {
  const glyph = asset.id === 'btc' ? '₿' : asset.id === 'eth' ? '◆' : '◎';
  return '<button class="asset-row" data-asset="' + asset.id + '">' +
    '<span class="asset-symbol ' + asset.id + '">' + glyph + '</span>' +
    '<span class="asset-description"><strong>' + asset.name + '</strong><small>' + asset.symbol + ' · ' + asset.network + '</small></span>' +
    '<span class="asset-quantity"><strong>' + quantity(asset.quantity) + '</strong><small>' + asset.symbol + '</small></span>' +
    icon('chevron', 14) + '</button>';
}

function overviewPage() {
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  return pageHeading(today.toUpperCase(), 'Overview', 'Your cash and digital assets, in one place.') +
    '<section class="balance-panel">' +
      '<div class="balance-top"><span class="balance-label">CASH BALANCE</span><button class="visibility-control" data-action="toggle-balance" aria-label="' + (state.balanceVisible ? 'Hide balance' : 'Show balance') + '">' + icon(state.balanceVisible ? 'eye' : 'eyeOff', 17) + '</button></div>' +
      '<div class="balance-value">' + (state.balanceVisible ? money(state.data.cash) : '••••••••') + '</div>' +
      '<div class="balance-caption">USD balance</div>' +
      '<div class="balance-actions"><button class="action-primary" data-action="send">' + icon('send', 16) + 'Send</button><button data-action="add">' + icon('add', 17) + 'Add funds</button></div>' +
    '</section>' +
    '<div class="overview-grid"><section class="content-section assets-section"><div class="section-title"><div><span class="eyebrow">YOUR ASSETS</span><h2>Digital assets</h2></div><button class="text-action" data-page="Wallet">View wallet ' + icon('chevron', 14) + '</button></div>' +
      '<div class="asset-list">' + assets.map(assetRow).join('') + '</div><p class="section-footnote">Quantities are illustrative. No wallet is connected and no live prices are shown.</p></section>' +
      '<section class="content-section recent-section"><div class="section-title"><div><span class="eyebrow">LATEST</span><h2>Recent activity</h2></div><button class="text-action" data-page="Activity">All activity ' + icon('chevron', 14) + '</button></div>' +
      '<div class="transaction-list">' + (state.data.transactions.length ? state.data.transactions.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4).map(transactionRow).join('') : emptyState('No transactions yet','Your activity will appear here.')) + '</div></section></div>';
}

function walletPage() {
  return pageHeading('DIGITAL ASSETS', 'Wallet', 'Your asset balances and network information.') +
    '<section class="content-section wallet-content"><div class="section-title"><div><span class="eyebrow">YOUR HOLDINGS</span><h2>Assets</h2></div><span class="subtle-meta">3 assets</span></div>' +
      '<div class="asset-list wallet-asset-list">' + assets.map(assetRow).join('') + '</div>' +
      '<div class="wallet-disclaimer"><span>' + icon('lock', 16) + '</span><p>These are illustrative quantities only. Titan is not connected to a wallet, exchange, or blockchain. Balances and transfers are not real.</p></div></section>';
}

function filteredTransactions() {
  let items = state.data.transactions.slice();
  if (state.filter !== 'all') items = items.filter(item => item.type === state.filter);
  if (state.search.trim()) {
    const term = state.search.trim().toLowerCase();
    items = items.filter(item => (item.name + ' ' + item.detail + ' ' + item.category).toLowerCase().includes(term));
  }
  items.sort((a,b) => state.sort === 'oldest' ? new Date(a.date)-new Date(b.date) : new Date(b.date)-new Date(a.date));
  return items;
}

function activityPage() {
  const items = filteredTransactions();
  return pageHeading('ACCOUNT HISTORY', 'Activity', 'A record of your account activity.') +
    '<section class="content-section activity-content"><div class="activity-toolbar">' +
      '<div class="filter-group" role="group" aria-label="Filter transactions">' +
        [['all','All'],['income','Incoming'],['expense','Outgoing']].map(([value,label]) => '<button class="' + (state.filter === value ? 'selected' : '') + '" data-filter="' + value + '">' + label + '</button>').join('') +
      '</div>' +
      '<label class="search-box">' + icon('search', 16) + '<input id="activity-search" type="search" placeholder="Search activity" value="' + escapeHTML(state.search) + '" aria-label="Search transactions"></label>' +
      '<select id="activity-sort" aria-label="Sort transactions"><option value="newest" ' + (state.sort === 'newest' ? 'selected' : '') + '>Newest first</option><option value="oldest" ' + (state.sort === 'oldest' ? 'selected' : '') + '>Oldest first</option></select>' +
    '</div><div class="transaction-list full-list">' + (items.length ? items.map(transactionRow).join('') : emptyState('No matching transactions','Try a different search or filter.')) + '</div>' +
    '<div class="list-footer" id="activity-count">Showing ' + items.length + ' of ' + state.data.transactions.length + ' transactions</div></section>';
}

function emptyState(title, description) {
  return '<div class="empty-state"><strong>' + title + '</strong><p>' + description + '</p></div>';
}

function modalMarkup() {
  const close = '<button class="modal-close glass-control" data-action="close-modal" aria-label="Close">' + icon('close', 17) + '</button>';
  let content = '';
  let title = '';

  if (state.modal === 'send' || state.modal === 'add') {
    const sending = state.modal === 'send';
    title = sending ? 'Send funds' : 'Add funds';
    content = '<p class="modal-description">' + (sending ? 'Record a simulated transfer from this prototype balance.' : 'Adjust the prototype balance stored in this browser.') + '</p>' +
      (sending ? '<label class="field-label" for="recipient">Recipient label</label><input class="form-input" id="recipient" maxlength="40" placeholder="Enter a recipient">' : '') +
      '<label class="field-label" for="amount">Amount (USD)</label><div class="amount-input"><span>$</span><input id="amount" type="number" min="0.01" max="' + (sending ? state.data.cash : 1000000) + '" step="0.01" placeholder="0.00" inputmode="decimal"></div>' +
      (sending ? '<div class="available-balance"><span>Available balance</span><strong>' + money(state.data.cash) + '</strong></div>' : '') +
      '<p class="modal-notice">' + icon('lock', 15) + ' Demo only. No payment or transfer will take place.</p>' +
      '<button class="modal-submit" data-action="confirm-' + state.modal + '">' + (sending ? 'Review transfer' : 'Add funds') + '</button>';
  } else if (state.modal === 'receive') {
    title = 'Receive';
    content = '<p class="modal-description">A receive address is unavailable because no wallet or blockchain connection is configured.</p><div class="receive-empty">' + icon('wallet', 24) + '<strong>No wallet connected</strong><span>Connect a supported wallet in a future version to receive digital assets.</span></div>';
  } else if (state.modal === 'account') {
    title = 'Account settings';
    content = '<div class="settings-line"><span>Environment</span><strong>Prototype</strong></div><div class="settings-line"><span>Storage</span><strong>This browser</strong></div><div class="settings-line"><span>External connections</span><strong>None</strong></div><button class="reset-button" data-action="reset-demo">' + icon('reset', 15) + 'Reset sample data</button>';
  } else if (state.modal === 'asset') {
    const asset = assets.find(item => item.id === state.selectedId);
    if (asset) {
      title = asset.name;
      content = '<div class="asset-modal-head"><span class="asset-symbol ' + asset.id + '">' + (asset.id === 'btc' ? '₿' : asset.id === 'eth' ? '◆' : '◎') + '</span><div><strong>' + asset.name + '</strong><small>' + asset.symbol + '</small></div></div>' +
        '<div class="asset-modal-quantity"><span>Quantity</span><strong>' + quantity(asset.quantity) + ' ' + asset.symbol + '</strong></div>' +
        '<div class="settings-line"><span>Network</span><strong>' + asset.network + '</strong></div><p class="modal-notice">' + icon('lock', 15) + ' Illustrative holding. No wallet is connected.</p>';
    }
  } else if (state.modal === 'transaction') {
    const transaction = state.data.transactions.find(item => item.id === state.selectedId);
    if (transaction) {
      title = 'Transaction details';
      content = '<div class="transaction-modal-amount ' + transaction.type + '">' + (transaction.type === 'income' ? '+' : '−') + money(transaction.amount) + '</div>' +
        '<div class="settings-line"><span>Description</span><strong>' + escapeHTML(transaction.name) + '</strong></div>' +
        '<div class="settings-line"><span>Category</span><strong>' + escapeHTML(transaction.category) + '</strong></div>' +
        '<div class="settings-line"><span>Date</span><strong>' + dateLabel(transaction.date) + ' · ' + timeLabel(transaction.date) + '</strong></div>' +
        '<div class="settings-line"><span>Method</span><strong>' + escapeHTML(transaction.method) + '</strong></div>' +
        '<p class="modal-notice">' + icon('lock', 15) + ' Sample record. No money moved.</p>';
    }
  }

  const kind = state.modal || 'detail';
  const context = kind === 'account' ? 'PREFERENCES' : kind === 'send' || kind === 'add' ? 'LOCAL PROTOTYPE' : 'DETAILS';
  return '<div class="modal-backdrop" data-modal-kind="' + kind + '" data-action="backdrop-close"><section class="modal-panel" data-modal-panel role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="sheet-grabber" aria-hidden="true"></div><div class="modal-topline"><span class="eyebrow">' + context + '</span>' + close + '</div><h2 id="modal-title">' + title + '</h2>' + content + '</section></div>';
}

function openModal(name, id = null) {
  state.modal = name;
  state.selectedId = id;
  render();
  const firstField = document.querySelector('#recipient, #amount');
  if (firstField) firstField.focus();
}

function handleAction(action) {
  if (action === 'home') state.page = 'Overview';
  else if (action === 'close-modal') state.modal = null;
  else if (action === 'toggle-balance') state.balanceVisible = !state.balanceVisible;
  else if (['send','add','receive','account'].includes(action)) { openModal(action); return; }
  else if (action === 'reset-demo') {
    state.data = structuredClone(initialData);
    persist();
    state.modal = null;
    state.filter = 'all';
    state.search = '';
    state.sort = 'newest';
    showToast('Sample data reset');
    return;
  } else if (action === 'confirm-send' || action === 'confirm-add') {
    const amount = Number(document.querySelector('#amount')?.value);
    const recipient = document.querySelector('#recipient')?.value.trim();
    const sending = action === 'confirm-send';

    if (!Number.isFinite(amount) || amount < 0.01 || amount > 1000000) {
      showToast('Enter an amount from $0.01 to $1,000,000');
      return;
    }
    if (sending && !recipient) {
      showToast('Enter a recipient label');
      return;
    }
    if (sending && amount > state.data.cash) {
      showToast('Amount exceeds the available balance');
      return;
    }

    state.data.cash = sending ? state.data.cash - amount : state.data.cash + amount;
    state.data.transactions.unshift({
      id: 'tx-' + Date.now(),
      name: sending ? 'Transfer to ' + recipient : 'Funds added',
      detail: sending ? 'Prototype transfer' : 'Prototype balance adjustment',
      date: new Date().toISOString(),
      amount,
      type: sending ? 'expense' : 'income',
      category: sending ? 'Transfer' : 'Income',
      method: 'Local prototype'
    });
    persist();
    state.modal = null;
    showToast(sending ? 'Demo transfer recorded' : 'Demo funds added');
    return;
  }

  render();
}

function render() {
  const app = document.querySelector('#app');
  const page = state.page === 'Activity' ? activityPage() : state.page === 'Wallet' ? walletPage() : overviewPage();
  app.innerHTML = shell(page);
}

document.addEventListener('click', event => {
  const target = event.target.closest('[data-page],[data-action],[data-filter],[data-asset],[data-transaction]');
  if (!target) {
    if (event.target.classList.contains('modal-backdrop')) {
      state.modal = null;
      render();
    }
    return;
  }

  if (target.dataset.page) {
    state.page = target.dataset.page;
    state.mobileNav = false;
    state.filter = 'all';
    state.search = '';
    render();
    return;
  }
  if (target.dataset.filter) {
    state.filter = target.dataset.filter;
    render();
    return;
  }
  if (target.dataset.asset) {
    openModal('asset', target.dataset.asset);
    return;
  }
  if (target.dataset.transaction) {
    openModal('transaction', target.dataset.transaction);
    return;
  }
  if (target.dataset.action === 'backdrop-close') {
    if (event.target === target) {
      state.modal = null;
      render();
    }
    return;
  }
  if (target.dataset.action) {
    if (target.tagName === 'A') event.preventDefault();
    handleAction(target.dataset.action);
  }
});

document.addEventListener('input', event => {
  if (event.target.id !== 'activity-search') return;
  state.search = event.target.value;
  const list = document.querySelector('.full-list');
  const count = document.querySelector('#activity-count');
  const items = filteredTransactions();
  if (list) list.innerHTML = items.length ? items.map(transactionRow).join('') : emptyState('No matching transactions', 'Try a different search or filter.');
  if (count) count.textContent = 'Showing ' + items.length + ' of ' + state.data.transactions.length + ' transactions';
});

document.addEventListener('change', event => {
  if (event.target.id === 'activity-sort') {
    state.sort = event.target.value;
    render();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && state.modal) {
    state.modal = null;
    render();
  }
  if (event.key === 'Enter' && (state.modal === 'send' || state.modal === 'add')) {
    if (event.target.id === 'recipient') {
      event.preventDefault();
      document.querySelector('#amount')?.focus();
    } else if (event.target.id === 'amount') {
      event.preventDefault();
      handleAction(state.modal === 'send' ? 'confirm-send' : 'confirm-add');
    }
  }
});

render();
