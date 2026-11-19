import './styles.css';
import './product.css';

const DATA_KEY = 'titan-product-v1';
const SESSION_KEY = 'titan-session-v1';

const seed = {
  profile: { name: 'Alex Morgan', email: 'demo@titan.app', initials: 'AM' },
  accounts: [
    { id: 'checking', name: 'Everyday account', type: 'Checking', number: '•••• 4821', balance: 12480.50, currency: 'USD', color: 'gold' },
    { id: 'savings', name: 'Savings account', type: 'Savings', number: '•••• 1904', balance: 8250.00, currency: 'USD', color: 'silver' },
    { id: 'vault', name: 'Reserve account', type: 'Reserve', number: '•••• 7730', balance: 3200.00, currency: 'USD', color: 'dark' }
  ],
  assets: [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', quantity: 0.0842, network: 'Bitcoin', color: 'bitcoin' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', quantity: 1.42, network: 'Ethereum', color: 'ethereum' },
    { id: 'sol', name: 'Solana', symbol: 'SOL', quantity: 18.5, network: 'Solana', color: 'solana' }
  ],
  cards: [
    { id: 'card-1', name: 'Titan Everyday', last4: '4821', holder: 'ALEX MORGAN', status: 'Active', kind: 'Physical', limit: 2500, spent: 684.32, frozen: false },
    { id: 'card-2', name: 'Titan Virtual', last4: '9016', holder: 'ALEX MORGAN', status: 'Active', kind: 'Virtual', limit: 1000, spent: 129.99, frozen: false }
  ],
  transactions: [
    { id: 't1', name: 'Salary deposit', detail: 'Northstar Studio', date: '2026-11-18T09:15:00', amount: 2450, type: 'income', category: 'Income', account: 'Everyday account', method: 'Bank transfer' },
    { id: 't2', name: 'Spotify', detail: 'Monthly subscription', date: '2026-11-18T10:42:00', amount: 10.99, type: 'expense', category: 'Entertainment', account: 'Everyday account', method: 'Titan Virtual' },
    { id: 't3', name: 'Groceries', detail: 'Market Street', date: '2026-11-17T18:30:00', amount: 86.42, type: 'expense', category: 'Shopping', account: 'Everyday account', method: 'Titan Everyday' },
    { id: 't4', name: 'Transfer from Jordan', detail: 'Personal transfer', date: '2026-11-17T13:08:00', amount: 120, type: 'income', category: 'Transfer', account: 'Everyday account', method: 'Bank transfer' },
    { id: 't5', name: 'Ride share', detail: 'City transport', date: '2026-11-15T20:20:00', amount: 18.50, type: 'expense', category: 'Transport', account: 'Everyday account', method: 'Titan Everyday' },
    { id: 't6', name: 'Coffee House', detail: 'Food and drink', date: '2026-11-14T08:30:00', amount: 8.75, type: 'expense', category: 'Food', account: 'Everyday account', method: 'Titan Everyday' },
    { id: 't7', name: 'Online store', detail: 'Home essentials', date: '2026-11-12T16:12:00', amount: 64.20, type: 'expense', category: 'Shopping', account: 'Everyday account', method: 'Titan Virtual' },
    { id: 't8', name: 'Savings transfer', detail: 'Monthly allocation', date: '2026-11-10T12:00:00', amount: 300, type: 'expense', category: 'Transfer', account: 'Everyday account', method: 'Internal transfer' },
    { id: 't9', name: 'Freelance payment', detail: 'Project payment', date: '2026-11-07T11:24:00', amount: 680, type: 'income', category: 'Income', account: 'Everyday account', method: 'Bank transfer' },
    { id: 't10', name: 'Electricity', detail: 'Utilities', date: '2026-11-04T14:15:00', amount: 92.40, type: 'expense', category: 'Bills', account: 'Everyday account', method: 'Titan Everyday' }
  ]
};

const glyphs = {
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  overview:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  accounts:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
  cards:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 15h3"/>',
  crypto:'<path d="M12 2v20M17 6.5c0-1.4-1.4-2.5-3.2-2.5H9v16h5c2 0 3.5-1.1 3.5-2.8 0-1.5-1.2-2.6-3-2.9 1.6-.3 2.5-1.3 2.5-2.8Z"/>',
  activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  analytics:'<path d="M4 19V9m8 10V4m8 15v-7"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  add:'<path d="M12 5v14M5 12h14"/>',
  down:'<path d="m5 9 7 7 7-7"/>',
  right:'<path d="m9 18 6-6-6-6"/>',
  eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
  close:'<path d="m18 6-12 12M6 6l12 12"/>',
  lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  logout:'<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
  search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  freeze:'<path d="M12 2v20M4.9 6l14.2 12M4.9 18 19.1 6M3 12h18"/>'
};
const icon = (name, size=18) => '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(glyphs[name]||'')+'</svg>';
const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(n)||0);
const fmtDate = d => new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(d));
const fmtTime = d => new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit'}).format(new Date(d));
const safe = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone = v => JSON.parse(JSON.stringify(v));

