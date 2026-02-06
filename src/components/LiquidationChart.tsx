'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { PositionData, LiquidationChartData } from '@/types';
import { calculateLiquidationChartData, calculatePriceRange } from '@/utils/calculations';
import { formatUSD } from '@/utils/format';

interface LiquidationChartProps {
  positions: PositionData[];
  currentEthPrice: number;
}

export default function LiquidationChart({
  positions,
  currentEthPrice,
}: LiquidationChartProps) {
  if (currentEthPrice === 0 || positions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Liquidation Risk by ETH Price
        </h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          {currentEthPrice === 0
            ? 'Loading price data...'
            : 'Add addresses to view liquidation risk chart'}
        </div>
      </div>
    );
  }

  const priceRange = calculatePriceRange(currentEthPrice);
  const chartData = calculateLiquidationChartData(positions, currentEthPrice, priceRange);

  // Check if there's any meaningful data
  const hasLiquidationData = chartData.some((d) => d.cumulativeLiquidation > 0);

  if (!hasLiquidationData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Liquidation Risk by ETH Price
        </h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No positions with liquidation risk in the current price range
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Liquidation Risk by ETH Price
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Cumulative collateral value at risk of liquidation as ETH price decreases
      </p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorLiquidation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="price"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              tickFormatter={(value) => formatUSD(value)}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip
              formatter={(value: number) => [formatUSD(value), 'At Risk']}
              labelFormatter={(label) => `ETH Price: $${Number(label).toLocaleString()}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <ReferenceLine
              x={currentEthPrice}
              stroke="#B6509E"
              strokeDasharray="5 5"
              label={{
                value: 'Current',
                position: 'top',
                fill: '#B6509E',
                fontSize: 12,
              }}
            />
            <Area
              type="stepAfter"
              dataKey="cumulativeLiquidation"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorLiquidation)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span>Cumulative liquidation value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0 border-t-2 border-dashed border-aave-purple" />
          <span>Current ETH price</span>
        </div>
      </div>
    </div>
  );
}
