import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pandaverse-50 via-stone-50 to-amber-50">
      <header className="border-b border-stone-200 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pandaverse-500 to-pandaverse-700 flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-semibold text-stone-800">Pandaverse</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-stone-700 hover:text-pandaverse-700 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-pandaverse-600 text-white rounded-lg hover:bg-pandaverse-700 font-medium"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-pandaverse-700 font-medium tracking-wide uppercase text-sm mb-4">
            Pandaverse Gharana Partner Portal
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-stone-900 leading-tight mb-6">
            Preserve tradition.<br />Share your craft.
          </h1>
          <p className="text-lg text-stone-600 mb-10 leading-relaxed">
            A trusted home for independent artisans, weavers, and small indigenous
            businesses to share their products, stories, and craft with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-pandaverse-600 text-white rounded-xl hover:bg-pandaverse-700 font-semibold text-lg shadow-lg shadow-pandaverse-200"
            >
              Join as a Gharana Partner
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white border border-stone-300 text-stone-800 rounded-xl hover:bg-stone-50 font-semibold text-lg"
            >
              Sign in to your portal
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white p-8 rounded-2xl border border-stone-200">
            <div className="w-12 h-12 bg-pandaverse-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🧵</span>
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2">For Artisans</h3>
            <p className="text-stone-600">
              Upload your products, tell your story, and preserve your craft for generations.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-stone-200">
            <div className="w-12 h-12 bg-pandaverse-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📸</span>
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2">Original-Quality Uploads</h3>
            <p className="text-stone-600">
              Your photos and videos are preserved in original quality on secure cloud storage.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-stone-200">
            <div className="w-12 h-12 bg-pandaverse-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2">Private & Secure</h3>
            <p className="text-stone-600">
              Only you and the Pandaverse team can access your data. Your privacy matters.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-stone-500 text-sm">
          © 2026 Pandaverse. Honoring traditional craft.
        </div>
      </footer>
    </div>
  );
}
