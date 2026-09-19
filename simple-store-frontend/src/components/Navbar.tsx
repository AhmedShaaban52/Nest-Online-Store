'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/products" className="text-xl font-bold text-indigo-400 hover:text-indigo-300 transition">
              SimpleStore
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/products" className="hover:text-indigo-200 transition">
                Products
              </Link>
              {user && (
                <>
                  <Link href="/cart" className="hover:text-indigo-200 transition">
                    Cart
                  </Link>
                  <Link href="/orders" className="hover:text-indigo-200 transition">
                    My Orders
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="text-amber-400 hover:text-amber-300 font-semibold transition">
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-slate-300 text-sm hidden sm:inline">
                  Logged in as <strong className="text-white">{user.email}</strong> ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile nav indicator */}
      <div className="md:hidden flex justify-around py-2 border-t border-slate-800 text-sm">
        <Link href="/products" className="hover:text-indigo-200">
          Products
        </Link>
        {user && (
          <>
            <Link href="/cart" className="hover:text-indigo-200">
              Cart
            </Link>
            <Link href="/orders" className="hover:text-indigo-200">
              Orders
            </Link>
            {user.role === 'ADMIN' && (
              <Link href="/admin" className="text-amber-400">
                Admin
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
