import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';
import Link from 'next/link';

export default async function FeaturedPage() {
  await dbConnect();

  // Get all pro-Palestine celebrities
  const celebrities = await Celebrity.find({
    status: 'approved',
    stance: 'pro',
  })
  .sort({ aiConfidence: -1, name: 1 })
  .lean();

  const serialized = celebrities.map(c => ({
    ...c,
    _id: c._id.toString(),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-green-600 hover:underline">
          ← Back to home
        </Link>
      </div>

      <div className="text-center mb-12">
        <div className="text-3xl font-bold text-gray-900 mb-3">
          Prominent personalities who have publicly supported the Palestine cause
        </div>
      </div>

      {serialized.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-4">
            No pro-Palestine celebrities in our database yet
          </p>
          <p className="text-sm text-gray-500">
            Search for celebrities to build the database
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            {/* <p className="text-gray-600">
              {serialized.length} {serialized.length === 1 ? 'voice' : 'voices'} supporting Palestine
            </p> */}
            {/* <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                Pro-Palestine Only
              </span>
            </div> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serialized.map((celebrity) => (
              <Link
                key={celebrity._id}
                href={`/celebrity/${celebrity._id}`}
                className="bg-white rounded-lg border-2 border-gray-100 hover:border-green-300 hover:shadow-lg transition p-6 group"
              >
                {/* Featured Badge */}
                {celebrity.featured && (
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      ⭐ Featured
                    </span>
                  </div>
                )}

                {/* Name & Profession */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
                  {celebrity.name}
                </h3>
                <p className="text-gray-600 mb-4">{celebrity.profession}</p>

                {/* Stance Badge */}
                {/* <div className="mb-4">
                  <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                    ✓ Pro-Palestine
                  </span>
                </div> */}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span>{celebrity.sources.length} sources</span>
                  <span className="flex items-center">
                    {celebrity.aiConfidence}% verified
                    {celebrity.aiConfidence >= 90 && (
                      <svg className="w-4 h-4 ml-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}