'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a celebrity or brand"
          className="flex-1 px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition shadow-lg active:scale-95"
        >
          Search
        </button>
      </div>
    </form>
  );
}
