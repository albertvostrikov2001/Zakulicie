# CLAUDE.md — Закулисье (Zakulicie)

## Проект

**Сайт:** https://albertvostrikov2001.github.io/Zakulicie/  
**Репозиторий:** GitHub → `albertvostrikov2001/Zakulicie`  
**Локальный путь:** `D:\Work Unity\Zakulicie\`  
**Тип:** Next.js 14 → static export → GitHub Pages  
**Язык контента:** Русский  
**Бизнес:** Ивент-агентство «Закулисье», Новосибирск. Корпоративные и деловые события, тимбилдинг, рекламные акции.

---

## Tech Stack

| Слой | Технология |
|---|---|
| Framework | Next.js 14.2.35 (App Router) |
| Рендеринг | `output: "export"` (static HTML) для GitHub Pages |
| Стили | Tailwind CSS 3 + CSS Modules (`*.module.css`) |
| Анимации | GSAP 3 + `@gsap/react`, Framer Motion |
| Скролл | Lenis (smooth scroll) |
| Формы | React Hook Form + Zod |
| CMS | Sanity (опционально; fallback — статические файлы в `lib/content/`) |
| Шрифты | Google Fonts: Unbounded (`--font-display`), Inter (`--font-body`) |
| Email | Resend (API route, недоступен в static export) |
| Форма на prod | Web3Forms (ключ через `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`) |
| Слайдер | Swiper 11 |
| Иконки | Lucide React |

---

## Деплой

### Как устроен деплой

1. **Push в `main`** → GitHub Actions автоматически собирает и деплоит.
2. Workflow: `.github/workflows/deploy-github-pages.yml`
3. Runner: `macos-latest` (для корректной работы Sharp/ffmpeg)
4. Команды CI:
   ```
   npm ci --legacy-peer-deps
   rm -rf app/api app/studio   ← удаляем серверные роуты
   npm run build
   touch out/.nojekyll
   ```
5. Артефакт из папки `out/` деплоится через `actions/deploy-pages@v4`

### Переменные окружения в CI (GitHub Secrets)

| Secret | Назначение |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (обычно `production`) |
| `WEB3FORMS_ACCESS_KEY` | Ключ для Web3Forms (форма обратной связи) |

### Автоматически проставляются в CI

```
GITHUB_PAGES=true
NEXT_PUBLIC_PAGES_BASE_PATH=/Zakulicie
NEXT_PUBLIC_SITE_URL=https://albertvostrikov2001.github.io/Zakulicie
```

### next.config.mjs — логика basePath

- `GITHUB_PAGES=true` + `NODE_ENV=production` → `output: "export"`, `trailingSlash: true`
- `basePath` и `assetPrefix` = `/Zakulicie`
- Изображения: `unoptimized: true` в static режиме
- Кастомный домен: поставить `NEXT_PUBLIC_PAGES_BASE_PATH=""` → basePath отключается

### Локальный запуск

```bash
npm run dev        # http://localhost:3000 (через scripts/dev.mjs)
npm run build      # обычный Next.js build (не static)
npm run studio     # Sanity Studio на :3333
```

### Сборка static локально (для проверки)

```bash
$env:GITHUB_PAGES="true"; $env:NODE_ENV="production"; npm run build
# Результат в папке out/
```

---

## Структура проекта

```
app/
  (site)/
    page.tsx              ← главная страница
    layout.tsx            ← layout сайта (меню, футер)
    cases/                ← список и детали кейсов
    services/             ← лендинги услуг
    about/, blog/, contacts/, ...
  api/                    ← API routes (удаляются при GH Pages build)
  studio/                 ← Sanity Studio embed (удаляется при GH Pages build)
  globals.css             ← CSS custom properties, keyframes, Tailwind base
  layout.tsx              ← root layout (шрифты, metadata, провайдеры)

components/
  sections/               ← секции главной страницы
    TransitionSection.tsx ← HERO (wordmark + scroll-color + marquee)
    VideoSplitSection.tsx
    StatsSection.tsx
    ServicesSection.tsx
    ClientsShowcase.tsx   ← flip-карточки клиентов (Swiper на mobile)
    TestimonialsSpotlight.tsx + .module.css
    ContactStepSection.tsx
  ui/
    CasesMarquee.tsx      ← бегущие строки кейсов (ниже hero)
    CTAStrip.tsx          ← CTA-вставки ("Обсудить проект")
    CTALink.tsx           ← кнопка с навигацией к форме
    SiteImage.tsx         ← обёртка next/image с basePath
    EventPhrase.tsx
  forms/
    ContactStepForm.tsx   ← 4-шаговая форма (id="contact-form")
    ContactForm.tsx
  layout/                 ← Header, Footer, Nav
  providers/
    SmoothScrollProvider  ← Lenis
    ContactModalProvider

