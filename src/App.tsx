import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Check, ChevronRight, Copy,
  CreditCard, Eye, EyeOff, Home, LayoutGrid, LogOut, Menu, MoreHorizontal,
  Plus, ShieldCheck, Wallet, X, Zap,
} from 'lucide-react'
import { initialAssets, initialTransactions, type Transaction } from './data'

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
  const [toast, setToast] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE) || 'null')?.transactions || initialTransactions } catch { return initialTransactions }
  })
  const [cash, setCash] = useState<number>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE) || 'null')?.cash ?? 12480.5 } catch { return 12480.5 }
  })
  const [amount, setAmount] = useState('')

  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify({ transactions, cash })) }, [transactions, cash])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const assetsValue = initialAssets.reduce((sum, asset) => sum + asset.value, 0)
  const total = cash + assetsValue
  const spent = transactions.filter(t => t.kind === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const today = new Date()
  const dateLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(today)
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening'
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
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="profile-row" onClick={() => setModal('account')}><div className="avatar">M</div><div className="profile-copy"><strong>Meta Odede</strong><span>Personal account</span></div><MoreHorizontal size={19} /></button>
        </div>
      </aside>

      {menuOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand-row"><button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button><span className="mobile-brand">TITAN</span></div>
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{tab}</strong></div>
          <div className="topbar-actions"><span className="demo-pill">DEMO MODE</span><button className="top-avatar" onClick={() => setModal('account')} aria-label="Open account">M</button></div>
        </header>

        <div className="page-content">
          {tab === 'Overview' && <>
            <div className="page-heading"><div><div className="eyebrow">{dateLabel}</div><h1>{greeting}, Meta</h1><p>Here's what's happening with your money today.</p></div></div>

            <section className="overview-grid">
              <div className="balance-card">
                <div className="balance-top"><span>Total balance</span><button className="visibility-button" onClick={() => setShowBalance(!showBalance)} aria-label="Toggle balance visibility">{showBalance ? <Eye size={17} /> : <EyeOff size={17} />}</button></div>
                <div className="balance-amount">{showBalance ? money(total) : '••••••••'}</div>
                <div className="balance-rule" />
                <div className="balance-footer"><div><span>Cash balance</span><strong>{showBalance ? money(cash) : '••••••'}</strong></div><div><span>Crypto assets</span><strong>{showBalance ? money(assetsValue) : '••••••'}</strong></div></div>
              </div>

              <div className="spending-card">
                <div className="card-heading"><div><span className="eyebrow">RECORDED ACTIVITY</span><h3>Total outflow</h3></div></div>
                <div className="spending-total">{money(spent)}</div>
                <p className="spending-description">Across the transactions shown in this demo.</p>
                <button className="text-link" onClick={() => setTab('Activity')}>View activity <ChevronRight size={14} /></button>
              </div>
            </section>

            <section className="quick-actions">
              <button onClick={() => setModal('send')}><span className="action-icon dark"><ArrowUpRight size={19} /></span><span><strong>Send</strong><small>Transfer money</small></span></button>
              <button onClick={() => setModal('add')}><span className="action-icon pale"><Plus size={20} /></span><span><strong>Add money</strong><small>Top up balance</small></span></button>
              <button onClick={() => setModal('receive')}><span className="action-icon pale"><ArrowDownLeft size={19} /></span><span><strong>Receive</strong><small>Get paid</small></span></button>
              <button onClick={() => setTab('Wallet')}><span className="action-icon pale"><LayoutGrid size={18} /></span><span><strong>All assets</strong><small>View portfolio</small></span></button>
            </section>

            <section className="content-grid">
              <div className="panel assets-panel">
                <div className="panel-heading"><div><span className="eyebrow">CRYPTO</span><h2>Your assets</h2></div><button className="text-link" onClick={() => setTab('Wallet')}>View all <ChevronRight size={14} /></button></div>
                <div className="asset-list">{initialAssets.map(asset => <div className="asset-row" key={asset.ticker}><div className="coin-icon" style={{ background: asset.color }}>{asset.icon}</div><div className="asset-name"><strong>{asset.name}</strong><span>{asset.amount} {asset.ticker}</span></div><div className="asset-value"><strong>{money(asset.value)}</strong></div></div>)}</div>
                <button className="asset-footer" onClick={() => setTab('Wallet')}>Explore wallet <ArrowUpRight size={15} /></button>
              </div>
            </section>

            <section className="panel transactions-panel">
              <div className="panel-heading"><div><span className="eyebrow">YOUR MONEY</span><h2>Recent activity</h2></div><button className="text-link" onClick={() => setTab('Activity')}>All activity <ChevronRight size={14} /></button></div>
              <TransactionList items={filteredTransactions} />
            </section>
          </>}

          {tab === 'Activity' && <div className="subpage"><div className="page-heading"><div><div className="eyebrow">YOUR MONEY</div><h1>Activity</h1><p>A clear view of money moving in and out.</p></div></div><section className="panel transactions-panel full-panel"><TransactionList items={transactions} /></section></div>}

          {tab === 'Wallet' && <div className="subpage"><div className="page-heading"><div><div className="eyebrow">YOUR PORTFOLIO</div><h1>Your wallet</h1><p>Keep an eye on your digital assets.</p></div><button className="primary-button" onClick={() => setModal('receive')}><Plus size={16} /> Receive</button></div><section className="wallet-total"><span>Total portfolio value</span><strong>{showBalance ? money(assetsValue) : '••••••'}</strong><button onClick={() => setShowBalance(!showBalance)}>{showBalance ? <Eye size={16} /> : <EyeOff size={16} />}</button></section><section className="panel wallet-assets"><div className="panel-heading"><h2>Assets</h2><span className="eyebrow">3 ASSETS</span></div>{initialAssets.map(asset => <div className="wallet-asset" key={asset.ticker}><div className="coin-icon" style={{ background: asset.color }}>{asset.icon}</div><div className="asset-name"><strong>{asset.name}</strong><span>{asset.ticker}</span></div><div className="asset-value"><strong>{money(asset.value)}</strong><span>{asset.amount} {asset.ticker}</span></div></div>)}</section><p className="demo-note"><ShieldCheck size={15} /> Cryptocurrency prices and holdings are illustrative demo data.</p></div>}

          {tab === 'Cards' && <div className="subpage"><div className="page-heading"><div><div className="eyebrow">PAYMENTS</div><h1>Your cards</h1><p>A simple place to keep track of your cards.</p></div><button className="primary-button" onClick={() => notify('Card issuing is not available in this demo')}><Plus size={16} /> Add card</button></div><div className="bank-card"><div className="bank-card-top"><span className="brand small-brand"><span className="brand-mark"><span /></span><span>TITAN</span></span><span>DEBIT</span></div><div className="card-chip" /><div className="card-number">•••• &nbsp; •••• &nbsp; •••• &nbsp; 2048</div><div className="bank-card-bottom"><span>META ODEDE</span><span>VISA</span></div></div><p className="demo-note"><ShieldCheck size={15} /> This is a visual sample card, not a payment instrument.</p></div>}
        </div>
        <footer className="footer"><span>© {today.getFullYear()} Titan Finance</span><span>Demo environment · No real funds</span></footer>
      </main>

      {modal && <ModalView modal={modal} amount={amount} setAmount={setAmount} onClose={() => setModal(null)} onAction={handleAction} onNotify={notify} onLogout={logout} />}
      {toast && <div className="toast"><Check size={16} />{toast}</div>}
    </div>
  )
}

