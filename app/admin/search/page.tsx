'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Search } from 'lucide-react';

export default function AdminSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ title: string; subtitle: string; href: string }[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setResults([
      { title: `Products matching "${query}"`, subtitle: 'Search in all products', href: `/admin/products?q=${encodeURIComponent(query)}` },
      { title: `Partners matching "${query}"`, subtitle: 'Search in all partners', href: `/admin/partners?q=${encodeURIComponent(query)}` },
      { title: `Content Library for "${query}"`, subtitle: 'Browse all media content', href: `/admin/content?q=${encodeURIComponent(query)}` },
    ]);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-stone-900 mb-6">Search</h1>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search partners, products, or content..."
              className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500"
            />
          </div>
        </form>
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((r, i) => (
              <a key={i} href={r.href} className="block bg-white rounded-xl border border-stone-200 p-5 hover:bg-stone-50">
                <p className="font-medium text-stone-900">{r.title}</p>
                <p className="text-sm text-stone-500">{r.subtitle}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
