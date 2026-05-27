import { ContactForm } from "@/components/forms/ContactForm";
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/constants";

import styles from "./ContactSection.module.css";

const TRUST_ITEMS = [
  "20 лет и 3 000+ реализованных мероприятий",
  "Металл Профиль, Альфа-Банк, Леруа Мерлен — среди клиентов",
  "Собственный реквизит и команда — никаких субподрядных рисков",
] as const;

export function ContactSection() {
  return (
    <section id="contact-form" className={`${styles.section} scroll-mt-20`} aria-label="Заявка">
      <div className={styles.grid}>
        <aside className={styles.left}>
          <div className={styles.leftInner}>
            <p className={styles.eyebrow}>Начать диалог</p>
            <h2 className={styles.headline}>
              Давайте
              <br />
              <span>поговорим</span>
            </h2>
            <p className={styles.lead}>
              Расскажите о задаче — предложим решение. Свяжемся в течение нескольких часов. Без
              шаблонных КП.
            </p>
            <ul className={styles.trustList}>
              {TRUST_ITEMS.map((item) => (
                <li key={item} className={styles.trustItem}>
                  <span className={styles.trustIcon} aria-hidden>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.contactBlock}>
            <p className={styles.contactLabel}>Или напишите напрямую</p>
            <a href={`tel:${CONTACT_PHONE_TEL}`} className={styles.contactPhone} data-analytics="phone">
              {CONTACT_PHONE}
            </a>
          </div>
        </aside>
        <div className={styles.right}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
