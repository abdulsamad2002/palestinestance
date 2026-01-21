import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Celebrity from '@/models/Celebrity';
import SearchForm from '@/components/SearchForm';

async function getTopCelebrities() {
  try {
    await dbConnect();
    // Get top 3 pro-Palestine celebrities with indexing support
    const celebrities = await Celebrity.find({
      status: 'approved',
      stance: 'pro',
    })
    .sort({ 
      featured: -1,
      aiConfidence: -1
    })
    .limit(3)
    .lean();

    return celebrities.map(c => ({
      ...c,
      _id: c._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching top celebrities:', error);
    return [];
  }
}

export default async function Home() {
  const topCelebrities = await getTopCelebrities();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-16">
        <h1 className="text-6xl font-black text-center mb-6 text-green-900 tracking-tightest">
          Palestine Stance
        </h1>
        <p className="text-center text-gray-600 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
          The verified database of public figures and brands. Discover stances with AI-powered research and linked evidence.
        </p>
        
        <SearchForm />
      </div>

      {/* Hall of Fame Section */}
      {topCelebrities.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              🏆 Hall of Fame
            </h2>
            <p className="text-gray-600 text-lg">
              Recognizing the most prominent voices for justice and humanity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topCelebrities.map((celebrity, index) => (
              <div
                key={celebrity._id}
                className="relative rounded-2xl border-2 border-gray-100 bg-white hover:border-green-400 hover:shadow-2xl transition-all duration-300 p-8 group overflow-hidden"
              >
                {/* Palestinian Flag Background Animation/Effect */}
                <div className="absolute inset-0 flex flex-col opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="flex-1 bg-black"></div>
                  <div className="flex-1 bg-white"></div>
                  <div className="flex-1 bg-green-600"></div>
                  <div 
                    className="absolute inset-0"
                    style={{
                      clipPath: 'polygon(0 0, 0 100%, 40% 50%)',
                      backgroundColor: '#EE2A35'
                    }}
                  ></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner ${
                      index === 0 ? 'bg-yellow-50 text-yellow-600 shadow-yellow-100' :
                      index === 1 ? 'bg-slate-50 text-slate-500 shadow-slate-100' :
                      'bg-orange-50 text-orange-600 shadow-orange-100'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    {celebrity.featured && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-200">
                        Featured Voice
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition truncate">
                      {celebrity.name}
                    </h3>
                    <p className="text-gray-500 font-medium mb-6">{celebrity.profession}</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                      <div className="text-center p-3 rounded-xl bg-gray-50 group-hover:bg-green-50/50 transition-colors">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter mb-1">Confidence</p>
                        <p className="font-bold text-gray-900">{celebrity.aiConfidence}%</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gray-50 group-hover:bg-green-50/50 transition-colors">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter mb-1">Sources</p>
                        <p className="font-bold text-gray-900">{celebrity.sources.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="h-px w-24 bg-green-100 mx-auto mb-10"></div>
        <p className="text-xs text-gray-400 mb-8 font-bold uppercase tracking-widest">
          AI-verified evidence & source-backed transparency
        </p>
        <div className="flex justify-center gap-10">
          <a 
            href="https://github.com/abdulsamad2002" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-600 font-bold text-sm transition-colors duration-200"
          >
            GITHUB
          </a>
          <Link 
            href="/about"
            className="text-gray-400 hover:text-green-600 font-bold text-sm transition-colors duration-200"
          >
            ABOUT PROJECT
          </Link>
        </div>
      </div>
    </div>
  );
}