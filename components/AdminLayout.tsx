'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import {
  LayoutDashboard,
  Users,
  Package,
  ImagePlus,
  Search,
  User,
  LogOut,
  Menu,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/partners', label: 'Gharana Partners', icon: Users },
  { href: '/admin/products', label: 'All Products', icon: Package },
  { href: '/admin/content', label: 'Content Library', icon: ImagePlus },
  { href: '/admin/search', label: 'Search', icon: Search },
  { href: '/admin/profile', label: 'Profile', icon: User },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, supabase, refreshUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await refreshUser();
    router.push('/login');
  };

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 text-white transform transition-transform lg:translate-x-0 lg:static lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-stone-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pandaverse-500 to-pandaverse-700 flex items-center justify-center text-white font-bold text-sm">P</div>
            <div>
              <span className="font-semibold text-white block">Pandaverse</span>
              <span className="text-xs text-stone-400">Admin Panel</span>
            </div>
          </Link>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-pandaverse-600 text-white' : 'text-stone-300 hover:bg-stone-800'}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-stone-800 mt-4">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-stone-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-stone-800">Pandaverse Admin</span>
        </header>
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
