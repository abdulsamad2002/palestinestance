import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-green-600">404</h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
          >
            Go Home
          </Link>
          
          <Link
            href="/browse"
            className="px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 font-semibold transition"
          >
            Browse Celebrities
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-2">Looking for someone specific?</p>
          <Link href="/" className="text-green-600 hover:underline font-medium">
            Try searching →
          </Link>
        </div>
      </div>
    </div>
  );
}