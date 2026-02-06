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
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Monitored Addresses</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null);
          }}
          placeholder="Enter Ethereum address (0x...)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-aave-purple focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-aave-purple text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Add
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {addresses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No addresses added yet. Add an address to start monitoring.
        </p>
      ) : (
        <div className="space-y-2">
          {addresses.map((address) => (
            <div
              key={address}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                selectedAddress === address
                  ? 'bg-aave-purple/10 border-2 border-aave-purple'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
              onClick={() =>
                onSelectAddress(selectedAddress === address ? null : address)
              }
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aave-purple to-aave-blue flex items-center justify-center text-white text-xs font-bold">
                  {address.slice(2, 4).toUpperCase()}
                </div>
                <span className="font-mono text-sm">
                  {formatAddress(address, 6)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveAddress(address);
                  if (selectedAddress === address) {
                    onSelectAddress(null);
                  }
                }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
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
          ))}
        </div>
      )}
    </div>
  );
}
