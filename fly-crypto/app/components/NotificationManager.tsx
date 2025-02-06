'use client';

import { useState, useEffect } from 'react';

interface Notification {
  notification_id: number;
  user_id: number;
  coin_symbol: string;
  target_price: number;
  is_above: boolean;
}

interface NotificationManagerProps {
  token: string;
}

export default function NotificationManager({ token }: NotificationManagerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState({
    coin_symbol: 'BTC',
    target_price: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications);
    } catch (err) {
      setError('Failed to fetch notifications');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newNotification)
      });

      if (!response.ok) {
        throw new Error('Failed to create notification');
      }

      await fetchNotifications();
      setNewNotification({
        coin_symbol: 'BTC',
        target_price: 0
      });
    } catch (err) {
      setError('Failed to create notification');
    }
  };

  const handleDelete = async (notification_id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/notifications/${notification_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      await fetchNotifications();
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Price Notifications</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Coin</label>
            <select
              value={newNotification.coin_symbol}
              onChange={(e) => setNewNotification(prev => ({ ...prev, coin_symbol: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="SOL">Solana (SOL)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Price ($)</label>
            <input
              type="number"
              value={newNotification.target_price || ''}
              onChange={(e) => setNewNotification(prev => ({ ...prev, target_price: e.target.value ? parseFloat(e.target.value) : 0 }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Notification
        </button>
      </form>

      {error && (
        <div className="mb-4 text-red-600 text-center text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.notification_id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <span className="text-gray-500 text-sm mr-2"># {notification.notification_id}</span>
              <span className="font-semibold">{notification.coin_symbol}</span>
              <span className="mx-2">→</span>
              <span>${notification.target_price.toLocaleString()}</span>
            </div>
            <button
              onClick={() => handleDelete(notification.notification_id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}