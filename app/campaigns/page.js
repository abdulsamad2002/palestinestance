import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Campaign from '@/models/Campaign';

async function getCampaigns() {
  try {
    await dbConnect();
    // Fetch all campaigns, sorted by date (or importance)
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 }).lean();
    return campaigns.map(c => ({
      ...c,
      _id: c._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tightest">
            Global Movements
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Documenting the historic campaigns, demonstrations, and the visionary leaders heading the organizations calling for justice worldwide.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10">
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🕊️</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No campaigns found</h3>
            <p className="text-slate-500 font-medium">We are currently documenting major global campaigns. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {campaigns.map((campaign) => (
              <div 
                key={campaign._id}
                className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-white overflow-hidden hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="p-10 md:p-14">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          campaign.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 
                          campaign.status === 'ongoing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {campaign.status}
                        </span>
                        <span className="text-slate-300 font-bold">•</span>
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{campaign.date}</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tightest group-hover:text-green-600 transition-colors">
                        {campaign.title}
                      </h2>
                    </div>
                    <div className="bg-slate-50 px-8 py-6 rounded-2xl border border-slate-100 min-w-[240px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Location</p>
                      <p className="text-slate-900 font-extrabold text-xl">{campaign.location}</p>
                    </div>
                  </div>

                  <div className="mb-12">
                    <p className="text-slate-600 leading-relaxed text-xl font-medium max-w-4xl">
                      {campaign.description}
                    </p>
                  </div>

                  {/* Organization & Leaders Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                        Heading Organization
                      </h4>
                      <p className="text-slate-900 font-black text-2xl">{campaign.organization}</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                        Demonstration Leaders
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {campaign.leaders.map((leader, i) => (
                          <div key={i} className="flex flex-col bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-slate-900 font-extrabold">{leader.name}</span>
                            {leader.role && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{leader.role}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-slate-50">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                        🌍
                       </div>
                       <div>
                         <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Impact & Scale</p>
                         <p className="text-slate-900 font-black text-2xl tracking-tight">{campaign.impact || 'Global Awareness'}</p>
                       </div>
                    </div>
                    <div className="flex gap-3">
                      {campaign.sources.slice(0, 3).map((source, i) => (
                        <a 
                          key={i}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-4 bg-white border-2 border-slate-100 text-xs font-black text-slate-600 rounded-2xl hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm active:scale-95"
                        >
                          EVIDENCE {i+1}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

