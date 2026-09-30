import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import ProfilePreview from '../components/ProfilePreview';
import styles from '../styles/Landing.module.css';

const copy = {
  en: {
    navTelegram: 'Telegram',
    title: 'Your reading',
    titleAccent: 'journal.',
    description: 'Your library, reading progress and recommendations to match your taste.',
    platforms: 'Coming to iOS and Android.',
    waitlistLabel: 'Email',
    waitlistButton: 'Get early access',
    waitlistCaption: 'We will only write when early access becomes available.',
    waitlistCount: (count) => `${count.toLocaleString('en-US')} people are already on the waiting list.`,
    consentLabel:
      'I agree to receive product news, updates, and early access emails from kailauz.',
    consentError: 'Please confirm that you agree to receive email updates.',
    waitlistSuccess: 'You are on the waiting list. We will email you when early access opens.',
    waitlistError: 'Please enter a valid email.',
    waitlistServerError: 'Something went wrong. Please try again in a moment.',
    telegramLabel: 'Official channel for news and updates',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use'
  },
  ru: {
    navTelegram: 'Telegram',
    title: 'Твой дневник',
    titleAccent: 'чтения.',
    description: 'Библиотека, прогресс и рекомендации по твоему вкусу.',
    platforms: 'Скоро на iOS и Android.',
    waitlistLabel: 'Email',
    waitlistButton: 'Получить ранний доступ',
    waitlistCaption: 'Напишем только тогда, когда откроем ранний доступ.',
    waitlistCount: (count) => `Уже ${count.toLocaleString('ru-RU')} человек в списке ожидания.`,
    consentLabel:
      'Я соглашаюсь получать новости о продукте, обновления и письма о раннем доступе от kailauz.',
    consentError: 'Подтвердите согласие на получение email-обновлений.',
    waitlistSuccess: 'Вы в списке ожидания. Напишем, когда откроем ранний доступ.',
    waitlistError: 'Введите корректный email.',
    waitlistServerError: 'Что-то пошло не так. Попробуйте ещё раз чуть позже.',
    telegramLabel: 'Официальный канал для новостей и связи',
    privacy: 'Политика конфиденциальности',
    terms: 'Условия использования'
  }
};

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState('ru');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(null);
  const t = useMemo(() => copy[lang], [lang]);

  useEffect(() => {
    if (router.isReady) setLang(router.query.lang === 'en' ? 'en' : 'ru');
  }, [router.isReady, router.query.lang]);

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
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!isValid) {
      setStatus({ type: 'error', message: t.waitlistError });
      return;
    }

    if (!consent) {
      setStatus({ type: 'error', message: t.consentError });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

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
      setStatus({ type: 'success', message: t.waitlistSuccess });
    } catch (error) {
      setStatus({ type: 'error', message: t.waitlistServerError });
    } finally {
      setLoading(false);
    }
  }

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
        <meta name="theme-color" content="#FAF8F4" />
        <link rel="canonical" href={lang === 'en' ? 'https://www.kailauz.com/?lang=en' : 'https://www.kailauz.com/'} />
        <link rel="alternate" hrefLang="en" href="https://www.kailauz.com/?lang=en" />
        <link rel="alternate" hrefLang="ru" href="https://www.kailauz.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.kailauz.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.kailauz.com/logo.png" />
        <meta name="twitter:image" content="https://www.kailauz.com/logo.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta property="og:url" content={lang === 'en' ? 'https://www.kailauz.com/?lang=en' : 'https://www.kailauz.com/'} />
        <meta property="og:title" content="kailauz" />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="kailauz" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="kailauz" />
        <meta name="twitter:description" content={description} />
        <link rel="preload" href="/landing/fonts/Literata_400Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/landing/fonts/Manrope_400Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <main className={styles.landing} lang={lang}>
        <div className={styles.container}>
          <header className={styles.header}>
            <a href="/" className={styles.brand} aria-label="kailauz">
              <img src="/logo.png" alt="kailauz" className={styles.brandLogo} />
            </a>
            <nav className={styles.navigation} aria-label={lang === 'ru' ? 'Навигация' : 'Navigation'}>
              <a href="https://t.me/kailauz" target="_blank" rel="noreferrer">{t.navTelegram}</a>
            </nav>
            <div className={styles.langSwitch} role="group" aria-label={lang === 'ru' ? 'Язык сайта' : 'Language'}>
              <button aria-pressed={lang === 'ru'} type="button" onClick={() => setLang('ru')}>RU</button>
              <span aria-hidden="true">/</span>
              <button aria-pressed={lang === 'en'} type="button" onClick={() => setLang('en')}>EN</button>
            </div>
          </header>

          <section className={styles.hero} aria-labelledby="hero-title">
            <div className={styles.intro}>
              <p className={styles.productName}>kailauz</p>
              <h1 id="hero-title">{t.title} <span>{t.titleAccent}</span></h1>
              <p className={styles.description}>{t.description}</p>
            </div>

            <div className={styles.product}>
              <ProfilePreview lang={lang} />
            </div>

            <div className={styles.signup}>
              <p className={styles.platforms}>{t.platforms}</p>
              {waitlistCount !== null ? (
                <p className={styles.waitlistCount} aria-live="polite">
                  <span className={styles.waitlistCountDot} aria-hidden="true" />
                  {t.waitlistCount(waitlistCount)}
                </p>
              ) : null}
              <form id="waitlist" onSubmit={handleSubmit} aria-busy={loading}>
                <label className="srOnly" htmlFor="email">{t.waitlistLabel}</label>
                <div className={styles.formControls}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  <button type="submit" className={styles.primaryButton} disabled={loading}>
                    {loading ? '...' : t.waitlistButton}
                  </button>
                </div>
              </form>
              <label className={styles.consentRow} htmlFor="consent">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  required
                />
                <span>{t.consentLabel}</span>
              </label>
              <p className={styles.note}>{t.waitlistCaption}</p>
              <p className={styles.note}>
                <a href="https://t.me/kailauz" target="_blank" rel="noreferrer">
                  {t.telegramLabel} — @kailauz
                </a>
              </p>
              <p className={styles.legalLinks}>
                <a href={lang === 'en' ? '/privacy?lang=en' : '/privacy'}>{t.privacy}</a>
                <a href={lang === 'en' ? '/terms?lang=en' : '/terms'}>{t.terms}</a>
              </p>
              <p className={`${styles.status} ${status.type === 'error' ? styles.error : styles.success}`} role="status" aria-live="polite">{status.message}</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
