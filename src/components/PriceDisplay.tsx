'use client';

import { formatEthPrice } from '@/utils/format';

interface PriceDisplayProps {
  price: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export default function PriceDisplay({
  price,
  loading,
  error,
  lastUpdated,
  onRefresh,
}: PriceDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">ETH Price</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1 text-gray-400 hover:text-aave-purple transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {loading && price === 0 ? '...' : formatEthPrice(price)}
            </span>
            <span className="text-sm text-gray-500">USD</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            via Chainlink Price Feed
            {lastUpdated && ` | ${lastUpdated.toLocaleTimeString()}`}
          </p>
        </>
      )}
    </div>
  );
}
