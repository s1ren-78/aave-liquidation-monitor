'use client';

import { useState } from 'react';
import { isValidAddress, formatAddress } from '@/utils/format';

interface AddressInputProps {
  addresses: string[];
  onAddAddress: (address: string) => void;
  onRemoveAddress: (address: string) => void;
  selectedAddress: string | null;
  onSelectAddress: (address: string | null) => void;
}

export default function AddressInput({
  addresses,
  onAddAddress,
  onRemoveAddress,
  selectedAddress,
  onSelectAddress,
}: AddressInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAddress = inputValue.trim().toLowerCase();

    if (!trimmedAddress) {
      setError('Please enter an address');
      return;
    }

    if (!isValidAddress(trimmedAddress)) {
      setError('Invalid Ethereum address');
      return;
    }

    if (addresses.includes(trimmedAddress)) {
      setError('Address already added');
      return;
    }

    onAddAddress(trimmedAddress);
    setInputValue('');
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--notion-border)] p-6">
      <h2 className="text-base font-semibold text-[var(--notion-text)] mb-4">
        Monitored Addresses
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null);
          }}
          placeholder="Enter Ethereum address (0x...)"
          className="flex-1 px-3 py-2 border border-[var(--notion-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-transparent bg-white text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--notion-text)] text-white rounded-md hover:bg-black transition-colors text-sm"
        >
          Add
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {addresses.length === 0 ? (
        <p className="text-[var(--notion-muted)] text-center py-4 text-sm">
          No addresses added yet. Add an address to start monitoring.
        </p>
      ) : (
        <div className="space-y-2">
          {addresses.map((address) => (
            <div
              key={address}
              className={`flex items-center justify-between p-3 rounded-md border transition-colors ${
                selectedAddress === address
                  ? 'bg-[#f3f2ef] border-[var(--notion-text)]'
                  : 'bg-white hover:bg-[#f7f6f3] border-[var(--notion-border)]'
              }`}
              onClick={() => onSelectAddress(selectedAddress === address ? null : address)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#f0efec] border border-[var(--notion-border)] flex items-center justify-center text-[var(--notion-muted)] text-xs font-semibold">
                  {address.slice(2, 4).toUpperCase()}
                </div>
                <span className="font-mono text-sm">{formatAddress(address, 6)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAddress(selectedAddress === address ? null : address);
                  }}
                  className="px-2.5 py-1 text-xs border border-[var(--notion-border)] rounded-md hover:bg-[#f3f2ef] text-[var(--notion-text)]"
                >
                  {selectedAddress === address ? 'Selected' : 'View'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveAddress(address);
                    if (selectedAddress === address) {
                      onSelectAddress(null);
                    }
                  }}
                  className="p-1 text-[var(--notion-muted)] hover:text-red-600 transition-colors"
                  aria-label="Remove address"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
