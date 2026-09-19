'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { getUnsplashImage } from '../../lib/unsplash';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  // Protection Check
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/products');
    }
  }, [user, authLoading, router]);

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

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadProducts();
    }
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      const newProduct = await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          imageUrl: imageUrl || undefined,
        }),
      });

      setSuccessMsg(`Product "${newProduct.name}" created successfully!`);
      setName('');
      setPrice('');
      setStock('');
      setImageUrl('');
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    }
  };

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditStock(product.stock.toString());
    setEditImageUrl(product.imageUrl || '');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (editingId === null) return;

    try {
      const updated = await fetchApi(`/products/${editingId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: editName,
          price: parseFloat(editPrice),
          stock: parseInt(editStock, 10),
          imageUrl: editImageUrl || undefined,
        }),
      });

      setSuccessMsg(`Product "${updated.name}" updated successfully!`);
      setEditingId(null);
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    }
  };

  const handleDelete = async (productId: number, productName: string) => {
    if (!confirm(`Are you sure you want to delete product "${productName}"?`)) return;

    setError(null);
    setSuccessMsg(null);

    try {
      await fetchApi(`/products/${productId}`, {
        method: 'DELETE',
      });
      setSuccessMsg(`Product "${productName}" deleted successfully!`);
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
  };

  if (authLoading || !user || user.role !== 'ADMIN') {
    return <div className="text-center my-12 text-slate-600">Verifying authorization...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Admin Product Dashboard</h1>
        <p className="text-slate-600">Manage catalog inventory, create, edit, or remove store products</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-600 px-4 py-3 rounded text-sm font-medium border border-green-200">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Product Form */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">Add New Product</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Level</label>
              <input
                type="number"
                min="0"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-md transition shadow-sm"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Products List & Edit Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">Inventory Products</h2>
          
          {loading ? (
            <div className="text-slate-600 py-6 text-center">Loading inventory...</div>
          ) : products.length === 0 ? (
            <div className="text-slate-500 py-6 text-center">Inventory is currently empty.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="text-left text-slate-500 font-semibold">
                    <th className="pb-3 pr-4">Product</th>
                    <th className="pb-3 px-4">Price</th>
                    <th className="pb-3 px-4">Stock</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="align-middle">
                      {editingId === product.id ? (
                        /* Editing Row */
                        <td colSpan={4} className="py-4">
                          <form onSubmit={handleUpdate} className="flex flex-col gap-4 p-4 bg-slate-50 rounded-lg">
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div className="flex-1 space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Name</label>
                                <input
                                  type="text"
                                  required
                                  className="w-full px-2 py-1 text-sm border rounded text-slate-900"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                />
                              </div>
                              <div className="w-24 space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Price ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  required
                                  className="w-full px-2 py-1 text-sm border rounded text-slate-900"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                />
                              </div>
                              <div className="w-20 space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Stock</label>
                                <input
                                  type="number"
                                  min="0"
                                  required
                                  className="w-full px-2 py-1 text-sm border rounded text-slate-900"
                                  value={editStock}
                                  onChange={(e) => setEditStock(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500">Image URL</label>
                              <input
                                type="url"
                                className="w-full px-2 py-1 text-sm border rounded text-slate-900"
                                value={editImageUrl}
                                onChange={(e) => setEditImageUrl(e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-medium transition"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-medium transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </td>
                      ) : (
                        /* Read Row */
                        <>
                          <td className="py-4 pr-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center flex-shrink-0">
                              <img
                                src={product.imageUrl || getUnsplashImage(product.name)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-semibold text-slate-800">{product.name}</span>
                          </td>
                          <td className="py-4 px-4 text-indigo-600 font-semibold">${product.price.toFixed(2)}</td>
                          <td className="py-4 px-4">
                            {product.stock > 0 ? (
                              <span className="text-green-600 font-medium">{product.stock} left</span>
                            ) : (
                              <span className="text-red-600 font-medium">Sold Out</span>
                            )}
                          </td>
                          <td className="py-4 pl-4 text-right space-x-2">
                            <button
                              onClick={() => handleStartEdit(product)}
                              className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="text-red-600 hover:text-red-800 hover:underline font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
