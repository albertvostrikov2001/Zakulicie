"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./TestimonialsSpotlight.module.css";

type Slide = {
  tag: string;
  photo: string;
  photoAlt: string;
  photoLogo?: boolean;
  quote: string;
  name: string;
  pos: string;
  initials: string;
  company: string;
  source: "2gis" | "site";
};

const pagesBase = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";

function asset(path: string): string {
  return `${pagesBase}${path}`;
}

const DATA: Slide[] = [
  {
    tag: "День комплекса",
    photo: asset("/testimonials/chkalovskie-dachi.jpg"),
    photoAlt:
      "Живой концерт на сцене в парке отдыха «Чкаловские дачи» — организация event-агентства Закулисье",
    quote:
      "Обращались в агентство с запросом провести День Рождения комплекса. С первых встреч дамы уловили \"вайб\" площадки, выслушали наши пожелания и практически сразу же начали генерить гениальные идеи. Процесс согласования, разработки программы был максимально простым и чётким. Сметы, таблицы, тайминги — всё под рукой. В день мероприятия мы забыли о страшном слове \"суета, хлопоты\". Ведь девушки присутствовали на площадке всей командой: руководители, координаторы, организаторы. Безусловно рекомендую данную компанию к сотрудничеству. Приятные и компетентные дамы из мира ваших ЛУЧШИХ ивентов. Успехов вам!",
    name: "Клиент комплекса",
    pos: "Экопарк «Чкаловские дачи»",
    initials: "ЧД",
    company: "Экопарк «Чкаловские дачи»",
    source: "2gis",
  },
  {
    tag: "Family Day",
    photo: asset("/cases/semejnyj-korporativ-varmix-warmax/cover.webp"),
    photoAlt: "Семейный корпоратив Warmex — event-агентство Закулисье",
    quote:
      "Летом в 2023 году Закулисье устроило просто нереально красивое и насыщенное семейное мероприятие для нашей компании. Там было всё 🎉 и крутой кейтеринг и развлечения для взрослых и детей, бомбический ведущий 😄 Девчонки сделали его на все 💯 Без форс-мажоров Крутая команда, которая устроит праздник из обычного дня 🎊",
    name: "Ольга Рыбалко",
    pos: "Вармекс (WARMEX)",
    initials: "ОР",
    company: "WARMEX",
    source: "2gis",
  },
  {
    tag: "Корпоративный формат",
    photo: asset("/cases/korporativ-lyubimaya-kuhnya/cover.webp"),
    photoAlt: "Корпоративное мероприятие — event-агентство Закулисье",
    quote:
      "Очень креативные ребята, с интересными идеями, всегда на позитиве. Всю работу сделали очень качественно, вовремя. Мне нравится, что они всегда пойдут на встречу, решат любой форс-мажор и предложат варианты. Настоящие профессионалы. Рекомендую.",
    name: "Ирина Смирнова",
    pos: "Клиент",
    initials: "ИС",
    company: "—",
    source: "2gis",
  },
  {
    tag: "Корпоративный праздник",
    photo: asset("/cases/novogodnij-korporativ-alfa-dengi/cover.webp"),
    photoAlt: "Корпоративное мероприятие — event-агентство Закулисье",
    quote:
      "Добрый день. Выражаем огромную благодарность команде ивент-агентства \"Закулисье\" за индивидуальный подход и профессионализм при подготовке корпоративного праздника. Детали продуманы, работа слажена, результат отличный. Специалисты, которым можно доверять, которые знают и любят своё дело! Спасибо!",
    name: "Марина",
    pos: "Клиент",
    initials: "М",
    company: "—",
    source: "2gis",
  },
];

const MS = 5500;
const paused = false;

function pad(n: number): string {
  return String(n + 1).padStart(2, "0");
}

