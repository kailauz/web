import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const copy = {
  en: {
    title: 'Terms of Use',
    back: 'Back to home',
    updated: 'Last updated: June 4, 2026',
    intro:
      'These Terms of Use govern your use of the kailauz website and waitlist.',
    sections: [
      {
        title: 'Use of the website',
        body:
          'You agree to use the website lawfully and not to interfere with its operation, security, or availability.'
      },
      {
        title: 'Waitlist',
        body:
          'Joining the waitlist does not guarantee access to the product, a launch date, or future availability in your region.'
      },
      {
        title: 'Product information',
        body:
          'We may change features, pricing, availability, design, or roadmap at any time before public launch.'
      },
      {
        title: 'Intellectual property',
        body:
          'The kailauz brand, website content, design elements, and related materials are owned by kailauz unless stated otherwise.'
      },
      {
        title: 'Disclaimer',
        body:
          'The website and all information on it are provided on an “as is” basis without warranties of any kind.'
      },
      {
        title: 'Contact',
        body:
          'For questions about these terms, contact us via the official Telegram channel at https://t.me/kailauz.'
      }
    ]
  },
  ru: {
    title: 'Условия использования',
    back: 'На главную',
    updated: 'Последнее обновление: 4 июня 2026',
    intro:
      'Эти Условия использования регулируют использование сайта kailauz и списка ожидания.',
    sections: [
      {
        title: 'Использование сайта',
        body:
          'Вы соглашаетесь использовать сайт законно и не вмешиваться в его работу, безопасность или доступность.'
      },
      {
        title: 'Список ожидания',
        body:
          'Запись в список ожидания не гарантирует доступ к продукту, дату запуска или будущую доступность в вашем регионе.'
      },
      {
        title: 'Информация о продукте',
        body:
          'До публичного запуска мы можем менять функции, цену, доступность, дизайн и roadmap продукта.'
      },
      {
        title: 'Интеллектуальная собственность',
        body:
          'Бренд kailauz, контент сайта, элементы дизайна и связанные материалы принадлежат kailauz, если не указано иное.'
      },
      {
        title: 'Ограничение гарантий',
        body:
          'Сайт и вся информация на нем предоставляются «как есть», без каких-либо гарантий.'
      },
      {
        title: 'Контакты',
        body:
          'По вопросам об этих условиях свяжитесь с нами через официальный Telegram-канал https://t.me/kailauz.'
      }
    ]
  }
};

export default function TermsPage() {
  const { query } = useRouter();
  const lang = query.lang === 'ru' ? 'ru' : 'en';
  const t = copy[lang];

  return (
    <>
      <Head>
        <title>{`kailauz — ${t.title}`}</title>
        <meta name="robots" content="index, follow" />
        <meta name="description" content={`${t.title} for kailauz.`} />
        <link rel="canonical" href={lang === 'ru' ? 'https://www.kailauz.com/terms?lang=ru' : 'https://www.kailauz.com/terms'} />
      </Head>

      <main className="legalPage">
        <div className="legalWrap">
          <Link href={lang === 'ru' ? '/?lang=ru' : '/'} className="backLink">{t.back}</Link>
          <h1>{t.title}</h1>
          <p className="legalMeta">{t.updated}</p>
          <p className="legalIntro">{t.intro}</p>
          {t.sections.map((section) => (
            <section key={section.title} className="legalSection">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
