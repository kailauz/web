import Head from 'next/head';
import { useMemo, useState } from 'react';

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
    waitlistSuccess: 'You are on the waiting list. We will email you when early access opens.',
    waitlistError: 'Please enter a valid email.',
    waitlistServerError: 'Something went wrong. Please try again in a moment.',
    telegramLabel: 'Official channel for news and updates'
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
    waitlistSuccess: 'Вы в списке ожидания. Напишем, когда откроем ранний доступ.',
    waitlistError: 'Введите корректный email.',
    waitlistServerError: 'Что-то пошло не так. Попробуйте ещё раз чуть позже.',
    telegramLabel: 'Официальный канал для новостей и связи'
  }
};

export default function Home() {
  const [lang, setLang] = useState('en');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const t = useMemo(() => copy[lang], [lang]);

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

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), lang, source: 'landing' })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Request failed');
      }

      setEmail('');
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
        <link rel="canonical" href={lang === 'ru' ? 'https://kailauz.com/?lang=ru' : 'https://kailauz.com/'} />
        <link rel="alternate" hrefLang="en" href="https://kailauz.com/" />
        <link rel="alternate" hrefLang="ru" href="https://kailauz.com/?lang=ru" />
        <link rel="alternate" hrefLang="x-default" href="https://kailauz.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={lang === 'ru' ? 'https://kailauz.com/?lang=ru' : 'https://kailauz.com/'} />
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
          <div className="brand">kailauz</div>
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
            <p className="note">{t.waitlistCaption}</p>
            <p className="note">
              <a href="https://t.me/kailauz" className="telegramLink" target="_blank" rel="noreferrer">
                {t.telegramLabel} — @kailauz
              </a>
            </p>
            <p className={status.type ? `status ${status.type}` : 'status'}>{status.message}</p>
          </div>
        </section>
      </main>
    </>
  );
}