export function TestimonialsSpotlight() {
  const curRef = useRef(0);
  const goToRef = useRef<(idx: number) => void>(() => {});
  const [cur, setCur] = useState(0);
  const rafIdRef = useRef(0);
  const startTRef = useRef(0);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);

  const d0 = DATA[0]!;
  const [photoSrc, setPhotoSrc] = useState(d0.photo);
  const [photoAlt, setPhotoAlt] = useState(d0.photoAlt);
  const [photoCaseText, setPhotoCaseText] = useState(d0.company);
  const [photoSwitching, setPhotoSwitching] = useState(false);
  const [photoLogo, setPhotoLogo] = useState(Boolean(d0.photoLogo));
  const [featTag, setFeatTag] = useState(d0.tag);
  const [featQuoteText, setFeatQuoteText] = useState(d0.quote);
  const [featAvatar, setFeatAvatar] = useState(d0.initials);
  const [featName, setFeatName] = useState(d0.name);
  const [featPos, setFeatPos] = useState(d0.pos);
  const [bigNumText, setBigNumText] = useState(pad(0));
  const [hdrCountText, setHdrCountText] = useState(pad(0));
  const [quoteAnimating, setQuoteAnimating] = useState(false);

  const clearSlideTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];
  }, []);

  const pushTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeoutIdsRef.current.push(id);
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === curRef.current) return;
      curRef.current = idx;
      setCur(idx);
      const d = DATA[idx]!;

      clearSlideTimeouts();

      setPhotoSwitching(true);
      pushTimeout(() => {
        setPhotoSrc(d.photo);
        setPhotoAlt(d.photoAlt);
        setPhotoCaseText(d.company);
        setPhotoLogo(Boolean(d.photoLogo));
        setPhotoSwitching(false);
      }, 300);

      setQuoteAnimating(true);
      pushTimeout(() => {
        setFeatTag(d.tag);
        setFeatQuoteText(d.quote);
        setFeatAvatar(d.initials);
        setFeatName(d.name);
        setFeatPos(d.pos);
        setBigNumText(pad(idx));
        setHdrCountText(pad(idx));
        setQuoteAnimating(false);
      }, 220);
    },
    [clearSlideTimeouts, pushTimeout]
  );

  goToRef.current = goTo;

  const next = useCallback(() => {
    goToRef.current((curRef.current + 1) % DATA.length);
  }, []);

  const stopAuto = useCallback(() => {
    cancelAnimationFrame(rafIdRef.current);
  }, []);

  const startAuto = useCallback(() => {
    startTRef.current = performance.now();
    if (progressFillRef.current) progressFillRef.current.style.width = "0%";
    cancelAnimationFrame(rafIdRef.current);

    const animProgress = () => {
      if (paused) {
        rafIdRef.current = requestAnimationFrame(animProgress);
        return;
      }
      const el = progressFillRef.current;
      const pct = Math.min(((performance.now() - startTRef.current) / MS) * 100, 100);
      if (el) el.style.width = `${pct}%`;
      if (pct >= 100) {
        goToRef.current((curRef.current + 1) % DATA.length);
        startTRef.current = performance.now();
      }
      rafIdRef.current = requestAnimationFrame(animProgress);
    };

    rafIdRef.current = requestAnimationFrame(animProgress);
  }, []);

  useEffect(() => {
    startAuto();
    return () => {
      stopAuto();
      clearSlideTimeouts();
    };
  }, [startAuto, stopAuto, clearSlideTimeouts]);

  const hdrRevealRef  = useRef<HTMLDivElement | null>(null);
  const mainRevealRef = useRef<HTMLDivElement | null>(null);
  const touchStartX   = useRef(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (!x.isIntersecting) return;
          x.target.classList.add(styles.revealVisible);
          io.unobserve(x.target);
        });
      },
      { threshold: 0.1 }
    );
    if (hdrRevealRef.current) io.observe(hdrRevealRef.current);
    if (mainRevealRef.current) io.observe(mainRevealRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.spotRoot}>
      <section className={styles.section} aria-label="Отзывы клиентов">
        <div ref={hdrRevealRef} className={`${styles.hdr} ${styles.reveal}`}>
          <div>
            <div className={styles.hdrLabel}>Репутация</div>
            <h2 className={styles.hdrTitle}>
              Говорят
              <br />
              <span>клиенты</span>
            </h2>
          </div>
          <div className={styles.hdrCount} id="hdrCount">
            {hdrCountText}
          </div>
        </div>

        <div
          ref={mainRevealRef}
          className={`${styles.main} ${styles.reveal}`}
          style={{ transitionDelay: "0.15s" }}
          onTouchStart={(e) => { touchStartX.current = e.touches[0]?.clientX ?? 0; }}
          onTouchEnd={(e) => {
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
            if (Math.abs(dx) < 45) return;
            if (dx < 0) { goToRef.current((curRef.current + 1) % DATA.length); stopAuto(); startAuto(); }
            else        { goToRef.current((curRef.current - 1 + DATA.length) % DATA.length); stopAuto(); startAuto(); }
          }}
        >
          <div
            id="photoPanel"
            className={`${styles.photoPanel} ${photoSwitching ? styles.photoPanelSwitching : ""} ${photoLogo ? styles.photoPanelLogo : ""}`}
          >
            <img id="featPhoto" src={photoSrc} alt={photoAlt} />
            <div className={styles.photoOverlay} />
            <div className={styles.photoCaseLink}>
              <span id="photoCase">{photoCaseText}</span>
              <span>↗</span>
            </div>
          </div>

          <div className={styles.featured}>
            {DATA[cur]?.source === "2gis" ? (
              <span className={styles.sourceBadge}>2ГИС</span>
            ) : null}
            <div className={styles.featNum} id="bigNum">
              {bigNumText}
            </div>
            <div className={styles.featTag} id="featTag">
              {featTag}
            </div>
            <blockquote
              className={`${styles.featQuote} ${quoteAnimating ? styles.featQuoteAnimating : ""}`}
              id="featQuote"
            >
              {featQuoteText}
            </blockquote>
            <div className={styles.featMeta}>
              <div className={styles.featAvatar} id="featAvatar">
                {featAvatar}
              </div>
              <div>
                <div className={styles.featName} id="featName">
                  {featName}
                </div>
                <div className={styles.featPos} id="featPos">
                  {featPos}
                </div>
              </div>
            </div>
            <div className={styles.progress}>
              <div ref={progressFillRef} className={styles.progressFill} id="progressFill" />
            </div>
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.ctrl}
                id="btnPrev"
                aria-label="Предыдущий отзыв"
                onClick={() => {
                  goTo((curRef.current - 1 + DATA.length) % DATA.length);
                  stopAuto();
                  startAuto();
                }}
              >
                <svg width="13" height="8" viewBox="0 0 13 8" fill="none" aria-hidden>
                  <path
                    d="M12 4H1M5 1L1 4l4 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className={styles.ctrl}
                id="btnNext"
                aria-label="Следующий отзыв"
                onClick={() => {
                  next();
                  stopAuto();
                  startAuto();
                }}
              >
                <svg width="13" height="8" viewBox="0 0 13 8" fill="none" aria-hidden>
                  <path
                    d="M1 4h11M8 1l4 3-4 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Thumbnails — desktop */}
          <div className={styles.thumbs} id="thumbs">
            {DATA.map((item, i) => (
              <div
                key={item.photo}
                role="button"
                tabIndex={0}
                className={`${styles.thumb} ${i === cur ? styles.thumbActive : ""}`}
                onClick={() => { goTo(i); stopAuto(); startAuto(); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goTo(i);
                    stopAuto();
                    startAuto();
                  }
                }}
              >
                <div className={styles.thumbImg}>
                  <img src={item.photo} alt={item.photoAlt} loading="lazy" />
                </div>
                <div>
                  <div className={styles.thumbTag}>{item.tag}</div>
                  <div className={styles.thumbName}>{item.name}</div>
                  <div className={styles.thumbCo}>{item.company}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Dot navigation — mobile only */}
          <div className={styles.mobileDots} role="tablist" aria-label="Навигация по отзывам">
            {DATA.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === cur}
                aria-label={`Отзыв ${i + 1}`}
                className={`${styles.mobileDot} ${i === cur ? styles.mobileDotActive : ""}`}
                onClick={() => { goTo(i); stopAuto(); startAuto(); }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