function TransactionList({ items }: { items: Transaction[] }) {
  return <div className="transaction-list">{items.map(item => <div className="transaction-row" key={item.id}><div className={`transaction-icon ${item.kind}`}>{item.kind === 'income' ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</div><div className="transaction-name"><strong>{item.name}</strong><span>{item.detail}</span></div><span className="transaction-category">{item.category}</span><span className="transaction-date">{item.date}</span><strong className={`transaction-amount ${item.kind}`}>{item.kind === 'income' ? '+' : '−'}{money(item.amount)}</strong></div>)}</div>
}

function Login({ onLogin }: { onLogin: () => void }) {
  return <div className="login-page"><div className="login-left"><a className="brand" href="#"><span className="brand-mark"><span /></span><span>TITAN</span></a><div className="login-message"><span className="eyebrow">A CLEARER VIEW OF MONEY</span><h1>Make your money<br />make sense.</h1><p>Your cash and crypto, brought together in one simple place.</p><div className="login-art"><div className="art-core">T<span>.</span></div></div></div><span className="login-legal">A demo experience. No real accounts or funds.</span></div><div className="login-right"><div className="login-form"><div className="login-symbol"><Wallet size={22} /></div><h2>Welcome to Titan</h2><p>Your financial overview starts here.</p><button className="primary-button login-button" onClick={onLogin}>Explore demo account <ArrowUpRight size={16} /></button><div className="secure-note"><ShieldCheck size={15} /> Demo sign-in. No credentials are sent anywhere.</div></div></div></div>
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