function loadData(){
  try {
    const raw = JSON.parse(localStorage.getItem(DATA_KEY));
    if(raw && Array.isArray(raw.accounts) && Array.isArray(raw.transactions) && Array.isArray(raw.cards)) return raw;
  } catch {}
  return clone(seed);
}
function saveData(){ try{localStorage.setItem(DATA_KEY,JSON.stringify(state.data));}catch{toast('Browser storage is unavailable');} }
function readSession(){
  try { const v=JSON.parse(localStorage.getItem(SESSION_KEY)); return v && v.email ? v : null; } catch { return null; }
}
const state = {
  session: readSession(),
  data: loadData(),
  page:'Overview',
  modal:null,
  selected:null,
  filter:'all',
  search:'',
  sort:'newest',
  hidden:false,
  toast:'',
  authMode:'login',
  authError:'',
  navOpen:false
};

function toast(message){
  state.toast=message; render();
  clearTimeout(toast.timer);
  toast.timer=setTimeout(()=>{state.toast='';render();},2400);
}
function totalCash(){return state.data.accounts.reduce((sum,a)=>sum+a.balance,0);}
function totalIncome(){return state.data.transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);}
function totalSpend(){return state.data.transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);}
function pageTitle(){return state.page;}
function navItem(name, glyph){
  return '<button class="nav-item '+(state.page===name?'active':'')+'" data-page="'+name+'" aria-label="'+name+'" title="'+name+'" '+(state.page===name?'aria-current="page"':'')+'>'+icon(glyph,18)+'<span>'+name+'</span></button>';
}
function authView(){
  const register=state.authMode==='register';
  return '<main class="auth-layout"><section class="auth-aside"><a class="brand" href="#" data-action="auth-home"><span class="brand-mark"><i></i></span><span>TITAN</span></a><div class="auth-message"><span class="eyebrow">A clearer view of your money</span><h1>One place.<br>More control.</h1><p>Banking and digital assets, brought into one considered workspace.</p></div><div class="auth-aside-foot">PRIVATE BY DESIGN <span>·</span> BUILT FOR CLARITY</div></section><section class="auth-main"><div class="auth-mobile-brand"><span class="brand-mark"><i></i></span><b>TITAN</b></div><div class="auth-card"><div class="auth-heading"><span class="eyebrow">'+(register?'GET STARTED':'WELCOME BACK')+'</span><h2>'+(register?'Create your account':'Sign in to Titan')+'</h2><p>'+(register?'Set up a local prototype profile.':'Continue to your financial workspace.')+'</p></div><form id="auth-form" novalidate>'+(register?'<label class="field-label" for="auth-name">Full name</label><input class="form-input" id="auth-name" name="name" autocomplete="name" placeholder="Alex Morgan" required>':'')+'<label class="field-label" for="auth-email">Email address</label><input class="form-input" id="auth-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required><label class="field-label" for="auth-password">Password</label><input class="form-input" id="auth-password" name="password" type="password" autocomplete="'+(register?'new-password':'current-password')+'" placeholder="Enter your password" required><div class="auth-error" role="alert">'+safe(state.authError)+'</div><button class="primary-button auth-submit" type="submit">'+(register?'Create local profile':'Sign in')+'</button></form><div class="auth-switch">'+(register?'Already have an account? <button data-action="auth-login">Sign in</button>':'New to Titan? <button data-action="auth-register">Create account</button>')+'</div><div class="demo-login"><div><span class="eyebrow">DEMO ACCESS</span><p>Use the sample profile to explore the interface.</p></div><button class="text-action" data-action="demo-login">Use demo account '+icon('right',14)+'</button><small>Email: demo@titan.app · Password: titan-demo</small></div></div><p class="auth-disclaimer">Prototype only. Authentication is simulated in this browser and does not secure real accounts or money.</p></section></main>';
}
function shell(content){
  const initials=(state.data.profile.initials||'AM').slice(0,2);
  return '<div class="app-shell '+(state.navOpen?'nav-open':'')+'"><aside class="sidebar" id="primary-navigation"><a class="brand" href="#" data-action="home"><span class="brand-mark"><i></i></span><span>TITAN</span></a><div class="nav-label">Workspace</div><nav class="main-nav" aria-label="Main navigation">'+navItem('Overview','overview')+navItem('Accounts','accounts')+navItem('Cards','cards')+navItem('Crypto','crypto')+navItem('Activity','activity')+navItem('Analytics','analytics')+'</nav><div class="sidebar-bottom"><div class="sidebar-note"><span class="eyebrow">YOUR SPACE</span><p>Everything in one view.</p></div>'+navItem('Settings','settings')+'</div></aside>'+(state.navOpen?'<button class="nav-scrim" data-action="close-navigation" aria-label="Close navigation"></button>':'')+'<main class="main-area"><header class="topbar"><div class="topbar-context"><button class="mobile-menu" data-action="toggle-navigation" aria-label="Open navigation" aria-controls="primary-navigation" aria-expanded="'+(state.navOpen?'true':'false')+'">'+icon(state.navOpen?'close':'menu',19)+'</button><span class="topbar-brand">TITAN</span><span class="topbar-divider">/</span><strong>'+pageTitle()+'</strong></div><div class="topbar-right"><span class="topbar-date">'+new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric'}).format(new Date())+'</span><button class="account-control" data-page="Settings" aria-label="Open profile settings">'+safe(initials)+'</button></div></header><div class="page-content">'+content+'</div><footer class="page-footer"><span>TITAN</span><span>Sample environment · No external accounts or networks connected</span></footer></main>'+(state.modal?modalView():'')+(state.toast?'<div class="toast" role="status">'+icon('check',16)+safe(state.toast)+'</div>':'')+'</div>';
}
function heading(kicker,title,desc,action=''){
  return '<div class="page-heading"><div><span class="eyebrow">'+kicker+'</span><h1>'+title+'</h1><p>'+desc+'</p></div>'+action+'</div>';
}
function balanceCard(){
  return '<section class="hero-balance"><div class="hero-top"><span class="eyebrow">TOTAL ACCOUNT BALANCE</span><button class="visibility-control" data-action="toggle-balance" aria-label="Toggle balance visibility">'+icon('eye',17)+'</button></div><div class="hero-amount">'+(state.hidden?'••••••••':money(totalCash()))+'</div><div class="hero-bottom"><span>Across '+state.data.accounts.length+' accounts</span><span class="hero-currency">USD <span>·</span> Sample balance</span></div><div class="hero-actions"><button class="primary-button" data-action="transfer">'+icon('send',16)+'Transfer</button><button class="secondary-button" data-action="add-funds">'+icon('plus',17)+'Add funds</button><button class="secondary-button" data-page="Accounts">View accounts '+icon('right',14)+'</button></div></section>';
}
function transactionRow(t){
  const incoming=t.type==='income';
  return '<button class="transaction-row" data-transaction="'+safe(t.id)+'"><span class="transaction-glyph '+(incoming?'income':'expense')+'">'+icon(incoming?'down':'send',16)+'</span><span class="transaction-description"><strong>'+safe(t.name)+'</strong><small>'+safe(t.detail)+' · '+safe(t.category)+'</small></span><span class="transaction-date">'+fmtDate(t.date)+'</span><strong class="transaction-amount '+(incoming?'income':'')+'">'+(incoming?'+':'−')+money(t.amount)+'</strong>'+icon('right',14)+'</button>';
}
function recentList(limit=5){
  const items=state.data.transactions.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,limit);
  return '<div class="transaction-list">'+(items.length?items.map(transactionRow).join(''):'<div class="empty-state">No activity yet.</div>')+'</div>';
}
function accountCard(a){
  return '<button class="account-card" data-account="'+a.id+'"><div class="account-card-top"><span class="account-symbol '+a.color+'">'+(a.type==='Checking'?'C':a.type==='Savings'?'S':'R')+'</span>'+icon('right',15)+'</div><span class="account-type">'+a.type.toUpperCase()+'</span><strong class="account-balance">'+(state.hidden?'••••••':money(a.balance))+'</strong><span class="account-name">'+safe(a.name)+'</span><span class="account-number">'+a.number+'</span></button>';
}
function assetRow(a){
  const symbol=a.id==='btc'?'₿':a.id==='eth'?'◆':'◎';
  return '<button class="asset-row" data-asset="'+a.id+'"><span class="asset-mark '+a.color+'">'+symbol+'</span><span class="asset-copy"><strong>'+a.name+'</strong><small>'+a.symbol+' · '+a.network+'</small></span><span class="asset-quantity"><strong>'+a.quantity+'</strong><small>'+a.symbol+'</small></span>'+icon('right',14)+'</button>';
}
function overviewPage(){
  const accounts=state.data.accounts.slice(0,3);
  const income=totalIncome(), spend=totalSpend();
  return heading('YOUR FINANCIAL SPACE','Overview','Your accounts, cards and digital assets at a glance.')+balanceCard()+
    '<div class="overview-columns"><section class="page-section"><div class="section-title"><div><span class="eyebrow">BANKING</span><h2>Your accounts</h2></div><button class="text-action" data-page="Accounts">All accounts '+icon('right',14)+'</button></div><div class="account-grid">'+accounts.map(accountCard).join('')+'</div></section><section class="page-section"><div class="section-title"><div><span class="eyebrow">ACTIVITY</span><h2>Recent transactions</h2></div><button class="text-action" data-page="Activity">View all '+icon('right',14)+'</button></div>'+recentList(4)+'</section></div>'+
    '<div class="overview-columns secondary-columns"><section class="page-section"><div class="section-title"><div><span class="eyebrow">DIGITAL ASSETS</span><h2>Crypto wallet</h2></div><button class="text-action" data-page="Crypto">View wallet '+icon('right',14)+'</button></div><div class="asset-list">'+state.data.assets.map(assetRow).join('')+'</div><p class="section-footnote">Illustrative quantities only. No live prices or connected wallet.</p></section><section class="page-section"><div class="section-title"><div><span class="eyebrow">CASH FLOW</span><h2>Activity summary</h2></div><button class="text-action" data-page="Analytics">Analytics '+icon('right',14)+'</button></div><div class="summary-stats"><div><span>Recorded income</span><strong class="positive">'+money(income)+'</strong></div><div><span>Recorded spending</span><strong>'+money(spend)+'</strong></div><div><span>Net recorded</span><strong class="'+(income-spend>=0?'positive':'negative')+'">'+money(income-spend)+'</strong></div></div></section></div>';
}
function accountsPage(){
  return heading('BANKING','Accounts','Manage your sample cash accounts and account activity.', '<button class="primary-button" data-action="add-funds">'+icon('plus',16)+'Add funds</button>')+
    '<div class="account-grid account-grid-page">'+state.data.accounts.map(accountCard).join('')+'</div>'+
    '<section class="page-section account-ledger"><div class="section-title"><div><span class="eyebrow">ACCOUNT ACTIVITY</span><h2>Recent account movements</h2></div></div>'+recentList(8)+'</section>'+
    '<p class="inline-disclaimer">'+icon('lock',15)+' Account balances and movements are local sample data. No bank is connected.</p>';
}
function cardVisual(c){
  return '<article class="payment-card '+(c.frozen?'frozen':'')+'"><div class="payment-card-head"><span class="brand-mini">TITAN</span><span class="card-kind">'+c.kind.toUpperCase()+'</span></div><div class="card-chip"><span></span></div><div class="card-number">•••• &nbsp;•••• &nbsp;•••• &nbsp;'+c.last4+'</div><div class="payment-card-foot"><div><small>CARDHOLDER</small><strong>'+safe(c.holder)+'</strong></div><div class="card-network">◉◉</div></div><span class="card-watermark"></span></article>';
}
function cardsPage(){
  return heading('PAYMENTS','Cards','View and manage your sample Titan payment cards.', '<button class="secondary-button" data-action="new-card">'+icon('plus',16)+'New virtual card</button>')+
    '<div class="cards-grid">'+state.data.cards.map(c=>'<section class="card-management">'+cardVisual(c)+'<div class="card-info"><div><strong>'+safe(c.name)+'</strong><span>'+c.status+' · '+c.kind+'</span></div><button class="text-action" data-card="'+c.id+'">Manage '+icon('right',14)+'</button></div><div class="card-usage"><div><span>Illustrative monthly usage</span><strong>'+money(c.spent)+' / '+money(c.limit)+'</strong></div><div class="usage-track"><i style="width:'+Math.min(100,c.spent/c.limit*100)+'%"></i></div></div></section>').join('')+'</div>'+
    '<p class="inline-disclaimer">'+icon('lock',15)+' These are visual prototypes, not issued or usable payment cards. Card controls only change local sample state.</p>';
}
function cryptoPage(){
  return heading('DIGITAL ASSETS','Crypto wallet','A view of your sample digital asset holdings.')+
    '<section class="crypto-summary"><div><span class="eyebrow">ASSETS HELD</span><strong>'+state.data.assets.length+'</strong><small>Sample assets</small></div><div><span class="eyebrow">WALLET STATUS</span><strong>Not connected</strong><small>No network access</small></div><div><span class="eyebrow">MARKET DATA</span><strong>Unavailable</strong><small>No live prices displayed</small></div></section>'+
    '<section class="page-section crypto-holdings"><div class="section-title"><div><span class="eyebrow">YOUR HOLDINGS</span><h2>Assets</h2></div></div><div class="asset-list">'+state.data.assets.map(assetRow).join('')+'</div></section>'+
    '<div class="inline-disclaimer">'+icon('lock',15)+' Quantities are illustrative. Titan does not connect to a wallet, exchange or blockchain, and cannot send, receive or trade digital assets.</div>';
}
function filteredTransactions(){
  let items=state.data.transactions.slice();
  if(state.filter!=='all') items=items.filter(t=>t.type===state.filter);
  if(state.search.trim()){
    const q=state.search.toLowerCase();
    items=items.filter(t=>(t.name+' '+t.detail+' '+t.category+' '+t.method+' '+t.account).toLowerCase().includes(q));
  }
  items.sort((a,b)=>state.sort==='oldest'?new Date(a.date)-new Date(b.date):new Date(b.date)-new Date(a.date));
  return items;
}
function activityPage(){
  const items=filteredTransactions();
  return heading('HISTORY','Activity','Search and review your account transactions.')+
    '<section class="page-section activity-section"><div class="activity-toolbar"><div class="filter-group">'+[['all','All'],['income','Incoming'],['expense','Outgoing']].map(([v,l])=>'<button class="'+(state.filter===v?'selected':'')+'" data-filter="'+v+'">'+l+'</button>').join('')+'</div><label class="search-box">'+icon('search',16)+'<input id="activity-search" type="search" placeholder="Search transactions" value="'+safe(state.search)+'"></label><select id="activity-sort" aria-label="Sort transactions"><option value="newest" '+(state.sort==='newest'?'selected':'')+'>Newest first</option><option value="oldest" '+(state.sort==='oldest'?'selected':'')+'>Oldest first</option></select></div><div class="transaction-list full-list">'+(items.length?items.map(transactionRow).join(''):'<div class="empty-state">No matching transactions.</div>')+'</div><div class="list-footer">Showing '+items.length+' of '+state.data.transactions.length+' transactions</div></section>';
}
function analyticsPage(){
  const income=totalIncome(), spend=totalSpend(), max=Math.max(income,spend,1);
  const categories={};
  state.data.transactions.filter(t=>t.type==='expense').forEach(t=>categories[t.category]=(categories[t.category]||0)+t.amount);
  const rows=Object.entries(categories).sort((a,b)=>b[1]-a[1]);
  return heading('INSIGHTS','Analytics','A simple breakdown of the sample activity in this browser.')+
    '<div class="analytics-stats"><div class="metric-card"><span>Recorded income</span><strong class="positive">'+money(income)+'</strong><small>'+state.data.transactions.filter(t=>t.type==='income').length+' entries</small></div><div class="metric-card"><span>Recorded spending</span><strong>'+money(spend)+'</strong><small>'+state.data.transactions.filter(t=>t.type==='expense').length+' entries</small></div><div class="metric-card"><span>Net recorded</span><strong class="'+(income-spend>=0?'positive':'negative')+'">'+money(income-spend)+'</strong><small>Income minus spending</small></div></div>'+
    '<div class="analytics-grid"><section class="page-section"><div class="section-title"><div><span class="eyebrow">CASH FLOW</span><h2>Recorded totals</h2></div></div><div class="bar-comparison"><div><span>Income</span><div class="bar-track"><i class="income-bar" style="width:'+(income/max*100)+'%"></i></div><strong>'+money(income)+'</strong></div><div><span>Spending</span><div class="bar-track"><i class="spend-bar" style="width:'+(spend/max*100)+'%"></i></div><strong>'+money(spend)+'</strong></div></div></section><section class="page-section"><div class="section-title"><div><span class="eyebrow">SPENDING</span><h2>By category</h2></div></div><div class="category-list">'+(rows.length?rows.map(([name,value])=>'<div class="category-row"><span>'+safe(name)+'</span><div class="category-track"><i style="width:'+(value/Math.max(spend,1)*100)+'%"></i></div><strong>'+money(value)+'</strong></div>').join(''):'<p class="section-footnote">No spending recorded yet.</p>')+'</div></section></div>'+
    '<p class="inline-disclaimer">'+icon('lock',15)+' Calculated from local sample transactions only. No financial advice or live account data.</p>';
}
function settingsPage(){
  const p=state.data.profile;
  return heading('PREFERENCES','Settings','Manage your local Titan profile and prototype data.')+
    '<div class="settings-layout"><section class="page-section settings-section"><div class="section-title"><div><span class="eyebrow">PROFILE</span><h2>Personal information</h2></div></div><form id="profile-form" class="settings-form"><label class="field-label" for="profile-name">Display name</label><input class="form-input" id="profile-name" value="'+safe(p.name)+'" required><label class="field-label" for="profile-email">Email address</label><input class="form-input" id="profile-email" type="email" value="'+safe(p.email)+'" required><button class="primary-button" type="submit">Save profile</button></form></section><section class="page-section settings-section"><div class="section-title"><div><span class="eyebrow">SESSION</span><h2>Sign-in details</h2></div></div><div class="settings-line"><span>Authentication</span><strong>Simulated local session</strong></div><div class="settings-line"><span>Session email</span><strong>'+safe(state.session.email)+'</strong></div><button class="secondary-button settings-logout" data-action="logout">'+icon('logout',16)+'Sign out</button></section><section class="page-section settings-section"><div class="section-title"><div><span class="eyebrow">LOCAL DATA</span><h2>Prototype storage</h2></div></div><div class="settings-line"><span>Saved in</span><strong>This browser</strong></div><div class="settings-line"><span>External connections</span><strong>None</strong></div><button class="danger-button" data-action="reset-data">Reset sample data</button></section></div>'+
    '<p class="inline-disclaimer">'+icon('lock',15)+' This is a front-end prototype. Do not enter real passwords or sensitive financial information. Local sign-in is not secure authentication.</p>';
}
function modalView(){
  const m=state.modal;
  let title='', body='', context='DETAILS';
  if(m==='transfer'||m==='add-funds'){
    const sending=m==='transfer'; title=sending?'Transfer funds':'Add sample funds'; context=sending?'BANKING':'BALANCE';
    body='<p class="modal-description">'+(sending?'Move sample funds between your Titan accounts.':'Increase the local sample balance for interface testing.')+'</p>'+(sending?'<label class="field-label" for="transfer-from">From account</label><select class="form-input" id="transfer-from">'+state.data.accounts.map(a=>'<option value="'+a.id+'">'+safe(a.name)+' · '+money(a.balance)+'</option>').join('')+'</select><label class="field-label" for="transfer-to">To account</label><select class="form-input" id="transfer-to">'+state.data.accounts.map((a,i)=>'<option value="'+a.id+'" '+(i===1?'selected':'')+'>'+safe(a.name)+'</option>').join('')+'</select>':'<label class="field-label" for="fund-account">Add to account</label><select class="form-input" id="fund-account">'+state.data.accounts.map(a=>'<option value="'+a.id+'">'+safe(a.name)+'</option>').join('')+'</select>')+'<label class="field-label" for="modal-amount">Amount (USD)</label><div class="amount-input"><span>$</span><input id="modal-amount" type="number" min="0.01" max="1000000" step="0.01" placeholder="0.00" inputmode="decimal"></div><p class="modal-notice">'+icon('lock',15)+' Prototype only. No money will be moved or deposited.</p><button class="primary-button modal-submit" data-action="confirm-'+(sending?'transfer':'funds')+'">'+(sending?'Review transfer':'Add sample funds')+'</button>';
  }else if(m==='account'){
    const a=state.data.accounts.find(x=>x.id===state.selected); title=a?a.name:'Account details';
    body=a?'<div class="detail-balance">'+money(a.balance)+'</div><div class="settings-line"><span>Account type</span><strong>'+a.type+'</strong></div><div class="settings-line"><span>Account number</span><strong>'+a.number+'</strong></div><div class="settings-line"><span>Currency</span><strong>'+a.currency+'</strong></div><button class="primary-button modal-submit" data-action="transfer">Transfer between accounts</button>':'';
  }else if(m==='asset'){
    const a=state.data.assets.find(x=>x.id===state.selected); title=a?a.name:'Asset details';
    body=a?'<div class="detail-balance">'+a.quantity+' '+a.symbol+'</div><div class="settings-line"><span>Network</span><strong>'+a.network+'</strong></div><div class="settings-line"><span>Wallet connection</span><strong>Not connected</strong></div><p class="modal-notice">'+icon('lock',15)+' Illustrative holding only. No transactions can be made.</p>':'';
  }else if(m==='transaction'){
    const t=state.data.transactions.find(x=>x.id===state.selected); title='Transaction details';
    body=t?'<div class="detail-balance '+(t.type==='income'?'positive':'')+'">'+(t.type==='income'?'+':'−')+money(t.amount)+'</div><div class="settings-line"><span>Description</span><strong>'+safe(t.name)+'</strong></div><div class="settings-line"><span>Category</span><strong>'+safe(t.category)+'</strong></div><div class="settings-line"><span>Date</span><strong>'+fmtDate(t.date)+' · '+fmtTime(t.date)+'</strong></div><div class="settings-line"><span>Account</span><strong>'+safe(t.account)+'</strong></div><div class="settings-line"><span>Method</span><strong>'+safe(t.method)+'</strong></div><p class="modal-notice">'+icon('lock',15)+' Sample record only.</p>':'';
  }else if(m==='card'){
    const c=state.data.cards.find(x=>x.id===state.selected); title=c?c.name:'Card settings';
    body=c?'<div class="settings-line"><span>Card number</span><strong>•••• '+c.last4+'</strong></div><div class="settings-line"><span>Type</span><strong>'+c.kind+'</strong></div><div class="settings-line"><span>Status</span><strong>'+(c.frozen?'Frozen':'Active')+'</strong></div><button class="secondary-button modal-submit" data-action="toggle-card">'+icon('freeze',16)+(c.frozen?'Unfreeze card':'Freeze card')+'</button><p class="modal-notice">'+icon('lock',15)+' Visual prototype only. This card cannot be used for payments.</p>':'';
  }
  return '<div class="modal-backdrop" data-action="backdrop"><section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="sheet-grabber"></div><div class="modal-topline"><span class="eyebrow">'+context+'</span><button class="modal-close" data-action="close-modal" aria-label="Close">'+icon('close',17)+'</button></div><h2 id="modal-title">'+title+'</h2>'+body+'</section></div>';
}
function openModal(name,id=null){state.modal=name;state.selected=id;render();const f=document.querySelector('#modal-amount');if(f)f.focus();}
function signIn(email,name='Alex Morgan'){
  const clean=email.trim().toLowerCase();
  state.session={email:clean,name};
  state.data.profile={name,email:clean,initials:name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'AM'};
  try{localStorage.setItem(SESSION_KEY,JSON.stringify(state.session));}catch{}
  saveData();state.authError='';state.page='Overview';render();
}
function handleAuthSubmit(form){
  const fd=new FormData(form),email=String(fd.get('email')||'').trim(),password=String(fd.get('password')||''),name=String(fd.get('name')||'').trim();
  if(!email||!email.includes('@')){state.authError='Enter a valid email address.';render();return;}
  if(password.length<6){state.authError='Use at least 6 characters for this simulated sign-in.';render();return;}
  if(state.authMode==='register'&&!name){state.authError='Enter your name to create a local profile.';render();return;}
  // Passwords are deliberately never stored. This is a UI-only session simulation.
  signIn(email,name||'Alex Morgan');
}
function doTransfer(fund){
  const amount=Number(document.querySelector('#modal-amount')?.value);
  if(!Number.isFinite(amount)||amount<0.01||amount>1000000){toast('Enter a valid amount.');return;}
  if(fund){
    const account=state.data.accounts.find(a=>a.id===document.querySelector('#fund-account')?.value);
    if(!account)return;
    account.balance+=amount;
    state.data.transactions.unshift({id:'t'+Date.now(),name:'Funds added',detail:'Local prototype adjustment',date:new Date().toISOString(),amount,type:'income',category:'Income',account:account.name,method:'Local prototype'});
  }else{
    const from=state.data.accounts.find(a=>a.id===document.querySelector('#transfer-from')?.value);
    const to=state.data.accounts.find(a=>a.id===document.querySelector('#transfer-to')?.value);
    if(!from||!to||from.id===to.id){toast('Choose two different accounts.');return;}
    if(amount>from.balance){toast('Amount exceeds the available balance.');return;}
    from.balance-=amount;to.balance+=amount;
    state.data.transactions.unshift({id:'t'+Date.now(),name:'Internal transfer',detail:from.name+' to '+to.name,date:new Date().toISOString(),amount,type:'expense',category:'Transfer',account:from.name,method:'Internal transfer'});
  }
  saveData();state.modal=null;toast(fund?'Sample funds added':'Sample transfer recorded');
}
function handleAction(a){
  if(a==='close-modal'){state.modal=null;render();return;}
  if(a==='toggle-balance'){state.hidden=!state.hidden;render();return;}
  if(a==='transfer'||a==='add-funds'){openModal(a);return;}
  if(a==='confirm-transfer'||a==='confirm-funds'){doTransfer(a==='confirm-funds');return;}
  if(a==='toggle-card'){
    const c=state.data.cards.find(x=>x.id===state.selected);if(c){c.frozen=!c.frozen;saveData();state.modal='card';toast(c.frozen?'Sample card frozen':'Sample card active');}return;
  }
  if(a==='new-card'){
    const n=state.data.cards.length+1;
    state.data.cards.push({id:'card-'+Date.now(),name:'Titan Virtual '+n,last4:String(Math.floor(1000+Math.random()*9000)),holder:(state.data.profile.name||'ALEX MORGAN').toUpperCase(),status:'Active',kind:'Virtual',limit:500,spent:0,frozen:false});
    saveData();toast('Sample virtual card created');return;
  }
  if(a==='logout'){
    localStorage.removeItem(SESSION_KEY);state.session=null;state.page='Overview';state.modal=null;render();return;
  }
  if(a==='reset-data'){
    state.data=clone(seed);state.data.profile=clone(seed.profile);saveData();state.modal=null;toast('Sample data restored');return;
  }
  if(a==='auth-register'){state.authMode='register';state.authError='';render();return;}
  if(a==='auth-login'){state.authMode='login';state.authError='';render();return;}
  if(a==='demo-login'){signIn('demo@titan.app','Alex Morgan');return;}
  if(a==='toggle-navigation'){state.navOpen=!state.navOpen;render();return;}
  if(a==='close-navigation'){state.navOpen=false;render();return;}
  if(a==='auth-home'){return;}
  if(a==='home'){state.page='Overview';render();return;}
}
function render(){
  const app=document.querySelector('#app');
  app.innerHTML=state.session?shell(({
    Overview:overviewPage,Accounts:accountsPage,Cards:cardsPage,Crypto:cryptoPage,Activity:activityPage,Analytics:analyticsPage,Settings:settingsPage
  }[state.page]||overviewPage)()):authView();
  document.body.classList.toggle('has-modal',Boolean(state.modal));
}
document.addEventListener('click',e=>{
  const target=e.target.closest('[data-action],[data-page],[data-filter],[data-account],[data-asset],[data-transaction],[data-card]');
  if(!target)return;
  if(target.dataset.page){state.page=target.dataset.page;state.modal=null;state.navOpen=false;state.search='';state.filter='all';render();return;}
  if(target.dataset.filter){state.filter=target.dataset.filter;render();return;}
  if(target.dataset.account){openModal('account',target.dataset.account);return;}
  if(target.dataset.asset){openModal('asset',target.dataset.asset);return;}
  if(target.dataset.transaction){openModal('transaction',target.dataset.transaction);return;}
  if(target.dataset.card){openModal('card',target.dataset.card);return;}
  if(target.dataset.action==='backdrop'){if(e.target===target){state.modal=null;render();}return;}
  if(target.dataset.action){if(target.tagName==='A')e.preventDefault();handleAction(target.dataset.action);}
});
document.addEventListener('submit',e=>{
  if(e.target.id==='auth-form'){e.preventDefault();handleAuthSubmit(e.target);}
  if(e.target.id==='profile-form'){
    e.preventDefault();const name=document.querySelector('#profile-name').value.trim(),email=document.querySelector('#profile-email').value.trim();
    if(!name||!email.includes('@')){toast('Enter a valid name and email.');return;}
    state.data.profile={name,email,initials:name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()};
    state.session={email,name};try{localStorage.setItem(SESSION_KEY,JSON.stringify(state.session));}catch{}saveData();toast('Profile updated');
  }
});
document.addEventListener('input',e=>{
  if(e.target.id!=='activity-search')return;
  state.search=e.target.value;
  const list=document.querySelector('.full-list'),items=filteredTransactions();
  if(list)list.innerHTML=items.length?items.map(transactionRow).join(''):'<div class="empty-state">No matching transactions.</div>';
  const footer=document.querySelector('.list-footer');if(footer)footer.textContent='Showing '+items.length+' of '+state.data.transactions.length+' transactions';
});
document.addEventListener('change',e=>{if(e.target.id==='activity-sort'){state.sort=e.target.value;render();}});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&state.modal){state.modal=null;render();return;}
  if(e.key==='Escape'&&state.navOpen){state.navOpen=false;render();}
});
render();
