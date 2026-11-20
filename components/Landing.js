import Head from 'next/head';
import { Literata, Onest } from 'next/font/google';
import LandingSections from './LandingSections';
import WaitlistForm, { useWaitlist } from './WaitlistForm';

import { waitlistCopy } from '../lib/waitlistCopy';
import styles from '../styles/Landing.module.css';

const SITE = 'https://www.kailauz.com';
const PAGE_URL = { ru: `${SITE}/`, en: `${SITE}/en` };

const onest = Onest({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700'], variable: '--font-onest', display: 'swap' });

const literata = Literata({ subsets: ['latin', 'cyrillic'], weight: '400', variable: '--font-literata', display: 'swap' });

const copy = {
  en: {
    navTelegram: 'Telegram',
    language: 'Language',
    titleStart: 'Find your next',
    titleAccent: 'favorite book.',
    perkCount: (count) => <><b>{count.toLocaleString('en-US')}</b> on the waitlist</>,
    platform: 'Coming to iOS and Android.',
    heroAlt: 'A woman in a hat reading a book on a leather sofa by the bookshelves',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use'
  },
  ru: {
    navTelegram: 'Telegram',
    language: 'Язык сайта',
    titleStart: 'Найди следующую',
    titleAccent: 'любимую книгу.',
    perkCount: (count) => <><b>{count.toLocaleString('ru-RU')}</b> в списке ожидания</>,
    platform: 'Скоро на iOS и Android.',
    heroAlt: 'Девушка в шляпе читает книгу на кожаном диване у книжных полок',
    privacy: 'Политика конфиденциальности',
    terms: 'Условия использования'
  }
};

/** Organization, WebSite and the iOS and Android app in schema.org terms, so search engines know what kailauz is. */
function structuredData(lang, description, shareImage) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'kailauz', url: `${SITE}/`,
        logo: `${SITE}/logo.png`, sameAs: ['https://t.me/kailauz'] },
      { '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'kailauz', url: `${SITE}/`, inLanguage: ['ru', 'en'],
        publisher: { '@id': `${SITE}/#organization` } },
      { '@type': 'MobileApplication', '@id': `${SITE}/#app`, name: 'kailauz', operatingSystem: 'iOS, Android',
        applicationCategory: 'LifestyleApplication', inLanguage: lang, description, url: PAGE_URL[lang],
        image: shareImage, publisher: { '@id': `${SITE}/#organization` } },
    ],
  };
}

export default function Landing({ lang }) {
  const t = { ...copy[lang], ...waitlistCopy[lang] };
  const waitlist = useWaitlist(lang);

  const title =
    lang === 'ru'
      ? 'Kailauz — дневник чтения и рекомендации книг'
      : 'Kailauz — Reading Tracker & Book Recommendations';
  const description =
    lang === 'ru'
      ? 'Дневник чтения для iOS и Android. Веди библиотеку, отмечай прогресс и получай подборку книг по своему вкусу каждую неделю. Запишись на ранний доступ.'
      : 'A reading tracker for iOS and Android. Keep your library, track progress, and get weekly book recommendations to match your taste. Join the waitlist.';
  const shareTitle = `${t.titleStart} ${t.titleAccent}`;
  const shareImage = `${SITE}/landing/share-${lang}-v2.jpg`;
  const shareAlt = `Kailauz — ${shareTitle}`;

  const privacyHref = lang === 'en' ? '/en/privacy' : '/privacy';
  const termsHref = lang === 'en' ? '/en/terms' : '/terms';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#16110E" />
        <link rel="canonical" href={PAGE_URL[lang]} />
        <link rel="alternate" hrefLang="ru" href={PAGE_URL.ru} />
        <link rel="alternate" hrefLang="en" href={PAGE_URL.en} />
        <link rel="alternate" hrefLang="x-default" href={PAGE_URL.ru} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={lang === 'en' ? 'en_US' : 'ru_RU'} />
        <meta property="og:locale:alternate" content={lang === 'en' ? 'ru_RU' : 'en_US'} />
        <meta property="og:image" content={shareImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={shareAlt} />
        <meta name="twitter:image" content={shareImage} />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta property="og:url" content={PAGE_URL[lang]} />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="kailauz" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image:alt" content={shareAlt} />
        <link rel="preload" href="/landing/hero-mobile.webp" as="image" type="image/webp" media="(max-width: 600px)" />
        <link rel="preload" href="/landing/hero.webp" as="image" type="image/webp" media="(min-width: 601px)" />
        <link rel="manifest" href="/site.webmanifest" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(lang, description, shareImage)) }} />
      </Head>

      <div className={`${styles.page} ${onest.variable} ${literata.variable}`}>
        <div className={styles.botanical} aria-hidden="true" />

        <header className={styles.header}>
          <div className={`${styles.wrap} ${styles.headerInner}`}>
            <a href={lang === 'en' ? '/en' : '/'} className={styles.brand} aria-label="kailauz"><img src="/landing/logo-glyph.png" alt="" width="24" height="30" /></a>
            <a className={styles.telegram} href="https://t.me/kailauz" target="_blank" rel="noreferrer">{t.navTelegram}</a>
            <div className={styles.lang} role="group" aria-label={t.language}>
              <a href="/" hrefLang="ru" lang="ru" aria-current={lang === 'ru' ? 'page' : undefined}>RU</a>
              <a href="/en" hrefLang="en" lang="en" aria-current={lang === 'en' ? 'page' : undefined}>EN</a>
            </div>
          </div>
        </header>

        <main>
          <section className={styles.hero} aria-labelledby="hero-title">
            <div className={styles.banner}>
              <picture>
                <source media="(max-width: 600px)" srcSet="/landing/hero-mobile.webp" />
                <img src="/landing/hero.webp" alt={t.heroAlt} fetchpriority="high" />
              </picture>
            </div>

            <div className={`${styles.wrap} ${styles.copy}`}>
              <h1 className={styles.title} id="hero-title">
                {t.titleStart} <em>{t.titleAccent}</em>
              </h1>

              <WaitlistForm id="waitlist" lang={lang} copy={t} privacyHref={privacyHref} waitlist={waitlist} />
            </div>
          </section>
          <LandingSections lang={lang}>
            <WaitlistForm id="waitlist-bottom" lang={lang} copy={t} privacyHref={privacyHref} waitlist={waitlist} />
          </LandingSections>
        </main>

        <footer>
          <div className={`${styles.wrap} ${styles.footerInner}`}>
            <span>© 2026 kailauz · {t.platform}</span>
            <span className={styles.spacer} />
            <a href="https://t.me/kailauz" target="_blank" rel="noreferrer">{t.navTelegram}</a>
            <a href={privacyHref}>{t.privacy}</a>
            <a href={termsHref}>{t.terms}</a>
          </div>
        </footer>
      </div>
    </>
  );
}
