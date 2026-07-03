import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Nevo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your family nutrition and wellness platform
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/en/login"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/en/about"
              className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-green-600 text-4xl mb-4">🍎</div>
            <h3 className="text-xl font-bold mb-2">Personalized Diet Plans</h3>
            <p className="text-gray-600">
              Get customized meal plans based on your health conditions and preferences
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-green-600 text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-bold mb-2">Family Wellness</h3>
            <p className="text-gray-600">
              Track nutrition for your entire family, including children
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-green-600 text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-bold mb-2">Smart Reminders</h3>
            <p className="text-gray-600">
              Never miss a meal with timely notifications
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}