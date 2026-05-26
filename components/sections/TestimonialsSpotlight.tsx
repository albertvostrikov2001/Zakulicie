"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./TestimonialsSpotlight.module.css";

type Slide = {
  tag: string;
  photo: string;
  photoAlt: string;
  quote: string;
  name: string;
  pos: string;
  initials: string;
  company: string;
};

const DATA: Slide[] = [
  {
    tag: "Дилерский съезд",
    photo:
      "https://albertvostrikov2001.github.io/Zakulicie/cases/syezd-dilerov-metall-profil/gallery/02.webp",
    photoAlt: "Съезд дилеров",
    quote:
      "Закулисье организовали дилерский съезд в формате регаты — масштабно, технически безупречно. Каждая деталь была проработана заранее: от логистики участников до финального фейерверка над водой. Это был лучший съезд за историю компании.",
    name: "Михаил Петровский",
    pos: "Директор по развитию · Металл Профиль",
    initials: "МП",
    company: "Металл Профиль",
  },
  {
    tag: "Открытие объекта",
    photo: "https://albertvostrikov2001.github.io/Zakulicie/cases/otkrytie-ofisov-alfa-bank/cover.webp",
    photoAlt: "Открытие Альфа-Банка",
    quote:
      "Открытие четырёх офисов одновременно — задача, с которой справились только они. Строго в срок, строго в концепции, ноль компромиссов по качеству. Гости уходили с ощущением федерального события.",
    name: "Анна Белова",
    pos: "Директор по маркетингу · Альфа-Банк",
    initials: "АБ",
    company: "Альфа-Банк",
  },
  {
    tag: "Корпоративный праздник",
    photo: "https://albertvostrikov2001.github.io/Zakulicie/cases/semejnyj-korporativ-varmix-warmax/cover.webp",
    photoAlt: "Family Day Warmex",
    quote:
      "Семейный праздник на 1200 человек. Закулисье создали программу, которую взрослые запомнили так же хорошо, как дети. Мы продолжаем работу третий год подряд — это лучший показатель.",
    name: "Светлана Комарова",
    pos: "HR-директор · Warmex",
    initials: "СК",
    company: "Warmex",
  },
  {
    tag: "Юбилей бренда",
    photo: "https://albertvostrikov2001.github.io/Zakulicie/cases/yubilej-sts-25-let/cover.webp",
    photoAlt: "25-летие СТС",
    quote:
      "Прямой эфир, живой оркестр, полторы тысячи гостей. Ни один из трёх часов программы не дал сбоя. Настолько слаженная работа — это не организация, это режиссура.",
    name: "Дмитрий Николаев",
    pos: "Исполнительный продюсер · СТС",
    initials: "ДН",
    company: "СТС",
  },
  {
    tag: "Тимбилдинг",
    photo: "https://albertvostrikov2001.github.io/Zakulicie/cases/spartakiada-metall-profil/cover.webp",
    photoAlt: "Спартакиада",
    quote:
      "180 инженеров, которые никогда не хотели командных игр. Закулисье нашли формат, который объединил людей без принуждения — через общую задачу, а не через принудительное веселье.",
    name: "Ольга Сергеева",
    pos: "Директор по персоналу · Промэко",
    initials: "ОС",
    company: "Промэко",
  },
  {
    tag: "Гала-вечер",
    photo: "https://albertvostrikov2001.github.io/Zakulicie/cases/blagotvoritelnyj-bal-detskaya-ploshchadka/cover.webp",
    photoAlt: "Благотворительный бал",
    quote:
      "600 гостей, все топ-менеджеры и меценаты. Закулисье провели вечер так, что никто не ушёл раньше финала и все оставили пожертвования выше ожидаемых.",
    name: "Наталья Кузьмина",
    pos: "Президент фонда · Добрые руки",
    initials: "НК",
    company: "Добрые руки",
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

  const hdrRevealRef = useRef<HTMLDivElement | null>(null);
  const mainRevealRef = useRef<HTMLDivElement | null>(null);

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
        >
          <div
            id="photoPanel"
            className={`${styles.photoPanel} ${photoSwitching ? styles.photoPanelSwitching : ""}`}
          >
            <img id="featPhoto" src={photoSrc} alt={photoAlt} />
            <div className={styles.photoOverlay} />
            <div className={styles.photoCaseLink}>
              <span id="photoCase">{photoCaseText}</span>
              <span>↗</span>
            </div>
          </div>

          <div className={styles.featured}>
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

          <div className={styles.thumbs} id="thumbs">
            {DATA.map((item, i) => (
              <div
                key={item.photo}
                role="button"
                tabIndex={0}
                className={`${styles.thumb} ${i === cur ? styles.thumbActive : ""}`}
                onClick={() => {
                  goTo(i);
                  stopAuto();
                  startAuto();
                }}
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
        </div>
      </section>
    </div>
  );
}
