/** Отображаемый URL сайта (для текстов и политики конфиденциальности) */
export const SITE_DISPLAY_URL = "https://закулисье-54.рф";

/** Публичные контакты агентства */
export const CONTACT_PHONE     = "+7 (923) 246-05-05";
export const CONTACT_PHONE_TEL = "+79232460505";
export const CONTACT_EMAIL     = "zakulisie54@gmail.com";

/** Дополнительный мобильный (директор) — используется в реквизитах */
export const CONTACT_PHONE_MOBILE     = "+7 (923) 246-05-05";
export const CONTACT_PHONE_MOBILE_TEL = "+79232460505";

/** Юридический адрес (из реквизитов) */
export const CONTACT_CITY          = "Новосибирск";
export const CONTACT_STREET        = "ул. Караваева, 61";
export const CONTACT_POSTAL_CODE   = "630004";

/** Соцсети и мессенджеры */
export const SOCIAL_VK          = "https://vk.ru/zakulisie54";
export const SOCIAL_INSTAGRAM   = "https://www.instagram.com/katya__elgina";
export const SOCIAL_WHATSAPP    = "https://wa.me/79134523469";
export const SOCIAL_2GIS        = "https://2gis.ru/novosibirsk/geo/70000001079214908";
export const SOCIAL_YANDEX_MAPS = "https://yandex.ru/maps/org/zakulisye/42212525268?si=hj9qh76kj8b2ryt55j7rcncmvw";
export const SOCIAL_MAX         = "https://max.ru/u/f9LHodD0cOLDTtTRN_j8H9YCY8z9Bm500Rk22thHllIdlzunS2vdqSvZC44";
export const CONTACT_TELEGRAM   = "https://t.me/Katya_Elgina";

export const EVENT_TYPE_OPTIONS = [
  { value: "corporate", label: "Корпоративное" },
  { value: "business", label: "Деловое" },
  { value: "team", label: "Тимбилдинг" },
  { value: "promo", label: "Рекламная акция" },
  { value: "opening", label: "Открытие" },
  { value: "other", label: "Другое" },
] as const;
