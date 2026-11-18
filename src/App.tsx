import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell, Check, ChevronDown,
  ChevronRight, CircleHelp, Copy, CreditCard, Eye, EyeOff, Home, LayoutGrid,
  LogOut, Menu, MoreHorizontal, Plus, Search, ShieldCheck, TrendingUp, Wallet, X, Zap,
} from 'lucide-react'
import { chartValues, initialAssets, initialTransactions, type Transaction } from './data'

type Tab = 'Overview' | 'Activity' | 'Wallet' | 'Cards'
type Modal = 'send' | 'add' | 'receive' | 'account' | null
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
const STORAGE = 'titan-demo-state'

function App() {
  const [signedIn, setSignedIn] = useState(() => localStorage.getItem('titan-demo-session') === 'active')
  const [tab, setTab] = useState<Tab>('Overview')
  const [modal, setModal] = useState<Modal>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [period, setPeriod] = useState('1W')
  const [toast, setToast] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE) || 'null')?.transactions || initialTransactions } catch { return initialTransactions }
  })
  const [cash, setCash] = useState(12480.5)
  const [amount, setAmount] = useState('')

  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify({ transactions })) }, [transactions])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const assetsValue = initialAssets.reduce((sum, asset) => sum + asset.value, 0)
  const total = cash + assetsValue
  const spent = transactions.filter(t => t.kind === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const filteredTransactions = useMemo(() => transactions.slice(0, 5), [transactions])

  function login() {
    localStorage.setItem('titan-demo-session', 'active')
    setSignedIn(true)
  }
  function logout() {
    localStorage.removeItem('titan-demo-session')
    setSignedIn(false)
  }
  function notify(message: string) {
    setToast(message)
    setModal(null)
    setAmount('')
  }
  function handleAction() {
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) return
    if (modal === 'add') {
      setCash(current => current + value)
      setTransactions(current => [{ id: Date.now(), name: 'Added funds', detail: 'Demo balance adjustment', date: 'Just now', amount: value, kind: 'income', category: 'Income', symbol: '+' }, ...current])
      notify('Demo funds added to your balance')
    } else if (modal === 'send') {
      if (value > cash) { notify('Not enough demo cash for that transfer'); return }
      setCash(current => current - value)
      setTransactions(current => [{ id: Date.now(), name: 'Demo transfer', detail: 'Simulated payment', date: 'Just now', amount: value, kind: 'expense', category: 'Transfer', symbol: '↗' }, ...current])
      notify('Demo transfer completed')
    }
  }

  if (!signedIn) return <Login onLogin={login} />

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#" onClick={e => e.preventDefault()}><span className="brand-mark"><span /></span><span>TITAN</span></a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          {([
            ['Overview', Home], ['Activity', ArrowLeftRight], ['Wallet', Wallet], ['Cards', CreditCard],
          ] as const).map(([label, Icon]) => (
            <button key={label} className={`nav-item ${tab === label ? 'active' : ''}`} onClick={() => { setTab(label); setMenuOpen(false) }}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Activity' && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>Need a hand?</strong><span>We're here if you need us.</span><button onClick={() => notify('Support is not connected in this demo')}>Get support <ArrowUpRight size={13} /></button></div>
          <button className="profile-row" onClick={() => setModal('account')}><div className="avatar">M</div><div className="profile-copy"><strong>Meta Odede</strong><span>Personal account</span></div><MoreHorizontal size={19} /></button>
        </div>
      </aside>

      {menuOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand-row"><button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button><span className="mobile-brand">TITAN</span></div>
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{tab}</strong></div>
          <div className="topbar-actions"><span className="demo-pill"><span /> DEMO MODE</span><button className="icon-button" aria-label="Search" onClick={() => notify('Search is coming soon')}><Search size={18} /></button><button className="icon-button notification" aria-label="Notifications" onClick={() => notify('You’re all caught up')}><Bell size={18} /><i /></button><button className="top-avatar" onClick={() => setModal('account')}>M</button></div>
        </header>

        <div className="page-content">
          {tab === 'Overview' && <>
            <div className="page-heading"><div><div className="eyebrow">TUESDAY, NOVEMBER 18, 2026</div><h1>Good morning, Meta <span>✳</span></h1><p>Here's what's happening with your money today.</p></div><button className="outline-button date-button" onClick={() => notify('Showing your latest demo activity')}>This week <ChevronDown size={15} /></button></div>

            <section className="overview-grid">
              <div className="balance-card">
                <div className="balance-top"><span>Total balance</span><button className="visibility-button" onClick={() => setShowBalance(!showBalance)} aria-label="Toggle balance visibility">{showBalance ? <Eye size={17} /> : <EyeOff size={17} />}</button></div>
                <div className="balance-amount">{showBalance ? money(total) : '••••••••'}</div>
                <div className="balance-change"><span><TrendingUp size={14} /> 4.8%</span> <span>vs. last week</span></div>
                <div className="balance-rule" />
                <div className="balance-footer"><div><span>Cash balance</span><strong>{showBalance ? money(cash) : '••••••'}</strong></div><div><span>Crypto assets</span><strong>{showBalance ? money(assetsValue) : '••••••'}</strong></div><div className="balance-logo">T.</div></div>
              </div>

              <div className="spending-card">
                <div className="card-heading"><div><span className="eyebrow">SPENDING</span><h3>Your outflow</h3></div><button className="more-button" onClick={() => setTab('Activity')}><MoreHorizontal size={20} /></button></div>
                <div className="spending-total">{money(spent)} <span>this period</span></div>
                <div className="spending-meter"><span style={{ width: '63%' }} /></div>
                <div className="spending-meta"><span><i /> 63% of monthly budget</span><strong>$1,980.00 left</strong></div>
                <div className="spending-foot"><span>Monthly budget</span><strong>$3,200.00</strong></div>
              </div>
            </section>

            <section className="quick-actions">
              <button onClick={() => setModal('send')}><span className="action-icon dark"><ArrowUpRight size={19} /></span><span><strong>Send</strong><small>Transfer money</small></span></button>
              <button onClick={() => setModal('add')}><span className="action-icon pale"><Plus size={20} /></span><span><strong>Add money</strong><small>Top up balance</small></span></button>
              <button onClick={() => setModal('receive')}><span className="action-icon pale"><ArrowDownLeft size={19} /></span><span><strong>Receive</strong><small>Get paid</small></span></button>
              <button onClick={() => setTab('Wallet')}><span className="action-icon pale"><LayoutGrid size={18} /></span><span><strong>All assets</strong><small>View portfolio</small></span></button>
            </section>

            <section className="content-grid">
              <div className="panel chart-panel">
                <div className="panel-heading"><div><span className="eyebrow">YOUR PORTFOLIO</span><h2>Balance history</h2></div><div className="period-switch">{['1D', '1W', '1M', '1Y'].map(p => <button key={p} className={period === p ? 'selected' : ''} onClick={() => setPeriod(p)}>{p}</button>)}</div></div>
                <div className="chart-summary"><strong>{showBalance ? money(total) : '••••••'}</strong><span className="positive">↗ 4.8%</span></div>
                <div className="chart-wrap">
                  <div className="chart-y-labels"><span>$18k</span><span>$15k</span><span>$12k</span><span>$9k</span></div>
                  <svg className="chart-svg" viewBox="0 0 660 190" preserveAspectRatio="none" role="img" aria-label="Illustrative portfolio balance chart trending upward">
                    {[20, 66, 112, 158].map(y => <line key={y} x1="0" x2="660" y1={y} y2={y} className="grid-line" />)}
                    <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b18a45" stopOpacity=".2" /><stop offset="100%" stopColor="#b18a45" stopOpacity="0" /></linearGradient></defs>
                    <path d={chartPath(chartValues)} transform="translate(0 12)" fill="none" stroke="#a37b37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={`${chartPath(chartValues)} L 660 190 L 0 190 Z`} transform="translate(0 12)" fill="url(#chartFill)" />
                  </svg>
                </div>
                <div className="chart-x-labels"><span>Nov 12</span><span>Nov 13</span><span>Nov 14</span><span>Nov 15</span><span>Nov 16</span><span>Nov 17</span><span>Today</span></div>
              </div>

              <div className="panel assets-panel">
                <div className="panel-heading"><div><span className="eyebrow">CRYPTO</span><h2>Your assets</h2></div><button className="text-link" onClick={() => setTab('Wallet')}>View all <ChevronRight size={14} /></button></div>
                <div className="asset-list">{initialAssets.map(asset => <div className="asset-row" key={asset.ticker}><div className="coin-icon" style={{ background: asset.color }}>{asset.icon}</div><div className="asset-name"><strong>{asset.name}</strong><span>{asset.amount} {asset.ticker}</span></div><div className="asset-value"><strong>{money(asset.value)}</strong><span className={asset.change >= 0 ? 'positive' : 'negative'}>{asset.change > 0 ? '+' : ''}{asset.change}%</span></div></div>)}</div>
                <button className="asset-footer" onClick={() => setTab('Wallet')}>Explore wallet <ArrowUpRight size={15} /></button>
              </div>
            </section>

            <section className="panel transactions-panel">
              <div className="panel-heading"><div><span className="eyebrow">YOUR MONEY</span><h2>Recent activity</h2></div><button className="text-link" onClick={() => setTab('Activity')}>All activity <ChevronRight size={14} /></button></div>
              <TransactionList items={filteredTransactions} />
            </section>
          </>}

          {tab === 'Activity' && <div className="subpage"><div className="page-heading"><div><div className="eyebrow">YOUR MONEY</div><h1>Activity</h1><p>A clear view of money moving in and out.</p></div></div><section className="panel transactions-panel full-panel"><TransactionList items={transactions} /></section></div>}

          {tab === 'Wallet' && <div className="subpage"><div className="page-heading"><div><div className="eyebrow">YOUR PORTFOLIO</div><h1>Your wallet</h1><p>Keep an eye on your digital assets.</p></div><button className="primary-button" onClick={() => setModal('receive')}><Plus size={16} /> Receive</button></div><section className="wallet-total"><span>Total portfolio value</span><strong>{showBalance ? money(assetsValue) : '••••••'}</strong><button onClick={() => setShowBalance(!showBalance)}>{showBalance ? <Eye size={16} /> : <EyeOff size={16} />}</button></section><section className="panel wallet-assets"><div className="panel-heading"><h2>Assets</h2><span className="eyebrow">3 ASSETS</span></div>{initialAssets.map(asset => <div className="wallet-asset" key={asset.ticker}><div className="coin-icon" style={{ background: asset.color }}>{asset.icon}</div><div className="asset-name"><strong>{asset.name}</strong><span>{asset.ticker}</span></div><div className="asset-value"><strong>{money(asset.value)}</strong><span>{asset.amount} {asset.ticker}</span></div><span className={asset.change >= 0 ? 'positive' : 'negative'}>{asset.change > 0 ? '+' : ''}{asset.change}%</span></div>)}</section><p className="demo-note"><ShieldCheck size={15} /> Cryptocurrency prices and holdings are illustrative demo data.</p></div>}

          {tab === 'Cards' && <div className="subpage"><div className="page-heading"><div><div className="eyebrow">PAYMENTS</div><h1>Your cards</h1><p>A simple place to keep track of your cards.</p></div><button className="primary-button" onClick={() => notify('Card issuing is not available in this demo')}><Plus size={16} /> Add card</button></div><div className="bank-card"><div className="bank-card-top"><span className="brand small-brand"><span className="brand-mark"><span /></span><span>TITAN</span></span><span>DEBIT</span></div><div className="card-chip" /><div className="card-number">•••• &nbsp; •••• &nbsp; •••• &nbsp; 2048</div><div className="bank-card-bottom"><span>META ODEDE</span><span>VISA</span></div></div><p className="demo-note"><ShieldCheck size={15} /> This is a visual sample card, not a payment instrument.</p></div>}
        </div>
        <footer className="footer"><span>© 2026 Titan Finance</span><span><i /> All systems operational</span><span>Demo environment · No real funds</span></footer>
      </main>

      {modal && <ModalView modal={modal} amount={amount} setAmount={setAmount} onClose={() => setModal(null)} onAction={handleAction} onNotify={notify} onLogout={logout} />}
      {toast && <div className="toast"><Check size={16} />{toast}</div>}
    </div>
  )
}

function chartPath(values: number[]) {
  return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (values.length - 1)) * 660} ${170 - v * 1.42}`).join(' ')
}

function TransactionList({ items }: { items: Transaction[] }) {
  return <div className="transaction-list">{items.map(item => <div className="transaction-row" key={item.id}><div className={`transaction-icon ${item.kind}`}>{item.kind === 'income' ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</div><div className="transaction-name"><strong>{item.name}</strong><span>{item.detail}</span></div><span className="transaction-category">{item.category}</span><span className="transaction-date">{item.date}</span><strong className={`transaction-amount ${item.kind}`}>{item.kind === 'income' ? '+' : '−'}{money(item.amount)}</strong></div>)}</div>
}

function Login({ onLogin }: { onLogin: () => void }) {
  return <div className="login-page"><div className="login-left"><a className="brand" href="#"><span className="brand-mark"><span /></span><span>TITAN</span></a><div className="login-message"><span className="eyebrow">A CLEARER VIEW OF MONEY</span><h1>Make your money<br />make sense.</h1><p>Your cash and crypto, brought together in one simple place.</p><div className="login-art"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-core">T<span>.</span></div><div className="art-label label-one"><span /> CASH BALANCE <strong>$12,480</strong></div><div className="art-label label-two"><span /> DIGITAL ASSETS <strong>$13,988</strong></div></div></div><span className="login-legal">A demo experience. No real accounts or funds.</span></div><div className="login-right"><div className="login-form"><div className="login-symbol"><Wallet size={22} /></div><h2>Welcome to Titan</h2><p>Your financial overview starts here.</p><label>Email address</label><input type="email" defaultValue="meta@example.com" readOnly /><label>Password</label><input type="password" value="titan-demo" readOnly /><button className="primary-button login-button" onClick={onLogin}>Continue with demo account <ArrowUpRight size={16} /></button><div className="login-divider"><span /> or <span /></div><button className="outline-button google-button" onClick={onLogin}>Explore demo account</button><div className="secure-note"><ShieldCheck size={15} /> Demo sign-in. No credentials are sent anywhere.</div></div></div></div>
}

function ModalView({ modal, amount, setAmount, onClose, onAction, onNotify, onLogout }: {
  modal: Exclude<Modal, null>, amount: string, setAmount: (v: string) => void, onClose: () => void,
  onAction: () => void, onNotify: (s: string) => void, onLogout: () => void,
}) {
  const title = modal === 'send' ? 'Send money' : modal === 'add' ? 'Add money' : modal === 'receive' ? 'Receive money' : 'Your account'
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}><div className="modal"><div className="modal-heading"><h2>{title}</h2><button className="icon-button" onClick={onClose}><X size={18} /></button></div>
    {(modal === 'send' || modal === 'add') && <><p className="modal-description">{modal === 'send' ? 'Try a simulated transfer from your demo cash balance.' : 'Add sample funds to your demo balance.'}</p><label>Amount (USD)</label><div className="amount-input"><span>$</span><input type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} /></div><div className="demo-warning"><Zap size={15} /> This action only changes demo data in this browser.</div><button className="primary-button modal-submit" onClick={onAction} disabled={!Number(amount) || Number(amount) <= 0}>{modal === 'send' ? 'Confirm demo transfer' : 'Add demo funds'} <ArrowUpRight size={16} /></button></>}
    {modal === 'receive' && <><p className="modal-description">Use this sample address to preview the receive flow. It is not connected to a blockchain.</p><div className="receive-address">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div><button className="outline-button copy-button" onClick={() => { navigator.clipboard?.writeText('0x71C7656EC7ab88b098defB751B7401B5f6d8976F'); onNotify('Sample address copied') }}><Copy size={15} /> Copy sample address</button><div className="demo-warning"><ShieldCheck size={15} /> Do not send real assets to this sample address.</div></>}
    {modal === 'account' && <><div className="account-detail"><div className="avatar large-avatar">M</div><div><strong>Meta Odede</strong><span>meta@example.com</span></div></div><div className="account-setting"><span>Account type</span><strong>Personal · Demo</strong></div><div className="account-setting"><span>Environment</span><strong>Local browser storage</strong></div><button className="outline-button logout-button" onClick={onLogout}><LogOut size={16} /> Sign out</button></>}
  </div></div>
}

export default App
