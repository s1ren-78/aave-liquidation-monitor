import { ETHERSCAN_API_KEY, ETHERSCAN_API_URL } from './provider';
import { Transaction, EtherscanTxResponse } from '@/types';

// Fetch recent transactions for an address from Etherscan
export async function getRecentTransactions(
  address: string,
  page = 1,
  offset = 10
): Promise<Transaction[]> {
  const params = new URLSearchParams({
    module: 'account',
    action: 'txlist',
    address,
    startblock: '0',
    endblock: '99999999',
    page: page.toString(),
    offset: offset.toString(),
    sort: 'desc',
    apikey: ETHERSCAN_API_KEY,
  });

  const response = await fetch(`${ETHERSCAN_API_URL}?${params}`);
  const data: EtherscanTxResponse = await response.json();

  if (data.status !== '1' || !Array.isArray(data.result)) {
    return [];
  }

  return data.result.map((tx) => ({
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value,
    timestamp: parseInt(tx.timeStamp, 10),
    blockNumber: parseInt(tx.blockNumber, 10),
    methodId: tx.methodId || tx.input.slice(0, 10),
    functionName: tx.functionName?.split('(')[0] || undefined,
    isError: tx.isError === '1',
  }));
}

// Get Etherscan transaction URL
export function getEtherscanTxUrl(hash: string): string {
  return `https://etherscan.io/tx/${hash}`;
}

// Get Etherscan address URL
export function getEtherscanAddressUrl(address: string): string {
  return `https://etherscan.io/address/${address}`;
}

// Get DeBank profile URL
export function getDeBankUrl(address: string): string {
  return `https://debank.com/profile/${address}`;
}
