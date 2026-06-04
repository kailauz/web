# `apps/web`

## Назначение

Web-часть проекта `kailauz`.

Теперь это минимальный `Next.js`-лендинг, который проще деплоить на `Vercel` и проще развивать дальше без отдельного кастомного Node-сервера.

## Что есть сейчас

Основная структура:

- `pages/index.js` — главная страница лендинга
- `pages/api/waitlist.js` — серверный endpoint для waitlist
- `pages/privacy.js` — политика конфиденциальности
- `pages/terms.js` — условия использования
- `styles/globals.css` — глобальные стили лендинга
- `public/robots.txt` — robots
- `public/sitemap.xml` — sitemap
- `public/site.webmanifest` — manifest
- `sql/001_waitlist.sql` — таблица и policy для waitlist в Supabase
- `sql/002_waitlist_consent.sql` — consent-поля для waitlist

## Что делает текущий сайт

- показывает минимальный двуязычный лендинг `EN / RU`
- объясняет продукт коротко и без лишнего шума
- собирает email в waitlist
- запрашивает согласие на email-обновления
- использует `Supabase` для сохранения waitlist-заявок
- подходит для деплоя на `Vercel`

## SEO-база

Уже заложены:

- `title`
- `meta description`
- `canonical`
- `hreflang`
- `Open Graph`
- `Twitter meta`
- `robots.txt`
- `sitemap.xml`
- `manifest`

## Waitlist

Waitlist работает через `pages/api/waitlist.js`.

Endpoint:

- валидирует email
- требует consent
- пишет запись в `public.landing_waitlist`
- сохраняет `consent_email_marketing` и `consent_at`
- использует `NEXT_PUBLIC_SUPABASE_URL`
- использует `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Env

В `apps/web/.env` должны быть:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## Как запустить локально

1. Убедиться, что в `apps/web/.env` заданы `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Выполнить SQL из `apps/web/sql/001_waitlist.sql` в Supabase SQL Editor.
3. Выполнить SQL из `apps/web/sql/002_waitlist_consent.sql` в Supabase SQL Editor.
4. Выполнить `yarn install` внутри `apps/web`.
5. Выполнить `yarn dev` внутри `apps/web`.
6. Открыть `http://localhost:3000`.

## Пакетный менеджер

Для `apps/web` используем `yarn`.

Базовые команды:

- `yarn install`
- `yarn dev`
- `yarn build`
- `yarn start`

## Деплой

Рекомендуемый деплой для этого модуля — `Vercel`.

Для Vercel достаточно:

- импортировать репозиторий `kailauz/web`
- оставить root directory как `./`
- добавить env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
