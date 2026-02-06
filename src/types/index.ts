// User account data from Aave
export interface AaveUserData {
  address: string;
  totalCollateralBase: bigint;
  totalDebtBase: bigint;
  availableBorrowsBase: bigint;
  currentLiquidationThreshold: bigint;
  ltv: bigint;
  healthFactor: bigint;
}

// Asset category for price correlation
export type AssetCategory = 'eth-correlated' | 'btc-correlated' | 'stable' | 'other';

// Individual asset position
export interface AssetPosition {
  symbol: string;
  address: string;
  category: AssetCategory;
  collateralUSD: number;
  debtUSD: number;
  liquidationThreshold: number;
  priceUSD: number;
  amount: number;
}

// Detailed user position with asset breakdown
export interface DetailedUserPosition {
  address: string;
  assets: AssetPosition[];
  // Aggregated by category
  ethCorrelatedCollateralUSD: number;
  btcCorrelatedCollateralUSD: number;
  stableCollateralUSD: number;
  otherCollateralUSD: number;
  // Debt breakdown
  stableDebtUSD: number;
  nonStableDebtUSD: number;
}

// Formatted position data for display
export interface PositionData {
  address: string;
  healthFactor: number;
  totalCollateralUSD: number;
  totalDebtUSD: number;
  liquidationThreshold: number;
  ltv: number;
  estimatedLiquidationPrice: number | null;
  isAtRisk: boolean;
  // New fields for detailed breakdown
  ethCorrelatedCollateralUSD?: number;
  ethCorrelatedDebtUSD?: number;
  nonEthDebtUSD?: number;
  ethWeightedCollateralUSD?: number;
  nonEthWeightedCollateralUSD?: number;
  stableCollateralUSD?: number;
  assets?: AssetPosition[];
}

// ETH price data
export interface PriceData {
  price: number;
  timestamp: number;
  change24h?: number;
}

// Transaction data from Etherscan
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
  methodId: string;
  functionName?: string;
  isError: boolean;
}

// Chart data point for liquidation visualization
export interface LiquidationChartData {
  price: number;
  cumulativeLiquidation: number;
  positions: number;
}

// Address entry for monitoring
export interface MonitoredAddress {
  address: string;
  label?: string;
  addedAt: number;
}

// API response types
export interface EtherscanTxResponse {
  status: string;
  message: string;
  result: EtherscanTransaction[];
}

export interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  input: string;
  methodId: string;
  functionName: string;
  isError: string;
}

// Chainlink price feed response
export interface ChainlinkRoundData {
  roundId: bigint;
  answer: bigint;
  startedAt: bigint;
  updatedAt: bigint;
  answeredInRound: bigint;
}
