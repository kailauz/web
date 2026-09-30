import { useRouter } from 'next/router';

import LegalDocument from '../components/LegalDocument';

const copy = {
  "ru": {
    "title": "Условия использования",
    "back": "На главную",
    "updated": "Последнее обновление: 30 сентября 2026",
    "intro": "Эти условия регулируют использование мобильного приложения kailauz, сайта и поддержки. Используя сервис, вы соглашаетесь с этими условиями в пределах применимого законодательства.",
    "sections": [
      {
        "title": "Что предоставляет kailauz",
        "body": "kailauz — личный читательский дневник. В приложении доступны библиотека и полки, поиск и карточки книг, статусы и прогресс чтения, оценки и заметки, календарь и статистика, профиль и рекомендации, импорт текстом, голосом, по штрихкоду и из LiveLib, достижения и поддержка."
      },
      {
        "title": "Аккаунт",
        "body": "Используйте свой аккаунт, указывайте данные, которыми вправе пользоваться, и сохраняйте доступ к email. Вы отвечаете за действия в своём аккаунте и сохранность данных входа. Если доступ получен посторонним, смените пароль и обратитесь в поддержку."
      },
      {
        "title": "Личные записи",
        "body": "Права на ваши заметки, оценки и другой собственный контент остаются у вас. Вы разрешаете kailauz хранить, обрабатывать и отображать эти данные в объёме, необходимом для выбранных вами функций. Добавляйте только сведения и материалы, которыми вправе пользоваться. Личные записи не становятся публичными публикациями из-за добавления в библиотеку."
      },
      {
        "title": "Импорт книг",
        "body": "Для импорта из LiveLib используйте свой публичный профиль или данные, на перенос которых у вас есть разрешение. При текстовом, голосовом и штрихкодном импорте проверяйте найденные книги, издания, оценки и даты перед подтверждением. Совпадения и полнота переноса зависят от исходных данных и доступности внешних каталогов. kailauz не является сервисом LiveLib и не управляет его работой."
      },
      {
        "title": "Рекомендации и читательский портрет",
        "body": "Рекомендации, читательский портрет и распознавание импорта формируются автоматически и могут содержать ошибки. Портрет описывает читательские предпочтения и не является психологической или медицинской оценкой. Рекомендации не гарантируют, что книга вам понравится."
      },
      {
        "title": "Достижения",
        "body": "Значки выдаются по правилам соответствующих достижений с учётом записей о книгах и активности. Это коллекционные достижения внутри приложения, а не деньги, скидки или право на привилегии. Исправления исходных данных и правил подсчёта могут влиять на отображаемый прогресс."
      },
      {
        "title": "Книги и сторонние материалы",
        "body": "Карточки, обложки и библиографические сведения могут поступать из внешних каталогов. Права на книги, переводы, обложки и аудиозаписи принадлежат их правообладателям. Добавление книги или аудиокниги в библиотеку kailauz не предоставляет право на её полный текст, скачивание или прослушивание."
      },
      {
        "title": "Поддержка",
        "body": "Обращения и переписка с командой доступны через ваш аккаунт. Описывайте проблему достоверно и не отправляйте пароли, токены и чужие персональные данные без необходимости. Статус обращения показывает ход его обработки, но не гарантирует конкретный срок исправления или реализации предложения."
      },
      {
        "title": "Допустимое использование",
        "body": "Нельзя нарушать закон и права других лиц, пытаться получить доступ к чужим аккаунтам, обходить ограничения, перегружать сервис или вмешиваться в его безопасность. Мы можем ограничить доступ при нарушениях или угрозе безопасности в пределах применимого законодательства."
      },
      {
        "title": "Доступность и ответственность",
        "body": "Мы развиваем сервис и можем проводить обслуживание и исправлять ошибки. Работа отдельных функций зависит от сети, устройства и внешних поставщиков. Мы не гарантируем непрерывную работу и отсутствие ошибок. Ограничения ответственности применяются только в той мере, в какой это разрешено законом, и не исключают обязательные права пользователей."
      },
      {
        "title": "Данные и прекращение использования",
        "body": "Обработка данных описана в Политике конфиденциальности. Историю чтения можно экспортировать, аккаунт — удалить через настройки приложения. Отдельную подписку на сообщения сайта можно отменить через поддержку. Отправка email через форму сайта сама по себе не создаёт аккаунт приложения и не оформляет покупку."
      },
      {
        "title": "Изменения условий и контакты",
        "body": "Актуальная редакция условий опубликована на этой странице с датой обновления. Изменения применяются с учётом требований закона и не отменяют обязательные права пользователей. По вопросам работы сервиса и этих условий обращайтесь в поддержку приложения или официальный Telegram по ссылке ниже."
      }
    ]
  },
  "en": {
    "title": "Terms of Use",
    "back": "Back to home",
    "updated": "Last updated: September 30, 2026",
    "intro": "These terms govern the kailauz mobile app, website and support. By using the service, you agree to these terms subject to applicable law.",
    "sections": [
      {
        "title": "What kailauz provides",
        "body": "kailauz is a personal reading journal. The app provides a library and shelves, book search and details, reading statuses and progress, ratings and notes, a calendar and statistics, a profile and recommendations, text, voice, barcode and LiveLib imports, achievements and support."
      },
      {
        "title": "Your account",
        "body": "Use your own account, provide information you are entitled to use and maintain access to your email. You are responsible for actions under your account and for keeping sign-in credentials secure. If someone gains unauthorised access, change your password and contact support."
      },
      {
        "title": "Personal records",
        "body": "You retain rights to your notes, ratings and other original content. You allow kailauz to store, process and display those data as needed for the features you use. Only add information and materials you are entitled to use. Adding a record to your library does not make it a public post."
      },
      {
        "title": "Book imports",
        "body": "For LiveLib import, use your own public profile or data you have permission to transfer. With text, voice and barcode imports, review matched books, editions, ratings and dates before confirming. Matching and completeness depend on source data and external catalogue availability. kailauz is independent of LiveLib and does not control its operation."
      },
      {
        "title": "Recommendations and reader portrait",
        "body": "Recommendations, reader portraits and import recognition are generated automatically and may contain errors. The portrait describes reading preferences and is not a psychological or medical assessment. Recommendations do not guarantee that you will enjoy a book."
      },
      {
        "title": "Achievements",
        "body": "Badges are awarded under the rules of each achievement using book records and activity. They are in-app collectibles, not money, discounts or an entitlement to privileges. Corrections to source data or calculation rules may affect displayed progress."
      },
      {
        "title": "Books and third-party materials",
        "body": "Book details, covers and bibliographic information may come from external catalogues. Rights to books, translations, covers and recordings belong to their respective rights holders. Adding a book or audiobook to kailauz does not grant access or rights to its full text, download or audio playback."
      },
      {
        "title": "Support",
        "body": "Support requests and conversations with the team are available through your account. Describe issues accurately and do not send passwords, tokens or unnecessary personal information about others. A request status indicates its progress but does not guarantee a specific date for a fix or feature."
      },
      {
        "title": "Acceptable use",
        "body": "Do not violate the law or others’ rights, attempt to access other accounts, bypass limits, overload the service or interfere with its security. Access may be restricted for violations or security threats as permitted by applicable law."
      },
      {
        "title": "Availability and responsibility",
        "body": "We maintain and develop the service and may perform maintenance or fix errors. Some features depend on connectivity, your device and external providers. We do not guarantee uninterrupted or error-free operation. Liability limitations apply only to the extent permitted by law and do not exclude mandatory user rights."
      },
      {
        "title": "Data and ending use",
        "body": "Data processing is described in the Privacy Policy. You can export reading history and delete your account in app settings. A separate website email subscription can be withdrawn through support. Submitting an email through a website form does not by itself create an app account or make a purchase."
      },
      {
        "title": "Changes and contact",
        "body": "The current terms are published on this page with their revision date. Changes apply subject to legal requirements and do not override mandatory user rights. For questions about the service or these terms, use in-app support or the official Telegram link below."
      }
    ]
  }
};

export default function TermsPage() {
  const { query } = useRouter();
  const lang = query.lang === 'en' ? 'en' : 'ru';
  return <LegalDocument copy={copy[lang]} lang={lang} slug="terms" />;
}
