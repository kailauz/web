import { useRouter } from 'next/router';

import LegalDocument from '../components/LegalDocument';

const copy = {
  "ru": {
    "title": "Политика конфиденциальности",
    "back": "На главную",
    "updated": "Последнее обновление: 30 сентября 2026",
    "intro": "Здесь описано, какие данные kailauz обрабатывает при использовании приложения и сайта, зачем они нужны и как вы можете ими управлять.",
    "sections": [
      {
        "title": "Область действия",
        "body": "Политика относится к мобильному приложению kailauz для iOS и Android, сайту и поддержке. Она охватывает аккаунт, библиотеку, личное чтение, профиль, импорт книг, рекомендации и достижения."
      },
      {
        "title": "Аккаунт и профиль",
        "body": "Мы обрабатываем email, идентификатор аккаунта, данные авторизации, выбранное имя, аватар, язык и настройки профиля. Данные входа обрабатываются сервисом авторизации Supabase. Сессия сохраняется на устройстве, а при входе на сайт — в браузере, чтобы вам не приходилось входить заново при каждом открытии."
      },
      {
        "title": "Библиотека и личное чтение",
        "body": "Мы сохраняем добавленные книги и полки, статусы чтения, оценки, заметки, даты, прогресс, страницы и сессии чтения. Эти данные нужны для синхронизации библиотеки, календаря, статистики, учёта перечитываний и достижений. Личные записи и читательский профиль не публикуются в социальной ленте или публичной библиотеке."
      },
      {
        "title": "Импорт текстом, голосом и по штрихкоду",
        "body": "При текстовом импорте обрабатываются введённый текст и результат распознавания книг. Голосовой импорт использует запись с вашего микрофона, её расшифровку и извлечённые сведения. Камера запрашивается для сканирования штрихкода; для поиска книги передаётся распознанный код. Разрешения камеры и микрофона можно отключить в настройках устройства; остальные способы добавления книг остаются доступны."
      },
      {
        "title": "Импорт из LiveLib",
        "body": "По указанной вами ссылке мы получаем доступные данные публичного профиля LiveLib: книги, полки, статусы, оценки и даты чтения. Ссылка на источник и результаты импорта сохраняются для обработки и проверки переноса. Пароль от LiveLib для импорта не требуется."
      },
      {
        "title": "Автоматическая обработка и рекомендации",
        "body": "Для распознавания голосовой записи и разбора текста импорта используется OpenAI: сервису передаются соответствующая запись или текст, включая заметки, если вы включили их во ввод. Не добавляйте во ввод сведения, которыми не хотите делиться для этой обработки. Книги, оценки, предпочтения и реакции используются для рекомендаций и читательского портрета. Автоматические результаты могут быть неточными; данные импорта можно проверить перед сохранением."
      },
      {
        "title": "Поддержка и диагностика",
        "body": "Мы обрабатываем содержание обращений, комментарии, ответы команды и историю статусов, связанные с вашим аккаунтом. Доступ к обращению получают его автор и уполномоченные участники команды. Дополнительные сведения об устройстве, версии приложения, экране и технических ошибках передаются с вашим согласием на диагностику. Не отправляйте пароли и токены доступа в сообщениях."
      },
      {
        "title": "Письма и формы сайта",
        "body": "Если вы подписываетесь на сообщения через сайт, мы сохраняем email, язык, источник заявки, согласие, время его получения и сведения о браузере. Публичный счётчик показывает только общее число заявок. Согласие на новости отдельно от использования приложения; его можно отозвать через поддержку. Служебные письма об аккаунте связаны с действиями по входу, подтверждению email и восстановлению доступа."
      },
      {
        "title": "Для чего нужны данные",
        "body": "Мы используем данные для выполнения запрошенных вами функций, синхронизации, персонализации, защиты аккаунтов и обработки обращений. Данные, необходимые для предоставления сервиса, обрабатываются для исполнения пользовательского соглашения; дополнительные рассылки и диагностика — на основании согласия. Обязательное хранение и исполнение законных запросов осуществляются в пределах применимых требований закона."
      },
      {
        "title": "Сервисы, которым передаются данные",
        "body": "Для авторизации и хранения используются Supabase, для размещения сайта — Vercel, для обработки голосового и текстового импорта — OpenAI. Поиск книг может обращаться к Google Books и Open Library, а импорт из LiveLib — к LiveLib. Эти запросы содержат данные, необходимые соответствующей функции. Обложки и другие материалы могут загружаться с внешних серверов. Обработка поставщиками может происходить за пределами вашей страны. Мы не продаём личные записи пользователей."
      },
      {
        "title": "Хранение и удаление",
        "body": "Данные аккаунта и чтения хранятся для работы вашей библиотеки. Исходная голосовая запись предназначена для обработки импорта: после успешного распознавания и разбора система запрашивает её удаление; при ошибке обработки или удаления запись может сохраняться дольше. Расшифровка и результаты импорта сохраняются отдельно. Обращения и технические записи хранятся, пока нужны для решения проблем, защиты сервиса и выполнения требований закона. Удаление аккаунта доступно в настройках. Оно не удаляет данные у LiveLib и не отзывает отдельную подписку на письма сайта автоматически."
      },
      {
        "title": "Ваши настройки и запросы",
        "body": "В приложении можно редактировать профиль и библиотеку, экспортировать историю чтения и удалить аккаунт. Разрешения устройства меняются в системных настройках. Через поддержку можно запросить доступ к данным, исправление, удаление и отзыв согласия, а также воспользоваться другими правами, предусмотренными применимым законодательством. Для защиты данных может потребоваться подтверждение принадлежности аккаунта."
      },
      {
        "title": "Контакты и изменения",
        "body": "По вопросам данных обращайтесь через раздел поддержки приложения или официальный Telegram по ссылке ниже. При изменении обработки данных мы обновляем эту страницу и дату редакции."
      }
    ]
  },
  "en": {
    "title": "Privacy Policy",
    "back": "Back to home",
    "updated": "Last updated: September 30, 2026",
    "intro": "This policy explains the data kailauz processes when you use the app and website, why they are needed and how you can manage them.",
    "sections": [
      {
        "title": "Scope",
        "body": "This policy covers the kailauz mobile app for iOS and Android, the website and support. It applies to accounts, libraries, personal reading records, profiles, book imports, recommendations and achievements."
      },
      {
        "title": "Account and profile",
        "body": "We process your email address, account identifier, authentication data, chosen name, avatar, language and profile settings. Supabase handles authentication. Session data are stored on your device, or in your browser when you sign in on the website, to keep you signed in."
      },
      {
        "title": "Library and personal reading",
        "body": "We store books and shelves you add, reading statuses, ratings, notes, dates, progress, pages and reading sessions. These records support library synchronisation, the calendar, statistics, rereads and achievements. Personal records and reader profiles are not published in a social feed or public library."
      },
      {
        "title": "Text, voice and barcode imports",
        "body": "Text import processes the text you submit and the extracted book details. Voice import processes your microphone recording, its transcript and the extracted information. Camera access is requested for barcode scanning; the recognised code is sent for book lookup. You can revoke camera or microphone permission in device settings and use other ways to add books."
      },
      {
        "title": "LiveLib import",
        "body": "Using the link you provide, we retrieve available information from a public LiveLib profile, including books, shelves, statuses, ratings and reading dates. We retain the source link and import results to process and review the transfer. Import does not require your LiveLib password."
      },
      {
        "title": "Automated processing and recommendations",
        "body": "OpenAI is used to transcribe voice recordings and parse import text. It receives the relevant recording or text, including notes if you include them in your input. Do not include information you do not want processed this way. Books, ratings, preferences and reactions inform recommendations and your reader portrait. Automated results can be inaccurate; you can review import details before saving them."
      },
      {
        "title": "Support and diagnostics",
        "body": "We process support requests, comments, team replies and status history associated with your account. Requests are accessible to their author and authorised team members. Additional device, app version, screen and error diagnostics are sent with your diagnostic consent. Do not include passwords or access tokens in messages."
      },
      {
        "title": "Emails and website forms",
        "body": "If you subscribe to emails through the website, we store your email address, language, signup source, consent and its timestamp, and browser information. The public counter shows only the total number of signups. News consent is separate from app use and can be withdrawn through support. Account service emails relate to sign-in, email verification and access recovery."
      },
      {
        "title": "Why we process data",
        "body": "We use data to provide the features you request, synchronise records, personalise the service, protect accounts and handle support requests. Data needed to provide the service are processed to perform the user agreement; optional newsletters and diagnostics rely on consent. Mandatory retention and lawful requests are handled as required by applicable law."
      },
      {
        "title": "Service providers and data sharing",
        "body": "We use Supabase for authentication and storage, Vercel for website hosting, and OpenAI for voice and text imports. Book lookup may use Google Books and Open Library; LiveLib imports contact LiveLib. These requests contain information needed for the relevant feature. Covers and other materials may load from external servers. Providers may process data outside your country. We do not sell users’ personal reading records."
      },
      {
        "title": "Retention and deletion",
        "body": "Account and reading data are retained to operate your library. Original voice recordings are used for import processing: after successful transcription and parsing, the system requests their deletion; processing or deletion failures may retain a recording longer. Transcripts and import results are stored separately. Support and technical records are retained as needed to resolve issues, protect the service and meet legal obligations. Account deletion is available in settings. It does not delete data held by LiveLib or automatically withdraw a separate website email subscription."
      },
      {
        "title": "Your controls and requests",
        "body": "You can edit your profile and library, export reading history and delete your account in the app. Device permissions are managed in system settings. Through support you can request access, correction, deletion or withdrawal of consent, and exercise other rights available under applicable law. We may need to verify account ownership to protect your data."
      },
      {
        "title": "Contact and changes",
        "body": "For data questions, use in-app support or the official Telegram link below. When data processing changes, we update this page and its revision date."
      }
    ]
  }
};

export default function PrivacyPage() {
  const { query } = useRouter();
  const lang = query.lang === 'en' ? 'en' : 'ru';
  return <LegalDocument copy={copy[lang]} lang={lang} slug="privacy" />;
}
