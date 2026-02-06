import { AaveUserData, PositionData, LiquidationChartData } from '@/types';

// Aave uses 8 decimals for USD values in base currency
const BASE_CURRENCY_DECIMALS = 8;
// Health factor has 18 decimals
const HEALTH_FACTOR_DECIMALS = 18;
// Threshold/LTV have 4 decimals (basis points)
const PERCENTAGE_DECIMALS = 4;

// Convert bigint to number with decimals
export function toNumber(value: bigint, decimals: number): number {
  return Number(value) / Math.pow(10, decimals);
}

// Convert Aave raw data to formatted position data
export function formatAaveUserData(userData: AaveUserData, ethPrice: number): PositionData {
  const totalCollateralUSD = toNumber(userData.totalCollateralBase, BASE_CURRENCY_DECIMALS);
  const totalDebtUSD = toNumber(userData.totalDebtBase, BASE_CURRENCY_DECIMALS);
  const healthFactor = toNumber(userData.healthFactor, HEALTH_FACTOR_DECIMALS);
  const liquidationThreshold = toNumber(userData.currentLiquidationThreshold, PERCENTAGE_DECIMALS) * 100;
  const ltv = toNumber(userData.ltv, PERCENTAGE_DECIMALS) * 100;

  // Calculate estimated liquidation price
  // This is a simplified calculation assuming all collateral is ETH
  // Liquidation occurs when: collateralValue * liquidationThreshold = debtValue
  // So: ethPrice * ethAmount * threshold = debtValue
  // Liquidation price = debtValue / (ethAmount * threshold)
  // ethAmount = collateralValue / currentEthPrice
  let estimatedLiquidationPrice: number | null = null;

  if (totalCollateralUSD > 0 && totalDebtUSD > 0 && liquidationThreshold > 0) {
    const ethAmount = totalCollateralUSD / ethPrice;
    estimatedLiquidationPrice = totalDebtUSD / (ethAmount * (liquidationThreshold / 100));
  }

  return {
    address: userData.address,
    healthFactor: healthFactor > 1e10 ? Infinity : healthFactor,
    totalCollateralUSD,
    totalDebtUSD,
    liquidationThreshold,
    ltv,
    estimatedLiquidationPrice,
    isAtRisk: healthFactor < 1.5 && healthFactor > 0,
  };
}

// Calculate liquidation chart data from positions
export function calculateLiquidationChartData(
  positions: PositionData[],
  currentEthPrice: number,
  priceRange: { min: number; max: number; step: number }
): LiquidationChartData[] {
  const chartData: LiquidationChartData[] = [];

  // Filter positions with valid liquidation prices
  const positionsWithLiqPrice = positions.filter(
    (p) => p.estimatedLiquidationPrice !== null && p.estimatedLiquidationPrice > 0
  );

  for (let price = priceRange.min; price <= priceRange.max; price += priceRange.step) {
    // Count positions that would be liquidated at this price
    const liquidatedPositions = positionsWithLiqPrice.filter(
      (p) => p.estimatedLiquidationPrice! >= price
    );

    // Sum up the collateral value of positions that would be liquidated
    const cumulativeLiquidation = liquidatedPositions.reduce(
      (sum, p) => sum + p.totalCollateralUSD,
      0
    );

    chartData.push({
      price,
      cumulativeLiquidation,
      positions: liquidatedPositions.length,
    });
  }

  return chartData;
}

// Calculate price range for chart based on current price
export function calculatePriceRange(currentPrice: number): { min: number; max: number; step: number } {
  // Show from 50% below to current price
  const min = Math.floor(currentPrice * 0.5 / 100) * 100;
  const max = Math.ceil(currentPrice * 1.1 / 100) * 100;
  const step = Math.max(50, Math.floor((max - min) / 20 / 50) * 50);

  return { min, max, step };
}

// Calculate new health factor at a given ETH price
export function calculateHealthFactorAtPrice(
  position: PositionData,
  currentEthPrice: number,
  targetEthPrice: number
): number {
  if (position.totalDebtUSD === 0) return Infinity;

  // Assuming collateral is ETH, calculate new collateral value at target price
  const priceRatio = targetEthPrice / currentEthPrice;
  const newCollateralUSD = position.totalCollateralUSD * priceRatio;

  // Health Factor = (Collateral * Liquidation Threshold) / Debt
  return (newCollateralUSD * (position.liquidationThreshold / 100)) / position.totalDebtUSD;
}
