import { JsonRpcProvider } from 'ethers';

// Alchemy RPC endpoint for Ethereum mainnet
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
  console.warn('NEXT_PUBLIC_ALCHEMY_API_KEY is not set. Some features may not work.');
}

const RPC_URL = ALCHEMY_API_KEY
  ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  : 'https://eth.llamarpc.com'; // Fallback to public RPC

// Create a singleton provider instance
let providerInstance: JsonRpcProvider | null = null;

export function getProvider(): JsonRpcProvider {
  if (!providerInstance) {
    providerInstance = new JsonRpcProvider(RPC_URL);
  }
  return providerInstance;
}

// Contract addresses for Ethereum Mainnet
export const AAVE_V3_POOL_ADDRESS = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2';
export const AAVE_V3_POOL_DATA_PROVIDER_ADDRESS = '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3';
export const CHAINLINK_ETH_USD_FEED = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';

// Etherscan API configuration
export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '';
export const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';
