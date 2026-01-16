'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [loading, setLoading] = useState(true);
  const [researching, setResearching] = useState(false);
  const [results, setResults] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState('');
  const isSearching = useRef(false);

  useEffect(() => {
    if (query && !isSearching.current) {
      searchCelebrity();
    }
  }, [query]);

  async function searchCelebrity() {
    if (isSearching.current) return; // Prevent concurrent calls
    
    isSearching.current = true;
    setLoading(true);
    setError('');
    setAiResult(null);

    try {
      // First check database
      const dbResponse = await fetch(`/api/search-db?q=${encodeURIComponent(query)}`);
      const dbData = await dbResponse.json();

      if (dbData.results && dbData.results.length > 0) {
        // Found in database
        setResults(dbData.results);
        setLoading(false);
        isSearching.current = false;
      } else {
        // Not found - trigger AI research
        setResearching(true);
        setLoading(false);

        const aiResponse = await fetch('/api/search-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: query })
        });

        const aiData = await aiResponse.json();

        if (!aiResponse.ok) {
          throw new Error(aiData.error || 'Research failed');
        }

        setAiResult(aiData);
        setResearching(false);
        isSearching.current = false;
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setResearching(false);
      isSearching.current = false;
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  if (researching) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Researching {query}...
          </h2>
          <p className="mt-2 text-gray-600">
            This may take 5-10 seconds. We&apos;re searching the web for verified information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-green-600 hover:underline">
          ← Back to search
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">
        Search Results for &quot;{query}&quot;
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Database Results */}
      {results.length > 0 && (
        <>
          <p className="text-gray-600 mb-8">
            Found {results.length} {results.length === 1 ? 'result' : 'results'} in our database
          </p>
          <div className="space-y-4">
            {results.map((celebrity) => (
              <Link
                key={celebrity._id}
                href={`/celebrity/${celebrity._id}`}
                className="block p-6 bg-white rounded-lg border-2 border-gray-100 hover:border-green-200 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {celebrity.name}
                    </h2>
                    <p className="text-gray-600 mt-1">{celebrity.profession}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      ✓ Verified
                    </span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        celebrity.stance === 'pro'
                          ? 'bg-green-100 text-green-800'
                          : celebrity.stance === 'against'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {celebrity.stance === 'pro' ? '✓ Pro-Palestine' : 
                       celebrity.stance === 'against' ? '✗ Pro-Israel' : 
                       '○ Neutral/Silent'}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {celebrity.sources.length} source{celebrity.sources.length !== 1 ? 's' : ''} • 
                  {celebrity.aiConfidence}% confidence
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* AI Research Result */}
      {aiResult && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              🔍 Fresh Research
            </span>
            <span className="text-sm text-gray-500">
              This information has been saved to our database
            </span>
          </div>

          <div className="p-6 bg-white rounded-lg border-2 border-blue-200 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {aiResult.name}
                </h2>
                <p className="text-gray-600 mt-1 text-lg">{aiResult.profession}</p>
              </div>
              <span
                className={`px-6 py-3 rounded-full text-lg font-semibold ${
                  aiResult.stance === 'pro'
                    ? 'bg-green-100 text-green-800'
                    : aiResult.stance === 'against'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {aiResult.stance === 'pro' ? '✓ Pro-Palestine' : 
                 aiResult.stance === 'against' ? '✗ Pro-Israel' : 
                 '○ Neutral/Silent'}
              </span>
            </div>

            {aiResult.summary && (
              <p className="text-gray-700 mb-4 text-base leading-relaxed">
                {aiResult.summary}
              </p>
            )}

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Sources:</h3>
              <div className="space-y-2">
                {aiResult.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-green-600 hover:text-green-700 hover:underline break-all"
                  >
                    {index + 1}. {source}
                  </a>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
              {aiResult.sources.length} source{aiResult.sources.length !== 1 ? 's' : ''} • 
              {aiResult.confidence}% confidence • 
              Researched just now
            </div>

            {aiResult._id && (
              <Link
                href={`/celebrity/${aiResult._id}`}
                className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                View Full Details →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* No results and no AI result */}
      {results.length === 0 && !aiResult && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Unable to find information</p>
          <p className="text-sm text-gray-500">
            Please try searching with a different name or spelling
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}