lib/
  data.ts                 ← getCasesResolved, getFeaturedCases, getTestimonials...
  types.ts                ← CaseStudy, ServiceLanding, Testimonial, BlogPost
  site.ts                 ← getSiteUrl(), SITE_NAME
  content/
    cases.ts              ← статические данные кейсов (fallback без Sanity)
    services.ts
    testimonials.ts
    blog.ts
    blur-data.json        ← base64 blur placeholders для изображений
  sanity/                 ← fetchContent.ts (запросы к Sanity API)
  submitContact.ts        ← отправка формы через Web3Forms
  publicPath.ts           ← утилита для basePath-aware путей

hooks/
  useIsMobile.ts          ← SSR-safe `window.innerWidth < 768`
  usePrefersReducedMotion.ts
  useColorInterpolation.ts ← interpolateHex(from, to, progress)
  useCTANavigation.ts     ← scrollToContactForm()

public/
  cases/[slug]/           ← cover.webp, gallery/*.webp
  services/               ← hero images услуг
  video/                  ← showreel

scripts/
  deploy-pages.mjs
  trigger-pages-deploy.mjs
  verify-live.mjs         ← проверка скорости/стиля на живом сайте
```

---

## Главная страница — порядок секций

```tsx
// app/(site)/page.tsx
<TransitionSection cases={allCases.slice(0, 7)} />   // 1. HERO
<VideoSplitSection />                                  // 2. Шоурил
<EventPhrase />                                        // 3. «Творчески. Системно. Про людей»
<StatsSection />                                       // 4. Цифры (20 лет, 3000+ событий)
<CasesMarquee cases={featured} />                     // 5. Бегущие строки кейсов
<CTAStrip text="Готовы обсудить ваш проект?" />       // 6. CTA
<ServicesSection />                                    // 7. Направления работы
<CTAStrip variant="filled" text="Есть задача?..." />  // 8. CTA (оранжевый фон)
<ClientsShowcase />                                    // 9. Клиенты (flip-cards)
<TestimonialsSpotlight />                              // 10. Отзывы
<ContactStepSection />                                 // 11. Форма (id="contact-form")
```

---

## TransitionSection (Hero) — детали реализации

**Файл:** `components/sections/TransitionSection.tsx`

### Что делает

- Большой wordmark «ЗАКУЛИСЬЕ» (Unbounded, `clamp(40px, 10.5vw, 180px)`)
- **Scroll-driven цвет фона:** orange `#B5611C` → dark `#0a0a0a` через GSAP ScrollTrigger
- **Mobile marquee** (только `< md`): горизонтальная лента кейсов, auto-scroll
- **Desktop:** h1 заголовок + кнопка «Обсудить проект» (внизу справа)
- `min-height: 116vh` + `position: sticky` для scroll-driven эффекта

### Mobile marquee — реализация

```tsx
// Дублируем кейсы для seamless loop
const marqueeItems = cases.length > 0 ? [...cases, ...cases] : [];

// Скорость 143 px/сек, измеряется после mount через RAF
const trackRef = useRef<HTMLDivElement>(null);
const [marqueeStyle, setMarqueeStyle] = useState<React.CSSProperties>({
  animation: "hero-marquee-ltr 9s linear infinite", // SSR fallback
});

useEffect(() => {
  if (cases.length === 0) return;
  const id = requestAnimationFrame(() => {
    const el = trackRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (half > 0) {
      const dur = Math.max(2, half / 143); // 143 px/sec
      setMarqueeStyle({
        "--marquee-dist": `-${half}px`,
        animation: `hero-marquee-ltr ${dur.toFixed(1)}s linear infinite`,
      } as React.CSSProperties);
    }
  });
  return () => cancelAnimationFrame(id);
}, [cases.length]);
```

**Keyframe в globals.css:**
```css
@keyframes hero-marquee-ltr {
  from { transform: translateX(0); }
  to   { transform: translateX(var(--marquee-dist, -2656px)); }
}
```

**ВАЖНО:** `translateX(-50%)` НЕ работает для marquee — `%` считается от layout width (~390px), а не от scrollWidth (~4000px). Нужно передавать пиксели через CSS var.

**ВАЖНО:** CSS var `--marquee-dist` и `animation` должны быть в одном React state объекте. Иначе при ре-рендере CSS var сбросится, а duration останется.

### Карточки в marquee

```tsx
style={{
  width: "clamp(320px, 82vw, 560px)",
  height: "clamp(210px, 53vw, 365px)",
  borderRadius: "var(--border-radius-card)",
}}
```

### Видимость marquee

- На мобильном (`< md`): видима
- На десктопе (`≥ md`): скрыта (`md:hidden` на обёртке)
- h1 и accent bar: `hidden md:block` (только десктоп)

---

## CasesMarquee — бегущие строки (ниже hero)

**Файл:** `components/ui/CasesMarquee.tsx`

- 2 строки: row1 → left-to-right (42s), row2 → right-to-left (38s)
- GSAP `fromTo` с `repeat: -1`, пауза на hover/touch
- row2 скрыта на мобильном (`hidden sm:block`)
- Карточки: `w-[78vw] h-[52vw] sm:w-[340px] sm:h-[220px] md:w-[380px] md:h-[240px]`

---

## CTAStrip — кнопки «Обсудить проект»

**Файл:** `components/ui/CTAStrip.tsx`

- variant `"default"` — bordered/minimal
- variant `"filled"` — оранжевый фон
- Мобильный: текст и кнопка выровнены вправо (`items-end`, `text-right`)
- Кнопка кликает → `CTALink` → `useCTANavigation` → скролл к `#contact-form`

**Форма имеет id:**
```tsx
// ContactStepForm.tsx
<div id="contact-form" className={`${styles.formRoot} scroll-mt-20`}>
```

---

## Цветовая система (CSS custom properties)

```css
:root {
  --color-bg:               #0A0A0A;
  --color-surface:          #111111;
  --color-surface-elevated: #181818;
  --color-border:           rgba(255, 255, 255, 0.07);
  --color-accent:           #B5611C;     /* оранжевый */
  --color-accent-hover:     #C97030;
  --color-text-primary:     #F5F5F5;
  --color-text-secondary:   rgba(255, 255, 255, 0.60);
  --color-text-muted:       rgba(255, 255, 255, 0.35);
  --border-radius-card:     2px;
  --spacing-section:        100px;
}
```

**Tailwind алиасы:** `bg-accent`, `text-accent`, `border-accent`, `bg-surface`, `text-primary`, `text-secondary`, `text-muted` и т.д.

---

## Клиенты — mobile оранжевые карточки

В `globals.css`:
```css
@media (max-width: 767px) {
  .clients-swiper .flip-card-face:not(.flip-card-back-face) {
    background: var(--color-accent);
    border-color: rgba(255, 190, 120, 0.3);
    box-shadow: 0 4px 20px rgba(181, 97, 28, 0.35), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }
}
```

---

## Testimonials — отступы

```css
/* TestimonialsSpotlight.module.css */
.section { padding: 80px 64px 56px; }

