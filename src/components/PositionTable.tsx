'use client';

import { PositionData } from '@/types';
import {
  formatAddress,
  formatUSD,
  formatHealthFactor,
  getHealthFactorColor,
  formatPercent,
  formatEthPrice,
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Positions</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Health Factor
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collateral
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debt
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liq. Threshold
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Est. Liq. Price
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Links
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && positions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Loading positions...
                </td>
              </tr>
            ) : (
              positions.map((position) => (
                <tr
                  key={position.address}
                  className={`cursor-pointer transition-colors ${
                    selectedAddress === position.address
                      ? 'bg-aave-purple/5'
                      : 'hover:bg-gray-50'
                  } ${position.isAtRisk ? 'bg-red-50' : ''}`}
                  onClick={() =>
                    onSelectAddress(
                      selectedAddress === position.address ? null : position.address
                    )
                  }
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aave-purple to-aave-blue flex items-center justify-center text-white text-xs font-bold">
                        {position.address.slice(2, 4).toUpperCase()}
                      </div>
                      <span className="font-mono text-sm">
                        {formatAddress(position.address, 6)}
                      </span>
                      {position.isAtRisk && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                          At Risk
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${getHealthFactorColor(
                      position.healthFactor
                    )}`}
                  >
                    {formatHealthFactor(position.healthFactor)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    {formatUSD(position.totalCollateralUSD)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    {formatUSD(position.totalDebtUSD)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {formatPercent(position.liquidationThreshold)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    {position.estimatedLiquidationPrice
                      ? formatEthPrice(position.estimatedLiquidationPrice)
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
