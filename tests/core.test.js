import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTotals,
  filterAndSortTransactions,
  formatDate,
  formatMoney,
  formatTime,
  modalVariant,
  normalizeData
} from '../src/core.js';

const fallback = {
  profile: { name: 'Sample User', email: 'sample@example.test', initials: 'SU' },
  accounts: [{ id: 'a', name: 'Sample', type: 'Checking', balance: 100, currency: 'USD', number: '•••• 0001', color: 'gold' }],
  assets: [{ id: 'btc', name: 'Bitcoin', symbol: 'BTC', quantity: 1, network: 'Bitcoin', color: 'bitcoin' }],
  cards: [], transactions: []
};

const transactions = [
  { id: 'later', name: 'Salary', detail: 'Studio', category: 'Income', method: 'Transfer', account: 'Everyday', type: 'income', amount: 1200, date: '2026-04-02T12:00:00Z' },
  { id: 'earlier', name: 'Coffee', detail: 'Cafe', category: 'Food', method: 'Card', account: 'Everyday', type: 'expense', amount: 4.5, date: '2026-04-01T12:00:00Z' }
];

test('calculates account and transaction totals from their source rows', () => {
  assert.deepEqual(calculateTotals([{ balance: 10.25 }, { balance: 4 }], transactions), {
    cash: 14.25, income: 1200, spending: 4.5, net: 1195.5
  });
});

test('formats currency and dates consistently and handles invalid values', () => {
  assert.equal(formatMoney(1234.5), '$1,234.50');
  assert.equal(formatMoney(-2), '-$2.00');
  assert.equal(formatMoney(Number.NaN), '—');
  assert.equal(formatDate('not a date'), 'Date unavailable');
  assert.equal(formatTime('not a date'), 'Date unavailable');
});

test('filters without mutating input and sorts in the requested direction', () => {
  assert.deepEqual(filterAndSortTransactions(transactions, { search: ' cafe ', filter: 'expense' }).map(row => row.id), ['earlier']);
  assert.deepEqual(filterAndSortTransactions(transactions, { sort: 'oldest' }).map(row => row.id), ['earlier', 'later']);
  assert.deepEqual(transactions.map(row => row.id), ['later', 'earlier']);
});

test('normalizes recoverable data and falls back for damaged records', () => {
  const result = normalizeData({
    profile: { name: 'Ari Example', email: 'ari@example.test' },
    accounts: [{ id: 'good', name: 'Good', type: 'Checking', balance: 10 }, { id: 'bad', balance: 'NaN' }],
    transactions: [], cards: [], assets: 'corrupt'
  }, fallback);
  assert.equal(result.recovered, true);
  assert.equal(result.data.profile.initials, 'AE');
  assert.deepEqual(result.data.accounts.map(row => row.id), ['good']);
  assert.equal(result.data.assets[0].symbol, 'BTC');
  assert.deepEqual(normalizeData('{broken', fallback).data, fallback);
});

test('maps supported modal states to their intended presentation variants', () => {
  assert.equal(modalVariant('account'), 'account');
  assert.equal(modalVariant('transfer'), 'send');
  assert.equal(modalVariant('add-funds'), 'add');
  assert.equal(modalVariant('transaction'), 'details');
});
