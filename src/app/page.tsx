'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import AddressInput from '@/components/AddressInput';
import PriceDisplay from '@/components/PriceDisplay';
import PositionTable from '@/components/PositionTable';
import LiquidationChart from '@/components/LiquidationChart';
import TransactionList from '@/components/TransactionList';
import { useEthPrice } from '@/hooks/useEthPrice';
import { useAavePositions } from '@/hooks/useAavePositions';

const STORAGE_KEY = 'aave-monitor-addresses';

export default function Home() {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load addresses from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAddresses(parsed);
        }
      } catch (e) {
        console.error('Failed to parse stored addresses:', e);
      }
    }
  }, []);

  // Save addresses to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  // Hooks for data fetching
  const {
    price: ethPrice,
    loading: priceLoading,
    error: priceError,
    refetch: refetchPrice,
    lastUpdated: priceLastUpdated,
  } = useEthPrice(30000);

  const {
    positions,
    loading: positionsLoading,
    error: positionsError,
    refetch: refetchPositions,
    lastUpdated: positionsLastUpdated,
  } = useAavePositions(addresses, ethPrice, 30000);

  // Combined refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchPrice(), refetchPositions()]);
    setIsRefreshing(false);
  }, [refetchPrice, refetchPositions]);

  // Address management
  const handleAddAddress = useCallback((address: string) => {
    setAddresses((prev) => [...prev, address]);
  }, []);

  const handleRemoveAddress = useCallback((address: string) => {
    setAddresses((prev) => prev.filter((a) => a !== address));
    if (selectedAddress === address) {
      setSelectedAddress(null);
    }
  }, [selectedAddress]);

  // Get the most recent update time
  const lastUpdated = positionsLastUpdated || priceLastUpdated;

  return (
    <div className="min-h-screen">
      <Header
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing || priceLoading || positionsLoading}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left column: Address input */}
          <div className="lg:col-span-2">
            <AddressInput
              addresses={addresses}
              onAddAddress={handleAddAddress}
              onRemoveAddress={handleRemoveAddress}
              selectedAddress={selectedAddress}
              onSelectAddress={setSelectedAddress}
            />
          </div>

          {/* Right column: ETH Price */}
          <div>
            <PriceDisplay
              price={ethPrice}
              loading={priceLoading}
              error={priceError}
              lastUpdated={priceLastUpdated}
              onRefresh={refetchPrice}
            />
          </div>
        </div>

        {/* Position Table */}
        <div className="mb-6">
          <PositionTable
            positions={positions}
            loading={positionsLoading}
            error={positionsError}
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
          />
        </div>

        {/* Bottom section: Chart and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiquidationChart positions={positions} currentEthPrice={ethPrice} />
          <TransactionList selectedAddress={selectedAddress} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--notion-border)] mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[var(--notion-muted)] text-sm">
            Aave V3 Monitor | Ethereum Mainnet | Refresh every 30 seconds
          </p>
        </div>
      </footer>
    </div>
  );
}
