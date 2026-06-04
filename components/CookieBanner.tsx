"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./CookieBanner.module.css";

const STORAGE_KEY = "zak_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={styles.banner}
      role="region"
      aria-label="Уведомление об использовании cookie"
    >
      <p className={styles.text}>
        Мы используем файлы cookie для анализа посещаемости сайта. Продолжая
        работу с сайтом, вы соглашаетесь с нашей{" "}
        <Link href="/privacy-policy" className={styles.link}>
          политикой конфиденциальности
        </Link>
        .
      </p>
      <button type="button" className={styles.btn} onClick={accept}>
        Принять
      </button>
    </div>
  );
}
