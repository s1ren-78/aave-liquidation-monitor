'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMultipleUsersAccountData, getMultipleDetailedPositions } from '@/lib/aave';
import { formatAaveUserData } from '@/utils/calculations';
import { PositionData } from '@/types';

interface UseAavePositionsResult {
  positions: PositionData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useAavePositions(
  addresses: string[],
  ethPrice: number,
  refreshInterval = 30000
): UseAavePositionsResult {
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPositions = useCallback(async () => {
    if (addresses.length === 0 || ethPrice === 0) {
      setPositions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [userData, detailedPositions] = await Promise.all([
        getMultipleUsersAccountData(addresses),
        getMultipleDetailedPositions(addresses),
      ]);

      const detailedByAddress = new Map(
        detailedPositions.map((p) => [p.address.toLowerCase(), p])
      );

      const formattedPositions = userData.map((data) =>
        formatAaveUserData(data, ethPrice, detailedByAddress.get(data.address.toLowerCase()))
      );
      setPositions(formattedPositions);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching Aave positions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch positions');
    } finally {
      setLoading(false);
    }
  }, [addresses, ethPrice]);

  // Initial fetch and refetch when dependencies change
  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval > 0 && addresses.length > 0) {
      const interval = setInterval(fetchPositions, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchPositions, refreshInterval, addresses.length]);

  return {
    positions,
    loading,
    error,
    refetch: fetchPositions,
    lastUpdated,
  };
}
