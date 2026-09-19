'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { getUnsplashImage } from '../../lib/unsplash';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchApi('/products');
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
    // Read current cart
    const cartJson = localStorage.getItem('cart');
    let cart = cartJson ? JSON.parse(cartJson) : [];

    // Check if item already in cart
    const existingItemIndex = cart.findIndex((item: any) => item.productId === product.id);

    if (existingItemIndex > -1) {
      if (cart[existingItemIndex].quantity >= product.stock) {
        setNotification(`Cannot add more. Limit reached (Only ${product.stock} available in stock)`);
        setTimeout(() => setNotification(null), 2500);
        return;
      }
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        quantity: 1,
      });
    }

    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    setNotification(`"${product.name}" added to cart!`);
    setTimeout(() => setNotification(null), 2000);
  };

  if (loading) return <div className="text-center my-12 text-slate-600">Loading products...</div>;
  if (error) return <div className="text-center my-12 text-red-600 font-medium">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Browse Products</h1>
          <p className="text-slate-600">Check out our catalog and add items to your cart</p>
        </div>
        {user && (
          <Link
            href="/cart"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-5 rounded-md shadow-sm transition flex items-center gap-2"
          >
            🛒 View Shopping Cart
          </Link>
        )}
      </div>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-indigo-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium z-50 animate-bounce">
          {notification}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-500 mb-4">No products available at the moment.</p>
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-indigo-600 font-medium hover:underline">
              Add products in the Admin Panel
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition">
              <div>
                {/* Product Image */}
                <div className="w-full h-48 relative mb-4 rounded-md overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                  <img
                    src={product.imageUrl || getUnsplashImage(product.name)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1">{product.name}</h3>
                <div className="text-indigo-600 font-semibold text-xl mb-3">${product.price.toFixed(2)}</div>
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <span>Stock Status:</span>
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">{product.stock} available</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of stock</span>
                  )}
                </div>
              </div>

              {user ? (
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-md font-medium transition disabled:bg-slate-300 disabled:text-slate-500"
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-md font-medium transition"
                >
                  Log in to Buy
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
