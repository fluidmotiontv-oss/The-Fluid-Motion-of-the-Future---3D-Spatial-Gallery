/**
 * Native Electronic Currency Register (NECR)
 * Anchor for all ecosystem transactions and value registration.
 */

export interface Transaction {
  id: string;
  timestamp: string; // ISO
  d9Timestamp: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  status: 'pending' | 'settled' | 'registered';
}

export interface LedgerState {
  balance: number;
  transactions: Transaction[];
  lastUpdate: string;
}

const STORAGE_KEY = 'fluid_motion_nec_ledger';

export const economicLedger = {
  getLedger(): LedgerState {
    if (typeof window === 'undefined') return { balance: 0, transactions: [], lastUpdate: '' };
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const initial: LedgerState = {
        balance: 1440, // Initial endowment matching daily minute pool
        transactions: [
          {
            id: 'init-' + Date.now(),
            timestamp: new Date().toISOString(),
            d9Timestamp: '00:00:00 D9',
            amount: 1440,
            type: 'credit',
            description: 'Initial Daily Allocation Anchor',
            status: 'registered'
          }
        ],
        lastUpdate: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(saved);
  },

  registerTransaction(description: string, amount: number, type: 'debit' | 'credit', d9Time: string) {
    const ledger = this.getLedger();
    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      d9Timestamp: d9Time,
      amount,
      type,
      description,
      status: 'registered'
    };

    ledger.transactions.unshift(newTx);
    if (type === 'credit') ledger.balance += amount;
    else ledger.balance -= amount;
    ledger.lastUpdate = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
    return ledger;
  },

  getBalance(): number {
    return this.getLedger().balance;
  }
};
