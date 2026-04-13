# Закулисье — сайт event-агентства

Премиальный маркетинговый сайт на **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**. Контент сейчас задаётся статически в `lib/content/`; схемы **Sanity CMS** готовы к подключению (`sanity/`, маршрут `/studio`).

## Требования

- Node.js 20+
- npm

## Быстрый старт

```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Студия Sanity: [http://localhost:3000/studio](http://localhost:3000/studio) (нужны `NEXT_PUBLIC_SANITY_PROJECT_ID` и датасет).

## Переменные окружения

См. `.env.example`. Обязательно задайте `NEXT_PUBLIC_SITE_URL` для продакшена (canonical, OG, sitemap).

Форма заявки:

- `RESEND_API_KEY` — ключ [Resend](https://resend.com)
- `CONTACT_TO_EMAIL` — ящик получателя
- `CONTACT_FROM_EMAIL` — отправитель в формате `Имя <email@домен>` (домен должен быть верифицирован в Resend)

Аналитика (опционально): `NEXT_PUBLIC_YM_ID`, `NEXT_PUBLIC_GA4_ID`.

Hero-видео (опционально): `NEXT_PUBLIC_HERO_VIDEO_URL` — прямой URL файла; без него показывается постер.

## Скрипты

| Команда        | Назначение              |
| -------------- | ----------------------- |
| `npm run dev`  | Разработка              |
| `npm run build`| Сборка                  |
| `npm run start`| Продакшен-сервер        |
| `npm run lint` | ESLint                  |
| `npm run format` | Prettier              |
| `npm run studio` | Sanity Studio (CLI)  |

## GitHub Pages (ссылка для клиента)

После push в `main` workflow **Deploy to GitHub Pages** собирает статику и публикует сайт.

1. В репозитории: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. (Рекомендуется) **Settings → Secrets and variables → Actions**: создайте секрет `WEB3FORMS_ACCESS_KEY` с ключом с [web3forms.com](https://web3forms.com) — иначе форма на статике не отправит письмо (API `/api/contact` в статике недоступен).
3. Публичный URL: **https://albertvostrikov2001.github.io/Zakulicie/** (при смене user/repo обновите URL в `.github/workflows/deploy-github-pages.yml` и в `NEXT_PUBLIC_SITE_URL` в том же файле).

Локально проверить сборку под Pages: `set GITHUB_PAGES=true&& set NEXT_PUBLIC_SITE_URL=https://albertvostrikov2001.github.io/Zakulicie&& rmdir /s /q app\api app\studio 2>nul & npm run build` (Windows; папки `app/api` и `app/studio` потом восстановите из git).

## Деплой (Vercel)

1. Импортируйте репозиторий в Vercel.
2. Перенесите переменные из `.env.example`.
3. После создания проекта в Sanity укажите `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, при необходимости `SANITY_API_READ_TOKEN` для превью.

## Структура контента

- Кейсы: `lib/content/cases.ts`
- Услуги (SEO-страницы): `lib/content/services.ts`
- Блог: `lib/content/blog.ts`
- Отзывы: `lib/content/testimonials.ts`
- Клиенты (wordmarks): `lib/content/clients.ts`

При заданных `NEXT_PUBLIC_SANITY_PROJECT_ID` и датасете **`lib/data.ts`** автоматически подтягивает кейсы, блог и отзывы из Sanity (см. `lib/sanity/fetchContent.ts`, `lib/sanity/queries.ts`). Если в проекте нет документов или запрос падает, используется статика из `lib/content/`.

Анимации и скролл сейчас на **Framer Motion** (лёгкие reveal, hero, счётчики). При необходимости тяжёлых pinned-сцен подключите **GSAP + ScrollTrigger** отдельно — в проекте сознательно не тянули лишний вес на первый экран.

## Качество и доступность

- Тёмная тема, контрастные тексты, `prefers-reduced-motion` для анимаций.
- Ссылка «Перейти к содержимому» в корневом layout.
- Форма с `label`, `role="alert"` для ошибок.

## Лицензия

Проект создан для агентства «Закулисье». Права на тексты и визуальные материалы закрепите в договоре с заказчиком.
