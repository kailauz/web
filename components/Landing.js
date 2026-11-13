import Head from 'next/head';
import { Onest } from 'next/font/google';
import { useEffect, useMemo, useState } from 'react';

import styles from '../styles/Landing.module.css';

const SITE = 'https://www.kailauz.com';
const PAGE_URL = { ru: `${SITE}/`, en: `${SITE}/en` };

const onest = Onest({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700'], variable: '--font-onest', display: 'swap' });

const SCREEN_NAMES = ['prof', 'recs', 'cal', 'imp'];
const screensFor = (lang) => SCREEN_NAMES.map((name) => `/landing/screen-${name}${lang === 'en' ? '-en' : ''}.webp`);

const copy = {
  en: {
    navTelegram: 'Telegram',
    language: 'Language',
    titleStart: 'What kind of',
    titleAccent: 'reader',
    titleEnd: ' are you?',
    accentFirst: true,
    lead: 'Your library, reading progress',
    leadEnd: 'and recommendations to match your taste.',
    waitlistLabel: 'Email',
    waitlistButton: 'Get early access',
    consentLabel: 'I agree to receive product news, updates, and early access emails from kailauz.',
    consentError: 'Please confirm that you agree to receive email updates.',
    waitlistSuccess: 'You are on the waiting list. We will email you when early access opens.',
    waitlistError: 'Please enter a valid email.',
    waitlistServerError: 'Something went wrong. Please try again in a moment.',
    perkCount: (count) => <><b>{count.toLocaleString('en-US')}</b> on the waitlist · the first get <b>Plus free for a month</b></>,
    platform: 'Coming to iOS and Android.',
    heroAlt: 'A woman in a hat reading a book on a leather sofa by the bookshelves',
    shareAlt: 'kailauz — a reading journal app: a woman reading a book and a phone with the app',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use'
  },
  ru: {
    navTelegram: 'Telegram',
    language: 'Язык сайта',
    titleStart: 'Узнай, какой',
    titleAccent: 'читатель.',
    titleEnd: '',
    accentFirst: false,
    lead: 'Библиотека, прогресс и рекомендации',
    leadEnd: 'по твоему вкусу.',
    waitlistLabel: 'Email',
    waitlistButton: 'Получить ранний доступ',
    consentLabel: 'Я соглашаюсь получать новости о продукте, обновления и письма о раннем доступе от kailauz.',
    consentError: 'Подтвердите согласие на получение email-обновлений.',
    waitlistSuccess: 'Вы в списке ожидания. Напишем, когда откроем ранний доступ.',
    waitlistError: 'Введите корректный email.',
    waitlistServerError: 'Что-то пошло не так. Попробуйте ещё раз чуть позже.',
    perkCount: (count) => <><b>{count.toLocaleString('ru-RU')}</b> в списке ожидания · первые получат <b>Plus на месяц</b> бесплатно</>,
    platform: 'Скоро на iOS и Android.',
    heroAlt: 'Девушка в шляпе читает книгу на кожаном диване у книжных полок',
    shareAlt: 'kailauz — приложение-дневник чтения: девушка с книгой и телефон с приложением',
    privacy: 'Политика конфиденциальности',
    terms: 'Условия использования'
  }
};

/** Organization, WebSite and the iOS and Android app in schema.org terms, so search engines know what kailauz is. */
function structuredData(lang, description) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'kailauz', url: `${SITE}/`,
        logo: `${SITE}/logo.png`, sameAs: ['https://t.me/kailauz'] },
      { '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'kailauz', url: `${SITE}/`, inLanguage: ['ru', 'en'],
        publisher: { '@id': `${SITE}/#organization` } },
      { '@type': 'MobileApplication', '@id': `${SITE}/#app`, name: 'kailauz', operatingSystem: 'iOS, Android',
        applicationCategory: 'LifestyleApplication', inLanguage: lang, description, url: PAGE_URL[lang],
        image: `${SITE}/landing/share-${lang}.jpg`, publisher: { '@id': `${SITE}/#organization` } },
    ],
  };
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** The one-screen landing. Russian lives at /, English at /en: each is a real page Google indexes in its own language. */
export default function Landing({ lang }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  // error: '' | 'email' | 'consent' | 'server'
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(null);
  const t = useMemo(() => copy[lang], [lang]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/waitlist', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (Number.isSafeInteger(payload?.count) && payload.count >= 0) {
          setWaitlistCount(payload.count);
        }
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  const title =
    lang === 'ru'
      ? 'kailauz — приложение для чтения и рекомендаций'
      : 'kailauz — reading app with AI recommendations';
  const description =
    lang === 'ru'
      ? 'kailauz — приложение для чтения на iOS и Android. Помогает вести книги, понимать свой вкус и получать более точные рекомендации.'
      : 'kailauz is a reading app for iOS and Android. Track books, understand your reading taste, and get better recommendations. Join the waiting list.';

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('email');
      return;
    }

    if (!consent) {
      setError('consent');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), lang, source: 'landing', consent })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Request failed');
      }

      setEmail('');
      setConsent(false);
      if (Number.isSafeInteger(payload.count) && payload.count >= 0) {
        setWaitlistCount(payload.count);
      }
      setDone(true);
    } catch (requestError) {
      setError('server');
    } finally {
      setLoading(false);
    }
  }

  const message = { email: t.waitlistError, consent: t.consentError, server: t.waitlistServerError }[error];
  const privacyHref = lang === 'en' ? '/privacy?lang=en' : '/privacy';
  const termsHref = lang === 'en' ? '/terms?lang=en' : '/terms';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="kailauz, reading app, book app, AI book recommendations, reading tracker, книжное приложение, рекомендации книг, трекер чтения"
        />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#16110E" />
        <link rel="canonical" href={PAGE_URL[lang]} />
        <link rel="alternate" hrefLang="ru" href={PAGE_URL.ru} />
        <link rel="alternate" hrefLang="en" href={PAGE_URL.en} />
        <link rel="alternate" hrefLang="x-default" href={PAGE_URL.ru} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={lang === 'en' ? 'en_US' : 'ru_RU'} />
        <meta property="og:locale:alternate" content={lang === 'en' ? 'ru_RU' : 'en_US'} />
        <meta property="og:image" content={`${SITE}/landing/share-${lang}.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t.shareAlt} />
        <meta name="twitter:image" content={`${SITE}/landing/share-${lang}.jpg`} />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta property="og:url" content={PAGE_URL[lang]} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="kailauz" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="preload" href="/landing/hero.webp" as="image" type="image/webp" fetchpriority="high" />
        <link rel="manifest" href="/site.webmanifest" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(lang, description)) }} />
      </Head>

      <div className={`${styles.page} ${onest.variable}`}>
        <div className={styles.botanical} aria-hidden="true" />

        <header className={styles.header}>
          <div className={`${styles.wrap} ${styles.headerInner}`}>
            <a href={lang === 'en' ? '/en' : '/'} className={styles.brand}><img src="/landing/logo-glyph.png" alt="" />kailauz</a>
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
              <img src="/landing/hero.webp" alt={t.heroAlt} fetchpriority="high" />
            </div>

            <div className={`${styles.wrap} ${styles.copy}`}>
              <h1 className={styles.title} id="hero-title">
                {t.accentFirst
                  ? <>{t.titleStart}<br /><em>{t.titleAccent}</em>{t.titleEnd}</>
                  : <>{t.titleStart}<br />ты <em>{t.titleAccent}</em></>}
              </h1>
              <p className={styles.lead}>{t.lead} <span className={styles.nowrap}>{t.leadEnd}</span></p>

              {done ? (
                <div className={styles.done} role="status">
                  <i><CheckIcon /></i>
                  {t.waitlistSuccess}
                </div>
              ) : (
                <form id="waitlist" className={styles.form} onSubmit={handleSubmit} aria-busy={loading} noValidate>
                  <div className={`${styles.field} ${error === 'email' ? styles.invalid : ''}`}>
                    <label htmlFor="email">
                      <span className="srOnly">{t.waitlistLabel}</span>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className={styles.input}
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        aria-invalid={error === 'email'}
                        aria-describedby={message ? 'waitlist-message' : undefined}
                        onChange={(event) => { setEmail(event.target.value); if (error === 'email') setError(''); }}
                      />
                    </label>
                    <button type="submit" className={styles.button} aria-busy={loading}>
                      {loading ? <><span className={styles.spinner} aria-hidden="true" /><span className="srOnly">{t.waitlistButton}</span></> : t.waitlistButton}
                    </button>
                  </div>
                  {message ? <p className={styles.message} id="waitlist-message" role="alert"><AlertIcon />{message}</p> : null}
                  <label className={styles.consent} htmlFor="consent">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => { setConsent(event.target.checked); if (error === 'consent') setError(''); }}
                    />
                    <span>{t.consentLabel}</span>
                  </label>
                </form>
              )}

              {waitlistCount !== null ? (
                <p className={styles.perk}>
                  <span className={styles.dot} aria-hidden="true" />
                  {t.perkCount(waitlistCount)}
                </p>
              ) : null}
            </div>

            <div className={styles.hand} aria-hidden="true">
              <div className={styles.handInner}>
                <img className={styles.handPhoto} src="/landing/hand.webp" alt="" />
                <div className={styles.screen}>
                  {screensFor(lang).map((src) => <img className={styles.shot} key={src} src={src} alt="" />)}
                  <span className={styles.island} />
                </div>
                <img className={styles.fingers} src="/landing/fingers.webp" alt="" />
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
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
