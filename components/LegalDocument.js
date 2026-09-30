import Head from 'next/head';
import Link from 'next/link';

import site from '../styles/Landing.module.css';
import styles from '../styles/LegalDocument.module.css';

export default function LegalDocument({ copy, lang, slug }) {
  return (
    <>
      <Head>
        <title>{`kailauz — ${copy.title}`}</title>
        <meta name="robots" content="index, follow" />
        <meta name="description" content={copy.intro} />
        <meta name="theme-color" content="#FAF8F4" />
        <link rel="canonical" href={`https://www.kailauz.com/${slug}${lang === 'en' ? '?lang=en' : ''}`} />
      </Head>
      <main className={`${site.landing} ${styles.page}`} lang={lang}>
        <div className={styles.wrap}>
          <header className={styles.header}>
            <Link href={lang === 'en' ? '/?lang=en' : '/'} aria-label="kailauz">
              <img src="/logo.png" alt="kailauz" className={site.brandLogo} />
            </Link>
            <Link href={lang === 'en' ? '/?lang=en' : '/'} className={styles.backLink}>← {copy.back}</Link>
          </header>
          <article className={styles.document}>
            <h1>{copy.title}</h1>
            <p className={styles.meta}>{copy.updated}</p>
            <p className={styles.intro}>{copy.intro}</p>
            {copy.sections.map((section) => (
              <section key={section.title} className={styles.section}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
            <a className={styles.contact} href="https://t.me/kailauz" target="_blank" rel="noreferrer">Telegram — @kailauz ↗</a>
          </article>
        </div>
      </main>
    </>
  );
}
