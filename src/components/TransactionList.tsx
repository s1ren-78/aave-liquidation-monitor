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
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Transactions
        </h2>
        <p className="text-gray-500 text-center py-8">
          Select an address to view its recent transactions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Transactions
        </h2>
        <div className="flex items-center gap-2">
          <a
            href={getEtherscanAddressUrl(selectedAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-aave-purple hover:underline"
          >
            Etherscan
          </a>
          <span className="text-gray-300">|</span>
          <a
            href={getDeBankUrl(selectedAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-aave-blue hover:underline"
          >
            DeBank
          </a>
        </div>
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <div className="text-center py-8 text-gray-500">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No transactions found</p>
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
      className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isOutgoing ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
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
              <span className="font-medium text-gray-900">
                {transaction.functionName || (isOutgoing ? 'Sent' : 'Received')}
              </span>
              {transaction.isError && (
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                  Failed
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {isOutgoing ? 'To: ' : 'From: '}
              {formatAddress(isOutgoing ? transaction.to : transaction.from, 6)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium text-gray-900">
            {formatEthValue(transaction.value)}
          </div>
          <div className="text-sm text-gray-500">
            {formatRelativeTime(transaction.timestamp)}
          </div>
        </div>
      </div>
    </a>
  );
}
