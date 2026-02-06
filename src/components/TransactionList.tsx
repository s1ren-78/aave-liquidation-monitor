'use client';

import { Transaction } from '@/types';
import { useTransactions } from '@/hooks/useTransactions';
import {
  formatAddress,
  formatRelativeTime,
  formatEthValue,
} from '@/utils/format';
import { getEtherscanTxUrl, getEtherscanAddressUrl, getDeBankUrl } from '@/lib/etherscan';

interface TransactionListProps {
  selectedAddress: string | null;
}

export default function TransactionList({ selectedAddress }: TransactionListProps) {
  const { transactions, loading, error } = useTransactions(selectedAddress);

  if (!selectedAddress) {
    return (
      <div className="bg-white rounded-xl border border-[var(--notion-border)] p-6">
        <h2 className="text-base font-semibold text-[var(--notion-text)] mb-3">
          Recent Transactions
        </h2>
        <p className="text-[var(--notion-muted)] text-center py-8 text-sm">
          Select an address to view its recent transactions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--notion-border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[var(--notion-text)]">
          Recent Transactions
        </h2>
        <div className="flex items-center gap-2">
          <a
            href={getEtherscanAddressUrl(selectedAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--notion-text)] hover:underline"
          >
            Etherscan
          </a>
          <span className="text-[var(--notion-border)]">|</span>
          <a
            href={getDeBankUrl(selectedAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--notion-text)] hover:underline"
          >
            DeBank
          </a>
        </div>
      </div>

      {error ? (
        <p className="text-red-600">{error}</p>
      ) : loading ? (
        <div className="text-center py-8 text-[var(--notion-muted)] text-sm">
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-[var(--notion-muted)] text-center py-8 text-sm">
          No transactions found
        </p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <TransactionItem key={tx.hash} transaction={tx} address={selectedAddress} />
          ))}
        </div>
      )}
    </div>
  );
}

function TransactionItem({
  transaction,
  address,
}: {
  transaction: Transaction;
  address: string;
}) {
  const isOutgoing = transaction.from.toLowerCase() === address.toLowerCase();

  return (
    <a
      href={getEtherscanTxUrl(transaction.hash)}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 rounded-md border border-[var(--notion-border)] hover:bg-[#f7f6f3] transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-md border border-[var(--notion-border)] flex items-center justify-center ${
              isOutgoing ? 'bg-[#f9ecec] text-[#a33a3a]' : 'bg-[#edf5ef] text-[#2e6b42]'
            }`}
          >
            {isOutgoing ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-[var(--notion-text)]">
                {transaction.functionName || (isOutgoing ? 'Sent' : 'Received')}
              </span>
              {transaction.isError && (
                <span className="px-2 py-0.5 text-xs bg-[#f9ecec] text-[#a33a3a] rounded-full">
                  Failed
                </span>
              )}
            </div>
            <div className="text-sm text-[var(--notion-muted)]">
              {isOutgoing ? 'To: ' : 'From: '}
              {formatAddress(isOutgoing ? transaction.to : transaction.from, 6)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium text-[var(--notion-text)]">
            {formatEthValue(transaction.value)}
          </div>
          <div className="text-sm text-[var(--notion-muted)]">
            {formatRelativeTime(transaction.timestamp)}
          </div>
        </div>
      </div>
    </a>
  );
}
