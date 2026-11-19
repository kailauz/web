import { useEffect, useRef, useState } from 'react';

import styles from '../styles/Landing.module.css';

export function useWaitlist(lang) {
  const [count, setCount] = useState(null);
  const [submission, setSubmission] = useState({ pending: null, completed: null });
  const request = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/waitlist', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (!controller.signal.aborted && Number.isSafeInteger(payload?.count) && payload.count >= 0) {
          setCount((current) => current ?? payload.count);
        }
      })
      .catch(() => undefined);

    return () => {
      controller.abort();
      request.current?.abort();
    };
  }, []);

  async function subscribe(form, email) {
    if (request.current) return;

    const controller = new AbortController();
    request.current = controller;
    setSubmission({ pending: form, completed: null });
    let completed = null;

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang, consent: true }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Waitlist signup failed');

      const payload = await response.json();
      if (Number.isSafeInteger(payload.count) && payload.count >= 0) setCount(payload.count);
      completed = form;
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setSubmission({ pending: null, completed });
    }
  }

  return { count, ...submission, subscribe };
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

export default function WaitlistForm({ id, lang, copy, privacyHref, waitlist }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const { count, pending, completed, subscribe } = waitlist;
  const loading = pending === id;
  const message = { email: copy.waitlistError, consent: copy.consentError, server: copy.waitlistServerError }[error];

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending || completed) return;

    const address = email.trim();
    if (address.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError('email');
      return;
    }
    if (!consent) {
      setError('consent');
      return;
    }

    setError('');
    try {
      await subscribe(id, address);
    } catch (error) {
      if (error.name !== 'AbortError') setError('server');
    }
  }

  return (
    <div id={id} className={styles.waitlist}>
      {completed ? (
        <div className={styles.done} role={completed === id ? 'status' : undefined}>
          <i><CheckIcon /></i>
          {copy.waitlistSuccess}
        </div>
      ) : (
        <form action="/api/waitlist" method="post" className={styles.form} onSubmit={handleSubmit} aria-busy={loading} noValidate>
          <input type="hidden" name="lang" value={lang} />
          <div className={`${styles.field} ${error === 'email' ? styles.invalid : ''}`}>
            <label htmlFor={`${id}-email`}>
              <span className="srOnly">{copy.waitlistLabel}</span>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                className={styles.input}
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                aria-invalid={error === 'email'}
                aria-describedby={error === 'email' ? `${id}-message` : undefined}
                onChange={(event) => { setEmail(event.target.value); if (error === 'email') setError(''); }}
              />
            </label>
            <button type="submit" className={styles.button} disabled={Boolean(pending)} aria-busy={loading}>
              {loading ? <><span className={styles.spinner} aria-hidden="true" /><span className="srOnly">{copy.waitlistButton}</span></> : copy.waitlistButton}
            </button>
          </div>
          {message && <p className={styles.message} id={`${id}-message`} role="alert"><AlertIcon />{message}</p>}
          <div>
            <label className={styles.consent} htmlFor={`${id}-consent`}>
              <input
                id={`${id}-consent`}
                name="consent"
                value="true"
                type="checkbox"
                required
                checked={consent}
                aria-invalid={error === 'consent'}
                aria-describedby={error === 'consent' ? `${id}-message` : undefined}
                onChange={(event) => { setConsent(event.target.checked); if (error === 'consent') setError(''); }}
              />
              <span>{copy.consentLabel}</span>
            </label>
            <a className={styles.privacyLink} href={privacyHref} target="_blank" rel="noopener">{copy.privacy}</a>
          </div>
        </form>
      )}
      {count !== null && (
        <p className={styles.perk}><span className={styles.dot} aria-hidden="true" />{copy.perkCount(count)}</p>
      )}
    </div>
  );
}
