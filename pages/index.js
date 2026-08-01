import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

const copy = {
  en: {
    navWaitlist: 'Waiting list',
    navTelegram: 'Telegram',
    label: 'Reading app',
    title: 'kailauz helps you keep track of books and get better recommendations.',
    description:
      'A new reading app for people who want to remember what they read, understand their taste, and choose the next book more consciously.',
    platforms: 'Coming to iOS and Android.',
    waitlistLabel: 'Email',
    waitlistButton: 'Join the waiting list',
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
    navWaitlist: 'Список ожидания',
    navTelegram: 'Telegram',
    label: 'Приложение для чтения',
    title: 'kailauz поможет вести список книг и получать более точные рекомендации.',
    description:
      'Новое приложение для тех, кто хочет помнить прочитанное, лучше понимать свой вкус и осознанно выбирать следующую книгу.',
    platforms: 'Скоро на iOS и Android.',
    waitlistLabel: 'Email',
    waitlistButton: 'Записаться в список ожидания',
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
  const [lang, setLang] = useState('en');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
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
        <meta name="theme-color" content="#0b0b0d" />
        <link rel="canonical" href={lang === 'ru' ? 'https://www.kailauz.com/?lang=ru' : 'https://www.kailauz.com/'} />
        <link rel="alternate" hrefLang="en" href="https://www.kailauz.com/" />
        <link rel="alternate" hrefLang="ru" href="https://www.kailauz.com/?lang=ru" />
        <link rel="alternate" hrefLang="x-default" href="https://www.kailauz.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.kailauz.com/logo.png" />
        <meta name="twitter:image" content="https://www.kailauz.com/logo.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta property="og:url" content={lang === 'ru' ? 'https://www.kailauz.com/?lang=ru' : 'https://www.kailauz.com/'} />
        <meta property="og:title" content="kailauz" />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="kailauz" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="kailauz" />
        <meta name="twitter:description" content={description} />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <main className="page">
        <header className="header">
          <div className="brand">
            <img src="/logo.png" alt="kailauz" className="brandLogo" />
          </div>
          <div className="headerActions">
            <a href="https://t.me/kailauz" className="waitlistLink" target="_blank" rel="noreferrer">{t.navTelegram}</a>
            <a href="#waitlist" className="waitlistLink">{t.navWaitlist}</a>
            <div className="langSwitch" aria-label="Language switcher">
              <button className={lang === 'en' ? 'langBtn active' : 'langBtn'} type="button" onClick={() => setLang('en')}>EN</button>
              <button className={lang === 'ru' ? 'langBtn active' : 'langBtn'} type="button" onClick={() => setLang('ru')}>RU</button>
            </div>
          </div>
        </header>

        <section className="hero">
          <div className="heroContent">
            <p className="label">{t.label}</p>
            <h1>{t.title}</h1>
            <p className="description">{t.description}</p>
            <p className="platforms">{t.platforms}</p>
            {waitlistCount !== null ? (
              <p className="waitlistCount" aria-live="polite">
                <span className="waitlistCountDot" aria-hidden="true" />
                {t.waitlistCount(waitlistCount)}
              </p>
            ) : null}
            <form className="waitlist" id="waitlist" onSubmit={handleSubmit}>
              <label className="srOnly" htmlFor="email">{t.waitlistLabel}</label>
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
              <button type="submit" className="primaryButton" disabled={loading}>
                {loading ? '...' : t.waitlistButton}
              </button>
            </form>
            <label className="consentRow" htmlFor="consent">
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
            <p className="note">{t.waitlistCaption}</p>
            <p className="note">
              <a href="https://t.me/kailauz" className="telegramLink" target="_blank" rel="noreferrer">
                {t.telegramLabel} — @kailauz
              </a>
            </p>
            <p className="legalLinks">
              <a href={lang === 'ru' ? '/privacy?lang=ru' : '/privacy'}>{t.privacy}</a>
              <span>·</span>
              <a href={lang === 'ru' ? '/terms?lang=ru' : '/terms'}>{t.terms}</a>
            </p>
            <p className={status.type ? `status ${status.type}` : 'status'}>{status.message}</p>
          </div>
        </section>
      </main>
    </>
  );
}
