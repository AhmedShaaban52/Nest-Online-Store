'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const cartJson = localStorage.getItem('cart');
    if (cartJson) {
      try {
        const parsed = JSON.parse(cartJson);
        const validCart = parsed.filter((item: any) => item && typeof item.price === 'number');
        setCart(validCart);
        if (validCart.length !== parsed.length) {
          localStorage.setItem('cart', JSON.stringify(validCart));
        }
      } catch (e) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const updateQuantity = (productId: number, amount: number) => {
    const updated = cart.map((item) => {
      if (item.productId === productId) {
        const newQty = item.quantity + amount;
        if (newQty < 1) return item;
        if (newQty > item.stock) return item; // limit to stock
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (productId: number) => {
    const filtered = cart.filter((item) => item.productId !== productId);
    setCart(filtered);
    localStorage.setItem('cart', JSON.stringify(filtered));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      setSuccess(true);
      localStorage.removeItem('cart');
      setCart([]);
      
      setTimeout(() => {
        router.push('/orders');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center my-12">
        <p className="text-slate-600 mb-4">Please log in to view and manage your cart.</p>
        <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded transition">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Your Shopping Cart</h1>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded mb-4 text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 px-4 py-3 rounded mb-4 text-sm font-medium border border-green-200">
          Order placed successfully! Redirecting to your orders list...
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-500 mb-4">Your cart is empty.</p>
          <Link href="/products" className="text-indigo-600 font-medium hover:underline">
            Go browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.productId} className="bg-white rounded-lg p-6 border border-slate-200 flex items-center justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                  <div className="text-slate-500 text-sm">${(item.price ?? 0).toFixed(2)} each</div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-slate-300 rounded-md">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition rounded-l-md"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-semibold text-slate-800 bg-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition rounded-r-md"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Subtotal & Delete */}
                  <div className="text-right">
                    <div className="font-bold text-indigo-600">${((item.price ?? 0) * item.quantity).toFixed(2)}</div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs text-red-500 hover:text-red-700 hover:underline mt-1 block w-full text-right"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm h-fit space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-3">Order Summary</h2>
            
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Shipping & Taxes:</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold text-slate-800 text-lg">
              <span>Total Price:</span>
              <span className="text-indigo-600">${calculateTotal().toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || success}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-md transition disabled:bg-indigo-300 shadow"
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
