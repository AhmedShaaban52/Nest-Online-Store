'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

interface OrderItem {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}

interface Order {
  id: number;
  createdAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const loadOrders = async () => {
      try {
        const data = await fetchApi('/orders');
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [user]);

  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  if (!user) {
    return (
      <div className="text-center my-12">
        <p className="text-slate-600 mb-4">Please log in to view your orders.</p>
        <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded transition">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) return <div className="text-center my-12 text-slate-600">Loading your orders...</div>;
  if (error) return <div className="text-center my-12 text-red-600 font-medium">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Your Past Orders</h1>
        <p className="text-slate-600">Review your purchase history and order details</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-500 mb-4">You haven't placed any orders yet.</p>
          <Link href="/products" className="text-indigo-600 font-medium hover:underline">
            Start shopping now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              {/* Order Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <span className="text-slate-500 text-sm">Order ID:</span>{' '}
                  <span className="font-mono text-slate-800 font-semibold">#{order.id}</span>
                </div>
                <div className="text-slate-500 text-sm">
                  Placed on: <span className="text-slate-800 font-medium">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="font-bold text-slate-800">
                  Total:{' '}
                  <span className="text-indigo-600">${calculateOrderTotal(order.items).toFixed(2)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-slate-800">{item.product.name}</span>
                      <span className="text-slate-500 ml-2">x {item.quantity}</span>
                    </div>
                    <div className="text-slate-600">
                      ${(item.product.price * item.quantity).toFixed(2)}{' '}
                      <span className="text-xs text-slate-400">(${item.product.price.toFixed(2)} each)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
