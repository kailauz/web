import Head from 'next/head';
import { waitlistCopy } from '../../../lib/waitlistCopy';
import styles from '../../../styles/LegalDocument.module.css';

const messages = {
  success: 'waitlistSuccess',
  email: 'waitlistError',
  consent: 'consentError',
  unavailable: 'waitlistServerError',
};

export default function WaitlistResult({ lang, status }) {
  const home = lang === 'en' ? '/en' : '/';
  const copy = waitlistCopy[lang];
  return (
    <>
      <Head>
        <title>{`Kailauz — ${copy.waitlistButton}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className={`${styles.page} ${styles.wrap}`}>
        <div className={styles.document}>
          <h1>{copy[messages[status]]}</h1>
          <a className={styles.backLink} href={`${home}#waitlist`}>
            {lang === 'en' ? 'Back to home' : 'На главную'}
          </a>
        </div>
      </main>
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: Object.keys(waitlistCopy).flatMap((lang) =>
      Object.keys(messages).map((status) => ({ params: { lang, status } })),
    ),
    fallback: false,
  };
}

export function getStaticProps({ params: { lang, status } }) {
  return { props: { lang, status } };
}
