import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import styles from '../styles/LegalDocument.module.css';

export default function LegalDocument({ copy, lang, slug }) {
  const supportEmail = process.env.KAILAUZ_SUPPORT_EMAIL;
  const ru = `https://www.kailauz.com/${slug}`;
  const en = `https://www.kailauz.com/en/${slug}`;
  const home = lang === 'en' ? '/en' : '/';
  return (
    <>
      <Head>
        <title>{`kailauz — ${copy.title}`}</title>
        <meta name="robots" content="index, follow" />
        <meta name="description" content={copy.intro} />
        <meta name="theme-color" content="#FAF8F4" />
        <link rel="canonical" href={lang === 'en' ? en : ru} />
        <link rel="alternate" hrefLang="ru" href={ru} />
        <link rel="alternate" hrefLang="en" href={en} />
        <link rel="alternate" hrefLang="x-default" href={ru} />
      </Head>
      <main className={styles.page}>
        <div className={styles.wrap}>
          <header className={styles.header}>
            <Link href={home} aria-label="kailauz">
              <Image src="/logo.png" alt="kailauz" className={styles.brandLogo} width="44" height="44" />
            </Link>
            <Link href={home} className={styles.backLink}>← {copy.back}</Link>
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
            {supportEmail && <a className={styles.contact} href={`mailto:${encodeURIComponent(supportEmail).replace('%40', '@')}`}>{supportEmail}</a>}
          </article>
        </div>
      </main>
    </>
  );
}
