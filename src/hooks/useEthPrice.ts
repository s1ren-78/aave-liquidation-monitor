'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEthUsdPrice } from '@/lib/chainlink';
import { PriceData } from '@/types';

interface UseEthPriceResult {
  price: number;
  priceData: PriceData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useEthPrice(refreshInterval = 30000): UseEthPriceResult {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrice = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getEthUsdPrice();
      setPriceData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching ETH price:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch price');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchPrice, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchPrice, refreshInterval]);

  return {
    price: priceData?.price ?? 0,
    priceData,
    loading,
    error,
    refetch: fetchPrice,
    lastUpdated,
  };
}
