import { useTranslations } from 'next-intl';
import { HeartPulse, Languages, BellRing } from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations('LandingPage');

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <main className="bg-gray-50">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('heroSubtitle')}
          </p>
          <div className="mt-8">
            <a
              href="#" // Replace with Google Play Store link later
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition duration-300"
            >
              {t('getStarted')}
            </a>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="feature-item">
              <HeartPulse className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('feature1Title')}</h3>
              <p className="text-gray-600">{t('feature1Description')}</p>
            </div>
            <div className="feature-item">
              <Languages className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('feature2Title')}</h3>
              <p className="text-gray-600">{t('feature2Description')}</p>
            </div>
            <div className="feature-item">
              <BellRing className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('feature3Title')}</h3>
              <p className="text-gray-600">{t('feature3Description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm mb-4 max-w-4xl mx-auto">
            {t('footerDisclaimer')}
          </p>
          <p>{t('footerText')}</p>
        </div>
      </div>
    </div>
  );
}