# `apps/web`

## Назначение

Web-часть проекта `kailauz`.

На текущем этапе это SEO-ориентированный двуязычный лендинг для домена `kailauz.com`, который должен:

- закреплять бренд в поиске;
- объяснять тему продукта;
- занимать нишу вокруг reading app / book taste / AI reading companion;
- собирать waitlist до релиза приложения.

## Что уже есть

Сейчас в папке лежит первый статический landing prototype:

- `apps/web/index.html`
- `apps/web/styles.css`
- `apps/web/script.js`
- `apps/web/robots.txt`
- `apps/web/sitemap.xml`
- `apps/web/site.webmanifest`

## Что делает текущий лендинг

- рассказывает, кто мы и что строим;
- поддерживает `EN` и `RU`;
- позиционирует `kailauz` как reading brand;
- объясняет продукт без обязательных скриншотов;
- собирает email в waitlist;
- закладывает базовое техническое SEO с первого дня.

## SEO-база, которая уже заложена

- `title`
- `meta description`
- `canonical`
- `hreflang`
- `Open Graph`
- `Twitter meta`
- `robots.txt`
- `sitemap.xml`
- `structured data` для `Organization` и `SoftwareApplication`

## Waitlist

Форма waitlist уже есть в интерфейсе.

Текущее поведение:

- если задан `window.KAILAUZ_WAITLIST_ENDPOINT`, форма отправляет данные туда;
- если endpoint не подключён, email временно сохраняется в `localStorage`.

Это временное решение для frontend prototype.

## Что не делает текущая версия

- не подключена к production backend;
- не отправляет письма автоматически;
- не хранит waitlist в реальной базе;
- не содержит публичные профили пользователей;
- не заменяет мобильное приложение.

## Ближайшие шаги

Следующий логичный этап для `apps/web`:

- подключить waitlist к `Supabase`;
- добавить production deploy;
- подключить analytics;
- завести Search Console;
- расширить SEO-структуру под будущие брендовые и контентные страницы;
- позже добавить публичные профили чтения.


## Waitlist backend

Теперь у лендинга есть минимальный backend рядом с фронтендом:

- `apps/web/server.js` — раздача статики и `POST /api/waitlist`
- `apps/web/sql/001_waitlist.sql` — таблица `landing_waitlist` и `RLS` policy
- `apps/web/.env` — `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Как запустить локально

1. Убедиться, что в `apps/web/.env` заданы `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Выполнить SQL из `apps/web/sql/001_waitlist.sql` в Supabase SQL Editor.
3. Выполнить `yarn install` внутри `apps/web`.
4. Выполнить `yarn dev` внутри `apps/web`.
5. Открыть `http://localhost:3000`.


## Пакетный менеджер

Для `apps/web` используем `yarn`.

Базовые команды:

- `yarn install`
- `yarn dev`
- `yarn start`