@media (max-width: 767px) {
  .section { padding: 40px 20px 24px; min-height: auto; }
}
```

---

## Типы данных

### CaseStudy

```ts
type CaseStudy = {
  title: string;
  slug: string;
  client: string;
  serviceTypeSlug: ServiceSlug;
  year: number;
  excerpt: string;
  task: string;
  solution: string[];
  result: string[];
  resultNumbers?: { label: string; value: string }[];
  heroImage: SiteImage;   // { src, alt, blurDataURL?, width?, height?, objectPosition? }
  heroVideoUrl?: string;
  gallery: SiteImage[];
  clientQuote?: { text, author, position, company };
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
};
```

### ServiceSlug (enum)

```ts
"korporativnye-meropriyatiya" | "timbilding" | "delovye-meropriyatiya" |
"reklamnye-akcii" | "arenda-rekvizita"
```

---

## Data flow — кейсы

```
Sanity CMS (если настроен)
  └── fetchCasesFromSanity()  ──►  getCasesResolved()  ──►  page.tsx
Static lib/content/cases.ts  ──►  (fallback)
```

- `getCasesResolved()` — все кейсы
- `getFeaturedCases()` — `isFeatured === true`, сортировка по году
- `allCases.slice(0, 7)` → в `TransitionSection` (hero marquee)
- `featured` → в `CasesMarquee`

---

## Изображения

- Хранятся в `public/cases/[slug]/cover.webp`, `gallery/1.webp` и т.д.
- Blur placeholders: `lib/content/blur-data.json` (base64, генерируется скриптом)
- В static export: `images.unoptimized: true` — next/image не оптимизирует
- `SiteImage.tsx` — обёртка, добавляет basePath к src в GH Pages режиме
- `sizes` для hero marquee карточек: `"(max-width: 640px) 82vw, 560px"`

---

## Анимации — важные паттерны

### GSAP scroll-driven (TransitionSection)
```ts
ScrollTrigger.create({
  trigger: section,
  start: "top top",
  end: "bottom bottom",
  scrub: 0.8,
  onUpdate: (self) => {
    bg.style.backgroundColor = interpolateHex(LIGHT, DARK, self.progress);
    // LIGHT = "#B5611C" (orange), DARK = "#0a0a0a"
  }
});
```

### CSS marquee keyframe (globals.css)
Использует CSS custom property для точного пиксельного смещения:
```css
@keyframes hero-marquee-ltr {
  from { transform: translateX(0); }
  to   { transform: translateX(var(--marquee-dist, -2656px)); }
}
```
Значение `--marquee-dist` = `-scrollWidth/2` (ровно половина, т.к. items дублированы).

### Reduceed motion
Везде: `usePrefersReducedMotion()` — если true, анимации отключаются или заменяются статичным состоянием.

---

## Известные проблемы и решения

### ChunkLoadError на production
**Причина:** Браузер кэшировал старый HTML со ссылками на старые chunk-хэши. После деплоя новые хэши → 404 на чанки.  
**Решение:** Принудительный hard reload (`Ctrl+Shift+R` или `location.reload(true)`).

### translateX(-50%) не работает в marquee
**Причина:** `%` в translateX = % от layout width элемента (~390px), а не от scrollWidth.  
**Решение:** Передавать пиксели через CSS var (`--marquee-dist`).

### React ре-рендер сбрасывает CSS custom property
**Причина:** `el.style.setProperty()` работает до ре-рендера. После React перезаписывает inline styles из state.  
**Решение:** Хранить и `--marquee-dist`, и `animation` в одном `useState<React.CSSProperties>`.

### CTA кнопки не скроллят к форме
**Причина:** `ContactStepForm` не имел `id="contact-form"`.  
**Решение:** `<div id="contact-form" className="... scroll-mt-20">` на корневом элементе формы.

---

## Команды разработки

```bash
# Локальный dev сервер
npm run dev

