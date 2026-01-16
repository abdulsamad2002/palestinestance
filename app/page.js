'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [search, setSearch] = useState('');
  const [topCelebrities, setTopCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTopCelebrities();
  }, []);

  async function fetchTopCelebrities() {
    try {
      const response = await fetch('/api/top-celebrities');
      const data = await response.json();
      setTopCelebrities(data.celebrities || []);
    } catch (error) {
      console.error('Error fetching top celebrities:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <h1 className="text-5xl font-bold text-center mb-4 text-green-900">
          Palestine Stance
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Search for prominent personalities, brands, and other entities to determine their stance on the Palestine cause.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="flex-1 px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Hall of Fame Section */}
      {!loading && topCelebrities.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              🏆 Hall of Fame
            </h2>
            <p className="text-gray-600">
              Most prominent voices for Palestine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCelebrities.map((celebrity, index) => (
              <div
                key={celebrity._id}
                className="relative rounded-xl border-2 border-gray-200 hover:border-green-400 hover:shadow-2xl transition-all p-8 group overflow-hidden"
              >
                {/* Palestinian Flag Background */}
                <div className="absolute inset-0 flex flex-col">
                  {/* Black stripe */}
                  <div className="flex-1 bg-black"></div>
                  {/* White stripe */}
                  <div className="flex-1 bg-white"></div>
                  {/* Green stripe */}
                  <div className="flex-1 bg-green-600"></div>
                  {/* Red triangle */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      clipPath: 'polygon(0 0, 0 100%, 40% 50%)',
                      backgroundColor: '#EE2A35'
                    }}
                  ></div>
                </div>

                {/* White overlay for readability */}
                <div className="absolute inset-0 bg-white/90 group-hover:bg-white/85 transition-colors"></div>
                
                {/* Content - relative to appear above overlay */}
                <div className="relative z-10">
                  {/* Rank Badge */}
                  <div className="absolute -top-8 right-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      'bg-orange-300 text-orange-900'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
                      {celebrity.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{celebrity.profession}</p>

                    {/* Featured Badge */}
                    {celebrity.featured && (
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full mb-4">
                        ⭐ Featured
                      </span>
                    )}

                    {/* Stats */}
                    <div className="space-y-2 text-sm mt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-semibold text-gray-900">{celebrity.aiConfidence}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Sources:</span>
                        <span className="font-semibold text-gray-900">{celebrity.sources.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Link */}
          {/* <div className="text-center mt-12">
            <Link
              href="/featured"
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
            >
              View All Supporters →
            </Link>
          </div> */}
        </div>
      )}

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-8 text-center">
        <p className="text-sm text-gray-500 mb-4">
          All information is AI-verified and sourced from credible outlets
        </p>
        <a 
          href="https://github.com/abdulsamad2002" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-gray-600 hover:text-green-600 transition"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}