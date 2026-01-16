// app/about/page.js
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        About Palestine Stance
      </h1>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Palestine Stance is an AI-powered database that tracks public figures&apos; 
          stances on Palestine. We believe in making this information accessible, verifiable, 
          and easy to search.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          Our goal is to help people make informed decisions about who they support, 
          which voices they amplify, and how they engage with public figures on this 
          critical humanitarian issue.
        </p>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
        <div className="space-y-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-gray-900 mb-2">Search Any Celebrity</h3>
                <p className="text-gray-700">
                  Simply search for any public figure using our search bar. 
                  If they&apos;re already in our database, you&apos;ll get instant results.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-gray-900 mb-2">Real-Time AI Research</h3>
                <p className="text-gray-700">
                  If the celebrity isn&apos;t in our database yet, our AI automatically researches 
                  their stance using credible sources from across the web. This takes just 5-10 seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-gray-900 mb-2">Automatic Database Growth</h3>
                <p className="text-gray-700">
                  Every search helps build our database. Once researched, the information is saved 
                  so future searches are instant. All entries show their sources and confidence scores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Standards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Standards</h2>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="text-gray-900">Credible Sources Only:</strong>
                <span className="text-gray-700"> Our AI prioritizes news outlets, verified social media posts, 
                and official statements over rumors or unverified claims.</span>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="text-gray-900">Context Matters:</strong>
                <span className="text-gray-700"> We aim to represent public figures&apos; actual positions, 
                not isolated quotes taken out of context.</span>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="text-gray-900">AI-Powered Accuracy:</strong>
                <span className="text-gray-700"> Each research is accompanied by a confidence score 
                so you can assess the reliability of the information.</span>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="text-gray-900">No Speculation:</strong>
                <span className="text-gray-700"> We only include public figures who have made 
                clear public statements or taken documented actions.</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Technology */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Technology</h2>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-8">
          <p className="text-gray-700 text-lg mb-4">
            Palestine Stance uses advanced AI (Llama 3.3 70B via Groq) to research public figures in real-time.
          </p>
          <p className="text-gray-700 mb-4">
            The AI searches credible sources, analyzes statements and actions, and provides a comprehensive 
            overview with source links and confidence ratings.
          </p>
          <p className="text-gray-700">
            Every search contributes to building a transparent, growing database that helps people 
            make informed decisions about who they support.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-2">Disclaimer</h3>
        <p className="text-gray-700 text-sm">
          Palestine Stance aims to provide accurate, sourced information about public figures&apos; 
          stated positions. We are not affiliated with any political organization. All information 
          is researched by AI based on publicly available sources. AI confidence scores indicate 
          the reliability of findings. If you believe any information is inaccurate, please contact us 
          for review.
        </p>
      </section>
    </div>
  );
}