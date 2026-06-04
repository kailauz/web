import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const copy = {
  en: {
    title: 'Privacy Policy',
    back: 'Back to home',
    updated: 'Last updated: June 4, 2026',
    intro:
      'This Privacy Policy explains how kailauz collects and uses personal data when you join our waitlist and interact with our website.',
    sections: [
      {
        title: 'What we collect',
        body:
          'We collect your email address, language preference, consent status, consent timestamp, source information, and basic technical data such as your user agent.'
      },
      {
        title: 'Why we collect it',
        body:
          'We use this data to manage the waitlist, send product news, updates, early access invitations, and improve the launch experience for kailauz.'
      },
      {
        title: 'Legal basis and consent',
        body:
          'When you join the waitlist, you explicitly agree to receive product emails from kailauz. You can withdraw your consent at any time by unsubscribing from emails or contacting us.'
      },
      {
        title: 'How long we keep data',
        body:
          'We keep waitlist data only as long as it is needed for launch communications, product updates, or legal compliance.'
      },
      {
        title: 'Who we share data with',
        body:
          'We use infrastructure providers such as Supabase and Vercel to operate the site and store waitlist data. We do not sell your personal data.'
      },
      {
        title: 'Your rights',
        body:
          'You can request access, correction, deletion, or withdrawal of consent by contacting us.'
      },
      {
        title: 'Contact',
        body:
          'For privacy requests, contact us through our official Telegram channel at https://t.me/kailauz until a dedicated support email is published.'
      }
    ]
  },
  ru: {
    title: 'Политика конфиденциальности',
    back: 'На главную',
    updated: 'Последнее обновление: 4 июня 2026',
    intro:
      'Эта Политика конфиденциальности объясняет, как kailauz собирает и использует персональные данные, когда вы записываетесь в список ожидания и используете сайт.',
    sections: [
      {
        title: 'Какие данные мы собираем',
        body:
          'Мы собираем ваш email, языковое предпочтение, статус согласия, время согласия, источник заявки и базовые технические данные, например user agent.'
      },
      {
        title: 'Зачем мы это собираем',
        body:
          'Мы используем эти данные для ведения списка ожидания, отправки новостей о продукте, обновлений, приглашений в ранний доступ и улучшения запуска kailauz.'
      },
      {
        title: 'Основание обработки и согласие',
        body:
          'При записи в список ожидания вы явно соглашаетесь получать письма о продукте от kailauz. Вы можете в любой момент отозвать согласие, отписавшись от писем или связавшись с нами.'
      },
      {
        title: 'Срок хранения',
        body:
          'Мы храним данные списка ожидания только столько, сколько это необходимо для коммуникаций по запуску, обновлений продукта и соблюдения закона.'
      },
      {
        title: 'Кому мы передаем данные',
        body:
          'Для работы сайта и хранения данных списка ожидания мы используем инфраструктурных провайдеров, включая Supabase и Vercel. Мы не продаем ваши персональные данные.'
      },
      {
        title: 'Ваши права',
        body:
          'Вы можете запросить доступ к данным, исправление, удаление или отзыв согласия, связавшись с нами.'
      },
      {
        title: 'Контакты',
        body:
          'По вопросам конфиденциальности свяжитесь с нами через официальный Telegram-канал https://t.me/kailauz, пока мы не опубликуем отдельный support email.'
      }
    ]
  }
};

export default function PrivacyPage() {
  const { query } = useRouter();
  const lang = query.lang === 'ru' ? 'ru' : 'en';
  const t = copy[lang];

  return (
    <>
      <Head>
        <title>{`kailauz — ${t.title}`}</title>
        <meta name="robots" content="index, follow" />
        <meta name="description" content={`${t.title} for kailauz.`} />
        <link rel="canonical" href={lang === 'ru' ? 'https://www.kailauz.com/privacy?lang=ru' : 'https://www.kailauz.com/privacy'} />
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
