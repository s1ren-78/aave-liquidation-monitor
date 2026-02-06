import { Contract } from 'ethers';
import { getProvider, AAVE_V3_POOL_ADDRESS } from './provider';
import { AaveUserData } from '@/types';

// Aave V3 Pool ABI (only the functions we need)
const AAVE_V3_POOL_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserAccountData',
    outputs: [
      { internalType: 'uint256', name: 'totalCollateralBase', type: 'uint256' },
      { internalType: 'uint256', name: 'totalDebtBase', type: 'uint256' },
      { internalType: 'uint256', name: 'availableBorrowsBase', type: 'uint256' },
      { internalType: 'uint256', name: 'currentLiquidationThreshold', type: 'uint256' },
      { internalType: 'uint256', name: 'ltv', type: 'uint256' },
      { internalType: 'uint256', name: 'healthFactor', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// Get Aave Pool contract instance
function getAavePool(): Contract {
  const provider = getProvider();
  return new Contract(AAVE_V3_POOL_ADDRESS, AAVE_V3_POOL_ABI, provider);
}

// Fetch user account data from Aave V3
export async function getUserAccountData(address: string): Promise<AaveUserData> {
  const pool = getAavePool();

  const [
    totalCollateralBase,
    totalDebtBase,
    availableBorrowsBase,
    currentLiquidationThreshold,
    ltv,
    healthFactor,
  ] = await pool.getUserAccountData(address);

  return {
    address,
    totalCollateralBase,
    totalDebtBase,
    availableBorrowsBase,
    currentLiquidationThreshold,
    ltv,
    healthFactor,
  };
}

// Fetch multiple users' account data in parallel
export async function getMultipleUsersAccountData(addresses: string[]): Promise<AaveUserData[]> {
  const promises = addresses.map((address) => getUserAccountData(address));
  return Promise.all(promises);
}

// Check if an address has any Aave V3 position
export async function hasAavePosition(address: string): Promise<boolean> {
  const data = await getUserAccountData(address);
  return data.totalCollateralBase > BigInt(0) || data.totalDebtBase > BigInt(0);
}
