// Format address for display (0x1234...5678)
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Format USD value with appropriate precision
export function formatUSD(value: number): string {
  if (value === 0) return '$0.00';
  if (value < 0.01) return '<$0.01';
  if (value < 1000) return `$${value.toFixed(2)}`;
  if (value < 1000000) return `$${(value / 1000).toFixed(2)}K`;
  if (value < 1000000000) return `$${(value / 1000000).toFixed(2)}M`;
  return `$${(value / 1000000000).toFixed(2)}B`;
}

// Format health factor with color indication
export function formatHealthFactor(hf: number): string {
  if (hf === Infinity || hf > 100) return '>100';
  if (hf < 0) return 'N/A';
  return hf.toFixed(2);
}

// Get health factor color class
export function getHealthFactorColor(hf: number): string {
  if (hf === Infinity || hf > 100) return 'text-green-500';
  if (hf >= 2) return 'text-green-500';
  if (hf >= 1.5) return 'text-yellow-500';
  if (hf >= 1.1) return 'text-orange-500';
  return 'text-red-500';
}

// Format percentage
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

// Format ETH price
export function formatEthPrice(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format timestamp to relative time
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

// Format timestamp to date string
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

// Validate Ethereum address
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Format ETH value from wei
export function formatEthValue(weiValue: string): string {
  const ethValue = Number(weiValue) / 1e18;
  if (ethValue === 0) return '0 ETH';
  if (ethValue < 0.001) return '<0.001 ETH';
  return `${ethValue.toFixed(4)} ETH`;
}
