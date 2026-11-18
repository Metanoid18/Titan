import './styles.css';

const STORE = 'titan-demo-v2';
const SESSION = 'titan-demo-session';
const seed = {
  cash: 12480.50,
  transactions: [
    { id: 1, name: 'Salary deposit', detail: 'Incoming transfer · Demo', date: '2026-11-18T09:15:00', amount: 2450, type: 'income', category: 'Income', method: 'Bank transfer' },
    { id: 2, name: 'Spotify', detail: 'Subscription · Demo', date: '2026-11-18T10:42:00', amount: 10.99, type: 'expense', category: 'Entertainment', method: 'Card' },
    { id: 3, name: 'Whole Foods', detail: 'Groceries · Demo', date: '2026-11-17T18:30:00', amount: 86.42, type: 'expense', category: 'Shopping', method: 'Card' },
    { id: 4, name: 'Transfer from Alex', detail: 'Personal transfer · Demo', date: '2026-11-17T13:08:00', amount: 120, type: 'income', category: 'Transfer', method: 'Bank transfer' },
    { id: 5, name: 'Uber', detail: 'Ride · Demo', date: '2026-11-15T20:20:00', amount: 18.50, type: 'expense', category: 'Transport', method: 'Card' },
    { id: 6, name: 'Netflix', detail: 'Subscription · Demo', date: '2026-11-14T08:10:00', amount: 15.49, type: 'expense', category: 'Entertainment', method: 'Card' },
    { id: 7, name: 'Transfer from Jordan', detail: 'Personal transfer · Demo', date: '2026-11-12T16:22:00', amount: 250, type: 'income', category: 'Transfer', method: 'Bank transfer' },
    { id: 8, name: 'Coffee House', detail: 'Food & drink · Demo', date: '2026-11-11T11:05:00', amount: 8.75, type: 'expense', category: 'Food & drink', method: 'Card' }
  ]
};
const assets = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0.0842, value: 5684.22, color: '#f0a34a', glyph: '₿', network: 'Bitcoin network' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: 1.42, value: 4821.60, color: '#8796b7', glyph: '◆', network: 'Ethereum network' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', amount: 18.5, value: 3482.75, color: '#9a8dc8', glyph: '◎', network: 'Solana network' }
];
const state = {
  page: 'Overview', mobileNav: false, modal: null, toast: '', showBalance: true,
  filter: 'all', query: '', sort: 'newest', selectedAsset: null, cardFrozen: false,
  data: loadData()
};
function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    if (saved && Number.isFinite(saved.cash) && Array.isArray(saved.transactions)) return saved;
  } catch {}
  return structuredClone(seed);
}
function persist() { localStorage.setItem(STORE, JSON.stringify(state.data)); }
const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const compactMoney = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);
const number = (n, max = 5) => new Intl.NumberFormat('en-US', { maximumFractionDigits: max }).format(n);
const totalAssets = () => assets.reduce((sum, a) => sum + a.value, 0);
const totalBalance = () => state.data.cash + totalAssets();
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const dateText = value => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
const timeText = value => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
const icon = (name, size = 18) => {
  const paths = {
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    wallet:'<rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 9V6a2 2 0 0 1 2-2h13"/><path d="M16 14h5"/><circle cx="16" cy="14" r=".7"/>',
    card:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 10h18"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.9Z"/>',
    eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
    eyeoff:'<path d="m3 3 18 18"/><path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a15 15 0 0 1-3.1 3.6M6.2 6.3C3.5 8.1 2 12 2 12s3.5 6 10 6c1.1 0 2.1-.2 3-.5"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    receive:'<path d="M12 22V4"/><path d="m5 11 7-7 7 7"/>',
    arrow:'<path d="M7 17 17 7M7 7h10v10"/>',
    down:'<path d="M7 7 17 17M17 7v10H7"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    close:'<path d="m18 6-12 12M6 6l12 12"/>',
    copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    unlock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.5-2"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    filter:'<path d="M4 6h16M7 12h10m-7 6h4"/>',
    logout:'<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>'
  };
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name] || paths.grid)+'</svg>';
};
function navItem(name, ico) {
  return '<button class="nav-item '+(state.page === name ? 'active' : '')+'" data-page="'+name+'">'+icon(ico,18)+'<span>'+name+'</span>'+(state.page === name ? '<i class="nav-active"></i>' : '')+'</button>';
}
function shell(content) {
  return '<div class="ambient ambient-a"></div><div class="ambient ambient-b"></div><div class="app-frame">'+
    '<aside class="sidebar '+(state.mobileNav ? 'open' : '')+'"><a class="brand" href="#" data-action="home"><span class="brand-symbol"><i></i></span><span>TITAN</span></a>'+
    '<div class="side-caption">YOUR SPACE</div><nav class="nav-group">'+navItem('Overview','grid')+navItem('Activity','activity')+navItem('Wallet','wallet')+navItem('Cards','card')+'</nav>'+
    '<div class="sidebar-bottom"><div class="demo-context"><span class="demo-context-icon">'+icon('lock',15)+'</span><div><strong>Demo environment</strong><small>Local sample data only</small></div></div>'+
    '<button class="account-button" data-action="account"><span class="avatar">M</span><span class="account-copy"><strong>Meta Odede</strong><small>Personal account</small></span>'+icon('chevron',15)+'</button></div></aside>'+
    (state.mobileNav ? '<button class="mobile-scrim" data-action="close-nav" aria-label="Close navigation"></button>' : '')+
    '<main class="main-column"><header class="topbar"><div class="topbar-left"><button class="mobile-menu glass-control" data-action="toggle-nav" aria-label="Open navigation">'+icon('menu',19)+'</button><div class="breadcrumb"><span>Workspace</span>'+icon('chevron',13)+'<strong>'+esc(state.page)+'</strong></div></div>'+
    '<div class="topbar-right"><span class="environment-chip"><i></i> DEMO</span><button class="top-avatar glass-control" data-action="account" aria-label="Account menu">M</button></div></header>'+
    '<div class="page-wrap">'+content+'</div><footer class="footer"><span>© 2026 Titan</span><span>Demo environment · No real funds or assets</span></footer></main></div>'+
    (state.modal ? renderModal() : '')+(state.toast ? '<div class="toast">'+icon('check',16)+esc(state.toast)+'</div>' : '');
}
function pageHeader(kicker, title, description, actions = '') {
  return '<div class="page-heading"><div><span class="eyebrow">'+kicker+'</span><h1>'+title+'</h1><p>'+description+'</p></div>'+actions+'</div>';
}
function balanceCard() {
  return '<section class="balance-feature"><div class="balance-feature-top"><div><span class="eyebrow light">TOTAL ACCOUNT VALUE</span><button class="balance-visibility" data-action="toggle-balance" aria-label="Toggle balance visibility">'+icon(state.showBalance ? 'eye' : 'eyeoff',17)+'</button></div><span class="balance-live-label"><i></i> DEMO DATA</span></div>'+
  '<div class="balance-main">'+(state.showBalance ? money(totalBalance()) : '••••••••')+'</div><div class="balance-breakdown"><div><span>Cash balance</span><strong>'+(state.showBalance ? money(state.data.cash) : '••••••')+'</strong></div><div><span>Digital assets</span><strong>'+(state.showBalance ? money(totalAssets()) : '••••••')+'</strong></div></div>'+
  '<div class="balance-actions"><button data-action="send">'+icon('send',16)+'<span>Send</span></button><button data-action="add">'+icon('plus',17)+'<span>Add funds</span></button><button data-action="receive">'+icon('receive',16)+'<span>Receive</span></button></div></section>';
}
function assetRows(compact = false) {
  return assets.map(a => '<button class="asset-row '+(compact ? 'compact' : '')+'" data-asset="'+a.id+'"><span class="coin-mark" style="--coin:'+a.color+'">'+a.glyph+'</span><span class="asset-main"><strong>'+a.name+'</strong><small>'+number(a.amount)+' '+a.symbol+'</small></span><span class="asset-end"><strong>'+(state.showBalance ? money(a.value) : '••••••')+'</strong><small>'+number(a.amount,6)+' '+a.symbol+'</small></span>'+icon('chevron',15)+'</button>').join('');
}
function transactionRows(items, showMethod = false) {
  if (!items.length) return '<div class="empty-state"><span>'+icon('activity',22)+'</span><strong>No matching activity</strong><p>Try changing the filter or search term.</p></div>';
  return items.map(t => '<button class="transaction-row" data-transaction="'+t.id+'"><span class="transaction-symbol '+t.type+'">'+icon(t.type === 'income' ? 'receive' : 'send',16)+'</span><span class="transaction-main"><strong>'+esc(t.name)+'</strong><small>'+esc(t.detail)+'</small></span><span class="transaction-meta"><strong>'+esc(t.category)+'</strong><small>'+dateText(t.date)+(showMethod ? ' · '+esc(t.method) : '')+'</small></span><span class="transaction-amount '+t.type+'">'+(t.type === 'income' ? '+' : '−')+money(t.amount)+'</span>'+icon('chevron',14)+'</button>').join('');
}
function overview() {
  const items = state.data.transactions.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  const income = state.data.transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const outflow = state.data.transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const total = totalAssets();
  const alloc = assets.map(a=>({ ...a, share: a.value / total * 100 }));
  return pageHeader('WEDNESDAY, NOVEMBER 18, 2026','Your money, in focus.','A clear picture of your cash and digital assets.')+
    '<div class="overview-layout"><div class="overview-primary">'+balanceCard()+
    '<div class="quick-strip"><button data-action="send"><span class="quick-icon dark">'+icon('send',17)+'</span><span><strong>Send money</strong><small>Make a demo transfer</small></span>'+icon('chevron',14)+'</button><button data-action="add"><span class="quick-icon">'+icon('plus',18)+'</span><span><strong>Add funds</strong><small>Adjust demo cash</small></span>'+icon('chevron',14)+'</button><button data-action="receive"><span class="quick-icon">'+icon('receive',17)+'</span><span><strong>Receive</strong><small>View receive details</small></span>'+icon('chevron',14)+'</button></div>'+
    '<section class="surface-card activity-card"><div class="section-heading"><div><span class="eyebrow">LATEST MOVEMENTS</span><h2>Recent activity</h2></div><button class="subtle-link" data-page="Activity">See all activity '+icon('arrow',13)+'</button></div>'+transactionRows(items)+'</section></div>'+
    '<div class="overview-secondary"><section class="surface-card portfolio-card"><div class="section-heading"><div><span class="eyebrow">PORTFOLIO</span><h2>Digital assets</h2></div><button class="subtle-link" data-page="Wallet">View wallet '+icon('arrow',13)+'</button></div>'+
    '<div class="portfolio-total"><strong>'+(state.showBalance ? money(total) : '••••••')+'</strong><span>3 demo assets</span></div><div class="allocation-bar">'+alloc.map(a=>'<i style="width:'+a.share+'%;background:'+a.color+'"></i>').join('')+'</div>'+alloc.map(a=>'<div class="allocation-row"><span><i style="background:'+a.color+'"></i>'+a.name+'</span><strong>'+a.share.toFixed(1)+'%</strong></div>').join('')+'</section>'+
    '<section class="surface-card cashflow-card"><div class="section-heading"><div><span class="eyebrow">RECORDED ACTIVITY</span><h2>Cash movement</h2></div><span class="period-label">All sample entries</span></div><div class="cashflow-line"><div><small>Money in</small><strong class="positive">'+money(income)+'</strong></div><div><small>Money out</small><strong>'+money(outflow)+'</strong></div></div><p>Totals are calculated from the sample transactions currently stored in this browser.</p><button class="subtle-link" data-page="Activity">Review transactions '+icon('arrow',13)+'</button></section></div></div>';
}
function walletPage() {
  const total = totalAssets();
  return pageHeader('ASSET OVERVIEW','Your wallet','Review the demo assets held in your portfolio.','<button class="primary-button" data-action="receive">'+icon('receive',15)+' Receive</button>')+
  '<section class="wallet-summary"><div><span class="eyebrow light">TOTAL DIGITAL ASSETS</span><strong>'+(state.showBalance ? money(total) : '••••••')+'</strong><small>3 illustrative holdings · USD values</small></div><button class="glass-control" data-action="toggle-balance">'+icon(state.showBalance?'eye':'eyeoff',17)+'</button></section>'+
  '<div class="wallet-layout"><section class="surface-card wallet-list-card"><div class="section-heading"><div><span class="eyebrow">YOUR HOLDINGS</span><h2>Assets</h2></div><span class="count-label">03 ASSETS</span></div>'+assetRows()+'</section>'+
  '<aside class="surface-card wallet-info"><span class="eyebrow">PORTFOLIO MIX</span><h2>Allocation</h2><div class="donut-wrap"><div class="donut" style="--a:'+(assets[0].value/total*100)+'%;--b:'+(assets[0].value/total*100+assets[1].value/total*100)+'%"><div><strong>'+(state.showBalance?money(total):'••••••')+'</strong><small>Total value</small></div></div></div>'+
  assets.map(a=>'<div class="allocation-row"><span><i style="background:'+a.color+'"></i>'+a.name+'</span><strong>'+(a.value/total*100).toFixed(1)+'%</strong></div>').join('')+
  '<p class="fine-print">All asset quantities and valuations are illustrative. No wallet is connected.</p></aside></div>';
}
function activityPage() {
  let items = state.data.transactions.slice();
  if (state.filter !== 'all') items = items.filter(t=>t.type===state.filter);
  if (state.query.trim()) items = items.filter(t=>(t.name+' '+t.detail+' '+t.category).toLowerCase().includes(state.query.toLowerCase()));
  items.sort((a,b)=>state.sort==='oldest'?new Date(a.date)-new Date(b.date):new Date(b.date)-new Date(a.date));
  const income = state.data.transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const outflow = state.data.transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  return pageHeader('ACCOUNT HISTORY','Activity','Every recorded movement in your demo account.')+
  '<div class="activity-stats"><div class="surface-card"><span>Total incoming</span><strong class="positive">'+money(income)+'</strong></div><div class="surface-card"><span>Total outgoing</span><strong>'+money(outflow)+'</strong></div><div class="surface-card"><span>Transactions</span><strong>'+state.data.transactions.length+'</strong></div></div>'+
  '<section class="surface-card full-activity"><div class="activity-tools"><div class="filter-tabs">'+[['all','All'],['income','Incoming'],['expense','Outgoing']].map(([v,l])=>'<button class="'+(state.filter===v?'selected':'')+'" data-filter="'+v+'">'+l+'</button>').join('')+'</div>'+
  '<label class="search-field">'+icon('search',16)+'<input type="search" id="activity-search" placeholder="Search activity" value="'+esc(state.query)+'"></label><select id="activity-sort" aria-label="Sort transactions"><option value="newest" '+(state.sort==='newest'?'selected':'')+'>Newest first</option><option value="oldest" '+(state.sort==='oldest'?'selected':'')+'>Oldest first</option></select></div>'+
  '<div class="table-head"><span>TRANSACTION</span><span>CATEGORY</span><span>DATE</span><span>AMOUNT</span></div><div class="full-transaction-list">'+transactionRows(items,true)+'</div><div class="table-foot">Showing '+items.length+' of '+state.data.transactions.length+' sample transactions</div></section>';
}
function cardsPage() {
  return pageHeader('PAYMENT METHODS','Cards','A visual preview of how a Titan payment card could appear.','<button class="outline-button" data-action="card-info">'+icon('settings',15)+' Card details</button>')+
  '<div class="cards-layout"><div class="card-stage"><div class="physical-card '+(state.cardFrozen?'frozen':'')+'"><div class="physical-card-glow"></div><div class="physical-card-top"><span class="card-brand"><i></i>TITAN</span><span class="card-type">DEBIT · DEMO</span></div><div class="chip"><i></i><i></i><i></i><i></i></div><div class="card-number">•••• &nbsp; •••• &nbsp; •••• &nbsp; 2048</div><div class="physical-card-bottom"><div><small>CARDHOLDER</small><strong>META ODEDE</strong></div><div><small>EXPIRES</small><strong>•• / ••</strong></div><span class="card-network">VISA</span></div>'+(state.cardFrozen?'<div class="frozen-overlay">'+icon('lock',22)+'<strong>Card frozen</strong><small>Demo state only</small></div>':'')+'</div><p class="card-caption">Illustrative card · Not connected to a payment network</p></div>'+
  '<section class="surface-card card-controls"><span class="eyebrow">CARD CONTROLS</span><h2>Manage your card</h2><div class="control-row"><span class="control-icon">'+icon(state.cardFrozen?'lock':'unlock',17)+'</span><span><strong>'+(state.cardFrozen?'Card is frozen':'Card is active')+'</strong><small>'+(state.cardFrozen?'Demo purchases are marked as paused.':'The sample card is shown as active.')+'</small></span><button class="toggle '+(state.cardFrozen?'on':'')+'" data-action="freeze" role="switch" aria-checked="'+state.cardFrozen+'"><i></i></button></div><div class="control-row"><span class="control-icon">'+icon('eye',17)+'</span><span><strong>Card number</strong><small>Only the final four digits are shown.</small></span><span class="control-value">•••• 2048</span></div><div class="control-row"><span class="control-icon">'+icon('lock',17)+'</span><span><strong>Online payments</strong><small>Not connected in this demo.</small></span><span class="status-muted">Unavailable</span></div><p class="fine-print">This screen is a product preview. No card can be issued, charged, or used for payments.</p></section></div>';
}
function renderPage() {
  const page = state.page === 'Overview' ? overview() : state.page === 'Wallet' ? walletPage() : state.page === 'Activity' ? activityPage() : cardsPage();
  document.querySelector('#app').innerHTML = shell(page);
}
function renderModal() {
  const m = state.modal;
  const close = '<button class="modal-close glass-control" data-action="close-modal" aria-label="Close">'+icon('close',17)+'</button>';
  let body = '';
  if (m === 'send' || m === 'add') {
    body = '<p class="modal-copy">'+(m==='send'?'Create a simulated transfer from your demo cash balance.':'Add sample funds to your local demo balance.')+'</p>'+
    (m==='send'?'<label class="field-label" for="recipient">Recipient label</label><input class="form-input" id="recipient" placeholder="e.g. Alex Morgan" maxlength="40">':'')+
    '<label class="field-label" for="amount">Amount in USD</label><div class="amount-field"><span>$</span><input id="amount" type="number" min="0.01" max="'+(m==='send'?state.data.cash:1000000)+'" step="0.01" placeholder="0.00" inputmode="decimal"></div>'+
    (m==='send'?'<div class="available-line"><span>Available demo cash</span><strong>'+money(state.data.cash)+'</strong></div>':'')+
    '<div class="notice">'+icon('lock',15)+' This only updates sample data stored in this browser.</div><button class="primary-button modal-submit" data-action="confirm-'+m+'">'+(m==='send'?'Review demo transfer':'Add demo funds')+icon('arrow',15)+'</button>';
  } else if (m === 'receive') {
    body = '<p class="modal-copy">This is a sample receive screen. Titan is not connected to a blockchain or payment provider.</p><div class="receive-network"><span class="coin-mark" style="--coin:#8796b7">◆</span><span><strong>Ethereum</strong><small>Sample network</small></span><span class="network-tag">DEMO</span></div><div class="sample-address"><span>Sample address</span><strong>0x71C7...d8976F</strong><button data-action="copy-address" aria-label="Copy sample address">'+icon('copy',16)+'</button></div><div class="notice warning">'+icon('lock',15)+' Never send real assets to this sample address.</div>';
  } else if (m === 'account') {
    body = '<div class="account-profile"><span class="avatar large">M</span><div><strong>Meta Odede</strong><small>Personal demo account</small></div></div><div class="settings-row"><span>Account mode</span><strong>Demo only</strong></div><div class="settings-row"><span>Data storage</span><strong>This browser</strong></div><div class="settings-row"><span>External connections</span><strong>None</strong></div><button class="outline-button modal-submit" data-action="reset-demo">Reset demo data</button>';
  } else if (m === 'asset') {
    const a = assets.find(x=>x.id===state.selectedAsset) || assets[0];
    body = '<div class="asset-detail-head"><span class="coin-mark large-coin" style="--coin:'+a.color+'">'+a.glyph+'</span><div><strong>'+a.name+'</strong><small>'+a.symbol+' · '+a.network+'</small></div></div><div class="asset-detail-value">'+(state.showBalance?money(a.value):'••••••')+'</div><div class="settings-row"><span>Quantity held</span><strong>'+number(a.amount,6)+' '+a.symbol+'</strong></div><div class="settings-row"><span>Illustrative value</span><strong>'+money(a.value)+'</strong></div><div class="notice">'+icon('lock',15)+' Sample asset data. No wallet is connected.</div>';
  } else if (m === 'transaction') {
    const t = state.data.transactions.find(x=>x.id===state.selectedAsset);
    if (t) body = '<div class="transaction-detail-amount '+t.type+'">'+(t.type==='income'?'+':'−')+money(t.amount)+'</div><div class="settings-row"><span>Transaction</span><strong>'+esc(t.name)+'</strong></div><div class="settings-row"><span>Category</span><strong>'+esc(t.category)+'</strong></div><div class="settings-row"><span>Date</span><strong>'+dateText(t.date)+' · '+timeText(t.date)+'</strong></div><div class="settings-row"><span>Method</span><strong>'+esc(t.method)+'</strong></div><div class="notice">'+icon('lock',15)+' Sample transaction. No money moved.</div>';
  } else if (m === 'card-info') {
    body = '<p class="modal-copy">This is a visual card preview only. There is no issuer, account number, expiry date, or payment network connection behind it.</p><div class="settings-row"><span>Card type</span><strong>Virtual debit · Preview</strong></div><div class="settings-row"><span>Last four digits</span><strong>2048</strong></div><div class="settings-row"><span>Payment processing</span><strong>Not available</strong></div>';
  }
  return '<div class="modal-layer" data-action="backdrop-close"><section class="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-top"><span class="modal-kicker">TITAN · DEMO</span>'+close+'</div><h2 id="modal-title">'+({send:'Send money',add:'Add funds',receive:'Receive',account:'Account settings',asset:'Asset details',transaction:'Transaction details','card-info':'Card information'}[m]||'Details')+'</h2>'+body+'</section></div>';
}
function openModal(name) { state.modal = name; renderPage(); }
function notify(message) {
  state.toast = message; renderPage();
  clearTimeout(notify.timer);
  notify.timer = setTimeout(()=>{state.toast='';renderPage();},2400);
}
function handleAction(action, el) {
  if (action === 'home') { state.page='Overview'; state.mobileNav=false; renderPage(); return; }
  if (action === 'toggle-nav') { state.mobileNav=!state.mobileNav; renderPage(); return; }
  if (action === 'close-nav') { state.mobileNav=false; renderPage(); return; }
  if (action === 'account') { openModal('account'); return; }
  if (action === 'close-modal') { state.modal=null; renderPage(); return; }
  if (action === 'toggle-balance') { state.showBalance=!state.showBalance; renderPage(); return; }
  if (action === 'send' || action === 'add' || action === 'receive' || action === 'card-info') { openModal(action); return; }
  if (action === 'freeze') { state.cardFrozen=!state.cardFrozen; renderPage(); return; }
  if (action === 'copy-address') { navigator.clipboard?.writeText('0x71C7656EC7ab88b098defB751B7401B5f6d8976F').then(()=>notify('Sample address copied')).catch(()=>notify('Clipboard unavailable')); return; }
  if (action === 'reset-demo') { state.data=structuredClone(seed); persist(); state.modal=null; state.filter='all'; state.query=''; notify('Demo data reset'); return; }
  if (action === 'confirm-add' || action === 'confirm-send') {
    const amount = Number(document.querySelector('#amount')?.value);
    const recipient = document.querySelector('#recipient')?.value.trim();
    if (!Number.isFinite(amount) || amount <= 0) { notify('Enter a valid amount'); return; }
    if (action === 'confirm-send' && !recipient) { notify('Add a recipient label'); return; }
    if (action === 'confirm-send' && amount > state.data.cash) { notify('Amount exceeds available demo cash'); return; }
    if (action === 'confirm-send') state.data.cash -= amount; else state.data.cash += amount;
    state.data.transactions.unshift({id:Date.now(),name:action==='confirm-send'?'Transfer to '+recipient:'Added demo funds',detail:action==='confirm-send'?'Simulated transfer · Demo':'Manual balance adjustment · Demo',date:new Date().toISOString(),amount,type:action==='confirm-send'?'expense':'income',category:action==='confirm-send'?'Transfer':'Income',method:'Demo balance'});
    persist(); state.modal=null; notify(action==='confirm-send'?'Demo transfer recorded':'Demo funds added'); return;
  }
}
document.addEventListener('click', event => {
  const target = event.target.closest('[data-page],[data-action],[data-filter],[data-asset],[data-transaction]');
  if (!target) {
    if (event.target.classList.contains('modal-layer')) { state.modal=null; renderPage(); }
    return;
  }
  if (target.dataset.page) { state.page=target.dataset.page; state.mobileNav=false; state.filter='all'; renderPage(); return; }
  if (target.dataset.filter) { state.filter=target.dataset.filter; renderPage(); return; }
  if (target.dataset.asset) { state.selectedAsset=target.dataset.asset; openModal('asset'); return; }
  if (target.dataset.transaction) { state.selectedAsset=Number(target.dataset.transaction); openModal('transaction'); return; }
  if (target.dataset.action) handleAction(target.dataset.action,target);
});
document.addEventListener('input', event => {
  if (event.target.id === 'activity-search') {
    const cursor = event.target.selectionStart; state.query=event.target.value;
    const y = window.scrollY; renderPage();
    const input = document.querySelector('#activity-search'); input?.focus(); input?.setSelectionRange(cursor,cursor); window.scrollTo(0,y);
  }
});
document.addEventListener('change', event => {
  if (event.target.id === 'activity-sort') { state.sort=event.target.value; renderPage(); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && (state.modal || state.mobileNav)) { state.modal=null; state.mobileNav=false; renderPage(); }
});
if (localStorage.getItem(SESSION) !== 'active') localStorage.setItem(SESSION,'active');
renderPage();
