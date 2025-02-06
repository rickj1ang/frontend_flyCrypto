'use client';

import { useState, useEffect } from 'react';

interface Price {
  BTC: number;
  ETH: number;
  SOL: number;
}

export default function PriceDisplay() {
  const [prices, setPrices] = useState<Price | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8080/getprices');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.prices || typeof data.prices !== 'object') {
          throw new Error('Invalid price data received');
        }
        setPrices(data.prices);
        setError('');
      } catch (err) {
        console.error('Price fetch error:', err);
        setError('Failed to fetch prices. Please try again later.');
        setPrices(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading && !prices) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center p-4">
          <div className="animate-pulse text-gray-600">Loading prices...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-600 text-center p-4 border border-red-200 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Current Prices</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prices && Object.entries(prices).map(([symbol, price]) => (
          <div key={symbol} className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow">
            <div className="text-lg font-semibold text-gray-800">{symbol}</div>
            <div className="text-2xl font-bold text-blue-600">
              ${typeof price === 'number' ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}