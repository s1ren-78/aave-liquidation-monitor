import { Contract } from 'ethers';
import { getProvider, CHAINLINK_ETH_USD_FEED } from './provider';
import { ChainlinkRoundData, PriceData } from '@/types';

// Chainlink Aggregator V3 ABI (only the functions we need)
const CHAINLINK_AGGREGATOR_ABI = [
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// Get Chainlink price feed contract instance
function getChainlinkFeed(): Contract {
  const provider = getProvider();
  return new Contract(CHAINLINK_ETH_USD_FEED, CHAINLINK_AGGREGATOR_ABI, provider);
}

// Fetch latest ETH/USD price from Chainlink
export async function getEthUsdPrice(): Promise<PriceData> {
  const feed = getChainlinkFeed();

  const [roundData, decimals] = await Promise.all([
    feed.latestRoundData(),
    feed.decimals(),
  ]);

  const [, answer, , updatedAt] = roundData;

  // Convert price to number with proper decimals
  const price = Number(answer) / Math.pow(10, Number(decimals));

  return {
    price,
    timestamp: Number(updatedAt),
  };
}

// Get raw round data from Chainlink
export async function getLatestRoundData(): Promise<ChainlinkRoundData> {
  const feed = getChainlinkFeed();
  const [roundId, answer, startedAt, updatedAt, answeredInRound] = await feed.latestRoundData();

  return {
    roundId,
    answer,
    startedAt,
    updatedAt,
    answeredInRound,
  };
}