# Линт
npm run lint

# Форматирование
npm run format

# Sanity Studio
npm run studio

# Проверка деплоя (скрипт проверяет живой сайт)
node scripts/verify-live.mjs
```

---

## GitHub Actions — ручной деплой

Можно запустить вручную через GitHub UI:  
`Actions → Deploy to GitHub Pages → Run workflow`

Или через gh CLI:
```bash
gh workflow run deploy-github-pages.yml
```

---

## Sanity CMS

- Проект: задаётся через `NEXT_PUBLIC_SANITY_PROJECT_ID`
- Dataset: `NEXT_PUBLIC_SANITY_DATASET` (обычно `production`)
- Studio: `app/studio/` (удаляется при GH Pages build)
- Если Sanity не настроен → используются статические данные из `lib/content/`
- Типы контента: кейсы, отзывы, блог-посты

---

## Мобильная версия — ключевые решения

| Элемент | Мобильная версия |
|---|---|
| Hero h1 | Скрыт (`hidden md:block`) |
| Hero accent bar | Скрыт (`hidden md:block`) |
| Hero marquee | Видим (`md:hidden` на обёртке) |
| CasesMarquee row2 | Скрыта (`hidden sm:block`) |
| CTAStrip текст | Выравнивание вправо (`text-right`) |
| Клиенты flip-card фронт | Оранжевый фон (`.clients-swiper`) |
| Testimonials padding | `40px 20px 24px` |
| Форма | `ContactStepForm` (4 шага, id="contact-form") |
