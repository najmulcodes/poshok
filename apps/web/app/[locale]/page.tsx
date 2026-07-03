import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-32 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wide">Nevo Platform</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Family Nutrition
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
              Made Simple.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Personalized meal plans. Health tracking. Smart reminders.
            <br />
            Everything your family needs to stay healthy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/en/register"
              className="group relative px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50"
            >
              Start Free Trial
              <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/en/demo"
              className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-white border border-slate-700 rounded-lg font-semibold text-lg transition-all backdrop-blur-sm"
            >
              Watch Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">Meal Plans</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">4.9★</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">User Rating</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powerful features to help your family achieve their nutrition goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-emerald-500/50 transition-all hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center mb-6 text-3xl">
                  🍎
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Personalized Diet Plans</h3>
                <p className="text-slate-400 leading-relaxed">
                  AI-powered meal plans tailored to your health conditions, dietary preferences, and family needs.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-amber-500/50 transition-all hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center mb-6 text-3xl">
                  👨‍👩‍👧‍👦
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Family Wellness Hub</h3>
                <p className="text-slate-400 leading-relaxed">
                  Track nutrition for everyone in your family, with specialized plans for children and different age groups.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-teal-500/50 transition-all hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-xl flex items-center justify-center mb-6 text-3xl">
                  🔔
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Reminders</h3>
                <p className="text-slate-400 leading-relaxed">
                  Never miss a meal with intelligent push notifications and customizable reminder schedules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-teal-600 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Family's Health?
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            Join thousands of families already using Nevo to achieve their wellness goals.
          </p>
          <Link
            href="/en/register"
            className="inline-block px-10 py-5 bg-white text-emerald-600 rounded-lg font-bold text-lg hover:scale-105 transition-all hover:shadow-2xl"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </>
  );
}
