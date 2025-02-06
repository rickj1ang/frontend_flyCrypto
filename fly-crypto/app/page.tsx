'use client';

import { useState, useEffect } from 'react';
import Login from './components/Login';
import NotificationManager from './components/NotificationManager';
import PriceDisplay from './components/PriceDisplay';

export default function Home() {
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      {!token ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="space-y-8">
          <PriceDisplay />
          <NotificationManager token={token} />
        </div>
      )}
    </main>
  );
}
