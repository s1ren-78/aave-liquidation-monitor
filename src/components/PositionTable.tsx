'use client';

import { PositionData } from '@/types';
import { formatAddress, formatUSD, formatHealthFactor, getHealthFactorColor } from '@/utils/format';
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
      <div className="bg-white rounded-xl border border-[var(--notion-border)] p-6">
        <h2 className="text-base font-semibold text-[var(--notion-text)] mb-3">Positions</h2>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (positions.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-xl border border-[var(--notion-border)] p-6">
        <h2 className="text-base font-semibold text-[var(--notion-text)] mb-3">Positions</h2>
        <p className="text-[var(--notion-muted)] text-center py-6 text-sm">
          Add addresses above to view their Aave V3 positions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loading && positions.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--notion-border)] p-6 text-center text-[var(--notion-muted)]">
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
              className={`bg-white rounded-xl border border-[var(--notion-border)] overflow-hidden cursor-pointer transition-colors ${
                selectedAddress === position.address
                  ? 'ring-2 ring-black/10'
                  : 'hover:bg-[#faf9f7]'
              } ${position.isAtRisk ? 'border-red-200' : ''}`}
              onClick={() =>
                onSelectAddress(
                  selectedAddress === position.address ? null : position.address
                )
              }
            >
              <div className="px-6 py-5 border-b border-[var(--notion-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#f0efec] border border-[var(--notion-border)] flex items-center justify-center text-[var(--notion-muted)] text-xs font-semibold">
                    A
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--notion-text)]">Aave V3</span>
                      <span className="text-[var(--notion-muted)] text-xs">Ethereum</span>
                    </div>
                    <div className="text-xs text-[var(--notion-muted)] font-mono">
                      {formatAddress(position.address, 6)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--notion-muted)]">Total Supplied</div>
                  <div className="text-lg font-semibold text-[var(--notion-text)]">
                    {formatUSD(position.totalCollateralUSD)}
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-[#f7f6f3] flex items-center justify-between text-sm">
                <div className="text-[var(--notion-muted)]">Health Rate</div>
                <div className={`font-semibold ${getHealthFactorColor(position.healthFactor)}`}>
                  {formatHealthFactor(position.healthFactor)}
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="text-xs uppercase tracking-wider text-[var(--notion-muted)] mb-2">
                  Supplied
                </div>
                <div className="divide-y divide-[var(--notion-border)]">
                  {suppliedAssets.length === 0 ? (
                    <div className="py-3 text-sm text-[var(--notion-muted)]">
                      No supplied assets
                    </div>
                  ) : (
                    suppliedAssets.map((asset) => {
                      const amount =
                        asset.priceUSD > 0 ? asset.collateralUSD / asset.priceUSD : 0;
                      return (
                        <div key={`supplied-${asset.symbol}`} className="py-3 flex items-center">
                          <div className="w-7 h-7 rounded-md bg-[#f0efec] text-[var(--notion-muted)] border border-[var(--notion-border)] flex items-center justify-center text-xs font-semibold">
                            {asset.symbol.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-[var(--notion-text)]">
                              {asset.symbol}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-[var(--notion-text)]">
                              {formatTokenAmount(amount)} {asset.symbol}
                            </div>
                            <div className="text-xs text-[var(--notion-muted)]">
                              {formatUSD(asset.collateralUSD)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[var(--notion-border)]">
                <div className="text-xs uppercase tracking-wider text-[var(--notion-muted)] mb-2">
                  Borrowed
                </div>
                <div className="divide-y divide-[var(--notion-border)]">
                  {borrowedAssets.length === 0 ? (
                    <div className="py-3 text-sm text-[var(--notion-muted)]">
                      No borrowed assets
                    </div>
                  ) : (
                    borrowedAssets.map((asset) => {
                      const amount =
                        asset.priceUSD > 0 ? asset.debtUSD / asset.priceUSD : 0;
                      return (
                        <div key={`borrowed-${asset.symbol}`} className="py-3 flex items-center">
                          <div className="w-7 h-7 rounded-md bg-[#f0efec] text-[var(--notion-muted)] border border-[var(--notion-border)] flex items-center justify-center text-xs font-semibold">
                            {asset.symbol.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-[var(--notion-text)]">
                              {asset.symbol}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-[var(--notion-text)]">
                              {formatTokenAmount(amount)} {asset.symbol}
                            </div>
                            <div className="text-xs text-[var(--notion-muted)]">
                              {formatUSD(asset.debtUSD)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[var(--notion-border)] flex items-center justify-between">
                <div className="text-xs text-[var(--notion-muted)]">
                  Total Borrowed: {formatUSD(position.totalDebtUSD)}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={getEtherscanAddressUrl(position.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[var(--notion-muted)] hover:text-[var(--notion-text)] transition-colors"
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
                    className="text-[var(--notion-muted)] hover:text-[var(--notion-text)] transition-colors"
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
