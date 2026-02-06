'use client';

import { PositionData } from '@/types';
import {
  formatAddress,
  formatUSD,
  formatHealthFactor,
  getHealthFactorColor,
} from '@/utils/format';
import { getEtherscanAddressUrl, getDeBankUrl } from '@/lib/etherscan';

interface PositionTableProps {
  positions: PositionData[];
  loading: boolean;
  error: string | null;
  selectedAddress: string | null;
  onSelectAddress: (address: string | null) => void;
}

export default function PositionTable({
  positions,
  loading,
  error,
  selectedAddress,
  onSelectAddress,
}: PositionTableProps) {
  const formatTokenAmount = (value: number): string => {
    if (value === 0) return '0';
    if (value < 0.0001) return '<0.0001';
    if (value < 1) return value.toFixed(4);
    if (value < 1000) return value.toFixed(2);
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Positions</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (positions.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Positions</h2>
        <p className="text-gray-500 text-center py-8">
          Add addresses above to view their AAVE V3 positions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loading && positions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
          Loading positions...
        </div>
      ) : (
        positions.map((position) => {
          const suppliedAssets =
            position.assets?.filter((asset) => asset.collateralUSD > 0) || [];
          const borrowedAssets =
            position.assets?.filter((asset) => asset.debtUSD > 0) || [];

          return (
            <div
              key={position.address}
              className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-colors ${
                selectedAddress === position.address
                  ? 'ring-2 ring-aave-purple/40'
                  : 'hover:shadow-lg'
              } ${position.isAtRisk ? 'border border-red-200' : 'border border-transparent'}`}
              onClick={() =>
                onSelectAddress(
                  selectedAddress === position.address ? null : position.address
                )
              }
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-aave-purple to-aave-blue flex items-center justify-center text-white text-xs font-bold">
                    A
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">Aave V3</span>
                      <span className="text-gray-400 text-xs">Ethereum</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatAddress(position.address, 6)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total Supplied</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {formatUSD(position.totalCollateralUSD)}
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 flex items-center justify-between text-sm">
                <div className="text-gray-600">Health Rate</div>
                <div className={`font-semibold ${getHealthFactorColor(position.healthFactor)}`}>
                  {formatHealthFactor(position.healthFactor)}
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Supplied
                </div>
                <div className="divide-y divide-gray-100">
                  {suppliedAssets.length === 0 ? (
                    <div className="py-3 text-sm text-gray-400">No supplied assets</div>
                  ) : (
                    suppliedAssets.map((asset) => {
                      const amount =
                        asset.priceUSD > 0 ? asset.collateralUSD / asset.priceUSD : 0;
                      return (
                        <div key={`supplied-${asset.symbol}`} className="py-3 flex items-center">
                          <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold">
                            {asset.symbol.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-800">
                              {asset.symbol}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-700">
                              {formatTokenAmount(amount)} {asset.symbol}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatUSD(asset.collateralUSD)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Borrowed
                </div>
                <div className="divide-y divide-gray-100">
                  {borrowedAssets.length === 0 ? (
                    <div className="py-3 text-sm text-gray-400">No borrowed assets</div>
                  ) : (
                    borrowedAssets.map((asset) => {
                      const amount =
                        asset.priceUSD > 0 ? asset.debtUSD / asset.priceUSD : 0;
                      return (
                        <div key={`borrowed-${asset.symbol}`} className="py-3 flex items-center">
                          <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold">
                            {asset.symbol.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-800">
                              {asset.symbol}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-700">
                              {formatTokenAmount(amount)} {asset.symbol}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatUSD(asset.debtUSD)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Total Borrowed: {formatUSD(position.totalDebtUSD)}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={getEtherscanAddressUrl(position.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-aave-purple transition-colors"
                    title="View on Etherscan"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  </a>
                  <a
                    href={getDeBankUrl(position.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-aave-blue transition-colors"
                    title="View on DeBank"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
